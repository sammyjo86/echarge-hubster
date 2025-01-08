import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";

interface Charger {
  id: string;
  charge_point_id: string;
  name: string;
  location: string;
  status: string;
  is_authorized: boolean;
}

const ChargerConfig = () => {
  const [chargers, setChargers] = useState<Charger[]>([]);
  const [newCharger, setNewCharger] = useState({
    charge_point_id: "",
    name: "",
    location: "",
  });
  const { toast } = useToast();
  const navigate = useNavigate();

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

  const handleAddCharger = async () => {
    const { error } = await supabase.from("chargers").insert([newCharger]);

    if (error) {
      toast({
        title: "Error adding charger",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setNewCharger({
      charge_point_id: "",
      name: "",
      location: "",
    });
    fetchChargers();
    toast({
      title: "Charger added",
      description: "New charger added successfully",
    });
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Charger Configuration</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Add New Charger</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Charger</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="charge_point_id">Charge Point ID</Label>
                <Input
                  id="charge_point_id"
                  value={newCharger.charge_point_id}
                  onChange={(e) =>
                    setNewCharger({
                      ...newCharger,
                      charge_point_id: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newCharger.name}
                  onChange={(e) =>
                    setNewCharger({ ...newCharger, name: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={newCharger.location}
                  onChange={(e) =>
                    setNewCharger({ ...newCharger, location: e.target.value })
                  }
                />
              </div>
              <Button onClick={handleAddCharger}>Add Charger</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Charge Point ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Authorization</TableHead>
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ChargerConfig;