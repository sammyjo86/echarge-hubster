import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeft, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface OcppMessage {
  timestamp: string;
  messageType: string;
  messageId: string;
  action: string;
  payload: any;
}

const OcppMonitor = () => {
  const [messages, setMessages] = useState<OcppMessage[]>([]);

  useEffect(() => {
    // Subscribe to OCPP messages
    const channel = supabase
      .channel('ocpp-messages')
      .on(
        'broadcast',
        { event: 'ocpp_message' },
        (payload) => {
          setMessages((prev) => [
            {
              timestamp: new Date().toISOString(),
              messageType: payload.messageType,
              messageId: payload.messageId,
              action: payload.action,
              payload: payload.payload,
            },
            ...prev,
          ]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const downloadLogs = () => {
    const jsonString = JSON.stringify(messages, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ocpp-logs-${new Date().toISOString()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link to="/charger-config">
            <Button variant="outline" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">OCPP Monitor</h1>
        </div>
        <Button onClick={downloadLogs} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Download Logs
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Live OCPP Messages</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px] w-full rounded-md border p-4">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="grid gap-2">
                      <div className="text-sm text-muted-foreground">
                        {new Date(message.timestamp).toLocaleString()}
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <span className="font-medium">Type:</span>{" "}
                          {message.messageType}
                        </div>
                        <div>
                          <span className="font-medium">ID:</span>{" "}
                          {message.messageId}
                        </div>
                        <div>
                          <span className="font-medium">Action:</span>{" "}
                          {message.action}
                        </div>
                      </div>
                      <div className="mt-2">
                        <span className="font-medium">Payload:</span>
                        <pre className="mt-2 rounded-lg bg-muted p-4 overflow-x-auto">
                          {JSON.stringify(message.payload, null, 2)}
                        </pre>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default OcppMonitor;