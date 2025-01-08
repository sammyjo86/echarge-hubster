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
    console.log('Received relay message:', body)

    const { messageType, chargePointId, action, payload } = body

    // Broadcast the message to all subscribers
    await supabase
      .channel('ocpp-messages')
      .send({
        type: 'broadcast',
        event: 'ocpp_message',
        payload: {
          messageType,
          messageId: chargePointId,
          action,
          payload,
        },
      })

    // Update charger status if it's a boot notification
    if (action === 'BootNotification') {
      const { error: updateError } = await supabase
        .from('chargers')
        .update({ 
          last_boot_payload: payload,
          status: 'Available'
        })
        .eq('charge_point_id', chargePointId)

      if (updateError) {
        console.error('Error updating charger:', updateError)
        throw updateError
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error processing request:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})