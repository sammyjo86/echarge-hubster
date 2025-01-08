import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  const upgrade = req.headers.get('upgrade') || ''
  if (upgrade.toLowerCase() != 'websocket') {
    return new Response('Expected Websocket', { status: 400 })
  }

  const { socket, response } = Deno.upgradeWebSocket(req)

  socket.onopen = () => {
    console.log('Client connected')
  }

  socket.onmessage = async (event) => {
    try {
      const message = JSON.parse(event.data)
      const [messageTypeId, uniqueId, action, payload] = message

      console.log(`Received message: ${action}`, payload)

      switch (action) {
        case "BootNotification": {
          const response = {
            status: "Accepted",
            currentTime: new Date().toISOString(),
            interval: 300
          }
          
          // Update charging station info
          await supabase
            .from('charging_stations')
            .upsert({
              charge_point_id: payload.chargePointVendor + "-" + payload.chargePointModel,
              name: payload.chargePointModel,
              firmware_version: payload.firmwareVersion,
              last_heartbeat: new Date().toISOString()
            })

          socket.send(JSON.stringify([3, uniqueId, response]))
          break
        }

        case "Heartbeat": {
          const response = {
            currentTime: new Date().toISOString()
          }
          
          // Update last heartbeat
          await supabase
            .from('charging_stations')
            .update({ last_heartbeat: new Date().toISOString() })
            .eq('charge_point_id', uniqueId)

          socket.send(JSON.stringify([3, uniqueId, response]))
          break
        }

        case "StatusNotification": {
          const response = {}
          
          // Update charging station status
          await supabase
            .from('charging_stations')
            .update({ status: payload.status })
            .eq('charge_point_id', uniqueId)

          socket.send(JSON.stringify([3, uniqueId, response]))
          break
        }

        case "StartTransaction": {
          const response = {
            transactionId: crypto.randomUUID(),
            idTagInfo: { status: "Accepted" }
          }
          
          // Create new transaction
          await supabase
            .from('charging_transactions')
            .insert({
              transaction_id: response.transactionId,
              station_id: payload.connectorId,
              meter_start: payload.meterStart,
              start_time: new Date().toISOString()
            })

          socket.send(JSON.stringify([3, uniqueId, response]))
          break
        }

        case "StopTransaction": {
          const response = {
            idTagInfo: { status: "Accepted" }
          }
          
          // Update transaction
          await supabase
            .from('charging_transactions')
            .update({
              meter_stop: payload.meterStop,
              end_time: new Date().toISOString(),
              energy_delivered: payload.meterStop - payload.meterStart,
              status: 'Completed'
            })
            .eq('transaction_id', payload.transactionId)

          socket.send(JSON.stringify([3, uniqueId, response]))
          break
        }

        default:
          console.log(`Unhandled action: ${action}`)
          socket.send(JSON.stringify([4, uniqueId, "NotImplemented", {}, {}]))
      }
    } catch (error) {
      console.error('Error processing message:', error)
      socket.send(JSON.stringify([4, "ERROR", "InternalError", {}, { error: error.message }]))
    }
  }

  socket.onerror = (e) => console.log('WebSocket error:', e)
  socket.onclose = () => console.log('Client disconnected')

  return response
})