import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Radio } from "lucide-react";
import { AddChargerDialog } from "@/components/charger-config/AddChargerDialog";
import ChargerBootNotification from "@/components/charger-config/ChargerBootNotification";
import { Link } from "react-router-dom";

interface Charger {
  id: string;
  charge_point_id: string;
  name: string;
  location: string;
  status: string;
  is_authorized: boolean;
  password: string | null;
  last_boot_payload: string | null;
}

const ChargerConfig = () => {
  const [chargers, setChargers] = useState<Charger[]>([]);
  const [showPasswords, setShowPasswords] = useState<{ [key: string]: boolean }>({});
  const { toast } = useToast();

  useEffect(() => {
    fetchChargers();
  }, []);

  const fetchChargers = async () => {
    const { data, error } = await supabase
      .from("chargers")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error fetching chargers",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setChargers(data || []);
  };

  const handleAuthorization = async (chargerId: string, isAuthorized: boolean) => {
    const { error } = await supabase
      .from("chargers")
      .update({ is_authorized: isAuthorized })
      .eq("id", chargerId);

    if (error) {
      toast({
        title: "Error updating charger",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    fetchChargers();
    toast({
      title: "Charger updated",
      description: `Charger ${isAuthorized ? "authorized" : "unauthorized"} successfully`,
    });
  };

  const handleUpdatePassword = async (chargerId: string, newPassword: string) => {
    const { error } = await supabase
      .from("chargers")
      .update({ password: newPassword })
      .eq("id", chargerId);

    if (error) {
      toast({
        title: "Error updating password",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    fetchChargers();
    toast({
      title: "Password updated",
      description: "Charger password updated successfully",
    });
  };

  const togglePasswordVisibility = (chargerId: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [chargerId]: !prev[chargerId]
    }));
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Charger Configuration</h1>
        <div className="flex items-center gap-4">
          <Link to="/ocpp-monitor">
            <Button variant="outline" className="flex items-center gap-2">
              <Radio className="h-4 w-4" />
              OCPP Monitor
            </Button>
          </Link>
          <AddChargerDialog onChargerAdded={fetchChargers} />
        </div>
      </div>

      <div className="grid gap-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Charge Point ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Authorization</TableHead>
              <TableHead>Password</TableHead>
              <TableHead>Boot Notification</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {chargers.map((charger) => (
              <TableRow key={charger.id}>
                <TableCell>{charger.charge_point_id}</TableCell>
                <TableCell>{charger.name}</TableCell>
                <TableCell>{charger.location}</TableCell>
                <TableCell>{charger.status}</TableCell>
                <TableCell>
                  <Switch
                    checked={charger.is_authorized}
                    onCheckedChange={(checked) =>
                      handleAuthorization(charger.id, checked)
                    }
                  />
                </TableCell>
                <TableCell className="flex items-center gap-2">
                  <Input
                    type={showPasswords[charger.id] ? "text" : "password"}
                    value={charger.password || ""}
                    onChange={(e) => handleUpdatePassword(charger.id, e.target.value)}
                    className="w-40"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => togglePasswordVisibility(charger.id)}
                  >
                    {showPasswords[charger.id] ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </TableCell>
                <TableCell>
                  <ChargerBootNotification 
                    chargerId={charger.charge_point_id}
                    lastBootPayload={charger.last_boot_payload}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ChargerConfig;