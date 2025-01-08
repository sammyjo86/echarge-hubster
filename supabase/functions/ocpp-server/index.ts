import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

const connectedChargers = new Map()

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  const upgrade = req.headers.get('upgrade') || ''
  if (upgrade.toLowerCase() != 'websocket') {
    return new Response("Expected WebSocket upgrade", { 
      status: 426,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  const url = new URL(req.url)
  const chargePointId = url.searchParams.get('chargePointId')
  
  if (!chargePointId) {
    return new Response('Charge Point ID is required', { 
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  console.log(`Connection attempt from Charge Point: ${chargePointId}`)

  const { socket, response } = Deno.upgradeWebSocket(req)

  socket.onopen = async () => {
    console.log(`Charge Point ${chargePointId} connected`)
    connectedChargers.set(chargePointId, socket)

    // Broadcast connection status
    await supabase
      .channel('ocpp-messages')
      .send({
        type: 'broadcast',
        event: 'ocpp_message',
        payload: {
          messageType: 'STATUS',
          messageId: chargePointId,
          action: 'Connected',
          payload: {
            timestamp: new Date().toISOString(),
            status: 'Connected'
          },
        },
      })

    // Update charger status in database
    const { error: updateError } = await supabase
      .from('chargers')
      .update({ 
        status: 'Connected',
        is_authorized: true
      })
      .eq('charge_point_id', chargePointId)

    if (updateError) {
      console.error('Error updating charger status:', updateError)
    }
  }

  socket.onmessage = async (event) => {
    try {
      const message = JSON.parse(event.data)
      console.log(`Received message from ${chargePointId}:`, message)

      // Handle OCPP message
      const [messageTypeId, uniqueId, action, payload] = message
      
      // Broadcast the message to all subscribers
      await supabase
        .channel('ocpp-messages')
        .send({
          type: 'broadcast',
          event: 'ocpp_message',
          payload: {
            messageType: messageTypeId === 2 ? 'REQUEST' : 'RESPONSE',
            messageId: uniqueId,
            action,
            payload,
          },
        })

      // Handle specific OCPP messages
      if (action === 'BootNotification' && messageTypeId === 2) {
        // Send BootNotification response
        const response = [
          3, // Response
          uniqueId,
          {
            status: "Accepted",
            currentTime: new Date().toISOString(),
            interval: 300
          }
        ]
        socket.send(JSON.stringify(response))

        // Update charger info in database
        const { error: updateError } = await supabase
          .from('chargers')
          .update({ 
            last_boot_payload: payload,
            status: 'Available'
          })
          .eq('charge_point_id', chargePointId)

        if (updateError) {
          console.error('Error updating charger:', updateError)
        }
      }
    } catch (error) {
      console.error(`Error processing message from ${chargePointId}:`, error)
    }
  }

  socket.onclose = async () => {
    console.log(`Charge Point ${chargePointId} disconnected`)
    connectedChargers.delete(chargePointId)

    // Broadcast disconnection
    await supabase
      .channel('ocpp-messages')
      .send({
        type: 'broadcast',
        event: 'ocpp_message',
        payload: {
          messageType: 'STATUS',
          messageId: chargePointId,
          action: 'Disconnected',
          payload: {
            timestamp: new Date().toISOString(),
            status: 'Disconnected'
          },
        },
      })

    // Update charger status in database
    const { error: updateError } = await supabase
      .from('chargers')
      .update({ 
        status: 'Disconnected',
        is_authorized: false
      })
      .eq('charge_point_id', chargePointId)

    if (updateError) {
      console.error('Error updating charger status:', updateError)
    }
  }

  socket.onerror = (error) => {
    console.error(`WebSocket error for ${chargePointId}:`, error)
  }

  return response
})