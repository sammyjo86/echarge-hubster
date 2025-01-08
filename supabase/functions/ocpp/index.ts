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
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const body = await req.json()
    console.log('Received message:', body)

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

    if (messageTypeId === 2) { // Client-initiated request
      switch (action) {
        case "BootNotification": {
          console.log('Processing boot notification:', payload)
          
          // Update charger with boot notification payload
          const { error: updateError } = await supabase
            .from('chargers')
            .update({ 
              last_boot_payload: JSON.stringify(payload),
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