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

serve(async (req) => {
  // Check if this is a WebSocket connection attempt
  const upgrade = req.headers.get('upgrade') || ''
  const isWebSocket = upgrade.toLowerCase() === 'websocket'

  // If it's a WebSocket connection attempt, broadcast it
  if (isWebSocket) {
    console.log('WebSocket connection attempt detected')
    
    const { error: broadcastError } = await supabase
      .channel('ocpp-messages')
      .send({
        type: 'broadcast',
        event: 'ocpp_message',
        payload: {
          messageType: 'CONNECTION',
          messageId: crypto.randomUUID(),
          action: 'WebSocket Connection Attempt',
          payload: {
            timestamp: new Date().toISOString(),
            headers: Object.fromEntries(req.headers.entries())
          },
        },
      })

    if (broadcastError) {
      console.error('Error broadcasting connection attempt:', broadcastError)
    }

    // Proceed with WebSocket upgrade
    try {
      const { socket, response } = Deno.upgradeWebSocket(req)
      
      socket.onopen = () => {
        console.log('WebSocket connection opened')
        supabase
          .channel('ocpp-messages')
          .send({
            type: 'broadcast',
            event: 'ocpp_message',
            payload: {
              messageType: 'CONNECTION',
              messageId: crypto.randomUUID(),
              action: 'WebSocket Connected',
              payload: {
                timestamp: new Date().toISOString(),
                status: 'connected'
              },
            },
          })
      }

      socket.onclose = () => {
        console.log('WebSocket connection closed')
        supabase
          .channel('ocpp-messages')
          .send({
            type: 'broadcast',
            event: 'ocpp_message',
            payload: {
              messageType: 'CONNECTION',
              messageId: crypto.randomUUID(),
              action: 'WebSocket Disconnected',
              payload: {
                timestamp: new Date().toISOString(),
                status: 'disconnected'
              },
            },
          })
      }

      socket.onmessage = async (event) => {
        try {
          const message = JSON.parse(event.data)
          console.log('Received WebSocket message:', message)

          const [messageTypeId, uniqueId, action, payload] = message

          // Broadcast the OCPP message to all subscribers
          const { error: broadcastError } = await supabase
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

          if (broadcastError) {
            console.error('Error broadcasting message:', broadcastError)
          }

          if (messageTypeId === 2) { // Client-initiated request
            switch (action) {
              case "BootNotification": {
                console.log('Processing boot notification:', payload)
                
                const { error: updateError } = await supabase
                  .from('chargers')
                  .update({ 
                    last_boot_payload: payload,
                    status: 'Available'
                  })
                  .eq('charge_point_id', uniqueId)

                if (updateError) {
                  console.error('Error updating charger:', updateError)
                  throw updateError
                }

                const response = {
                  status: "Accepted",
                  currentTime: new Date().toISOString(),
                  interval: 300
                }

                socket.send(JSON.stringify([3, uniqueId, response]))
                break;
              }

              default:
                console.log(`Unhandled action: ${action}`)
                socket.send(JSON.stringify([4, uniqueId, "NotImplemented", {}, {}]))
            }
          }
        } catch (error) {
          console.error('Error processing WebSocket message:', error)
        }
      }

      return response
    } catch (error) {
      console.error('WebSocket upgrade failed:', error)
      return new Response('WebSocket upgrade failed', { status: 500, headers: corsHeaders })
    }
  }

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  // Handle regular HTTP requests
  try {
    const body = await req.json()
    console.log('Received HTTP message:', body)

    const [messageTypeId, uniqueId, action, payload] = body

    // Broadcast the OCPP message to all subscribers
    const { error: broadcastError } = await supabase
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

    if (broadcastError) {
      console.error('Error broadcasting message:', broadcastError)
    }

    if (messageTypeId === 2) {
      switch (action) {
        case "BootNotification": {
          console.log('Processing boot notification:', payload)
          
          const { error: updateError } = await supabase
            .from('chargers')
            .update({ 
              last_boot_payload: payload,
              status: 'Available'
            })
            .eq('charge_point_id', uniqueId)

          if (updateError) {
            console.error('Error updating charger:', updateError)
            throw updateError
          }

          const response = {
            status: "Accepted",
            currentTime: new Date().toISOString(),
            interval: 300
          }

          return new Response(
            JSON.stringify([3, uniqueId, response]),
            { 
              headers: {
                ...corsHeaders,
                'Content-Type': 'application/json'
              }
            }
          )
        }

        default:
          console.log(`Unhandled action: ${action}`)
          return new Response(
            JSON.stringify([4, uniqueId, "NotImplemented", {}, {}]),
            { 
              headers: {
                ...corsHeaders,
                'Content-Type': 'application/json'
              }
            }
          )
      }
    }

    throw new Error('Invalid message type')

  } catch (error) {
    console.error('Error processing request:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )
  }
})