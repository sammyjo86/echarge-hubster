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
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";

interface NewCharger {
  charge_point_id: string;
  name: string;
  location: string;
  password: string;
}

interface AddChargerDialogProps {
  onChargerAdded: () => void;
}

export const AddChargerDialog = ({ onChargerAdded }: AddChargerDialogProps) => {
  const { toast } = useToast();
  const [newCharger, setNewCharger] = React.useState<NewCharger>({
    charge_point_id: "",
    name: "",
    location: "",
    password: "",
  });

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
      password: "",
    });
    onChargerAdded();
    toast({
      title: "Charger added",
      description: "New charger added successfully",
    });
  };

  return (
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
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={newCharger.password}
              onChange={(e) =>
                setNewCharger({ ...newCharger, password: e.target.value })
              }
            />
          </div>
          <Button onClick={handleAddCharger}>Add Charger</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};