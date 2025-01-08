import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ChargerBootNotificationProps {
  chargerId: string;
}

const ChargerBootNotification = ({ chargerId }: ChargerBootNotificationProps) => {
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  const connectWebSocket = () => {
    setIsConnecting(true);
    
    // Create WebSocket connection
    const wsUrl = `wss://lhwtwicfvzouosutiaap.functions.supabase.co/ocpp-server?chargePointId=${chargerId}`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('WebSocket connected');
      setSocket(ws);
      setIsConnecting(false);
      toast({
        title: "Connected",
        description: `Charger ${chargerId} connected successfully`,
      });

      // Send BootNotification
      const bootNotification = [
        2, // Request
        chargerId,
        "BootNotification",
        {
          chargePointVendor: "Test Vendor",
          chargePointModel: "Test Model",
          firmwareVersion: "1.0.0",
        },
      ];
      ws.send(JSON.stringify(bootNotification));
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setSocket(null);
      toast({
        title: "Disconnected",
        description: `Charger ${chargerId} disconnected`,
        variant: "destructive",
      });
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnecting(false);
      toast({
        title: "Connection Error",
        description: "Failed to connect to OCPP server",
        variant: "destructive",
      });
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log('Received message:', message);
    };
  };

  const disconnectWebSocket = () => {
    if (socket) {
      socket.close();
      setSocket(null);
    }
  };

  return (
    <div className="space-y-4">
      {!socket ? (
        <Button 
          onClick={connectWebSocket} 
          disabled={isConnecting}
        >
          {isConnecting ? "Connecting..." : "Connect & Send Boot Notification"}
        </Button>
      ) : (
        <Button 
          onClick={disconnectWebSocket}
          variant="destructive"
        >
          Disconnect
        </Button>
      )}
    </div>
  );
};

export default ChargerBootNotification;