import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";

interface ChargingDeviation {
  busId: string;
  soc: number;
  departureTime: string;
  parkingSpot: string;
  deviationTime: string;
}

const mockDeviations: ChargingDeviation[] = [
  {
    busId: "BUS-003",
    soc: 15,
    departureTime: "06:30",
    parkingSpot: "A-12",
    deviationTime: "2h 15min",
  },
  {
    busId: "BUS-007",
    soc: 45,
    departureTime: "07:15",
    parkingSpot: "B-03",
    deviationTime: "1h 30min",
  },
  {
    busId: "BUS-012",
    soc: 65,
    departureTime: "05:45",
    parkingSpot: "A-08",
    deviationTime: "45min",
  },
];

export const ChargingDeviations = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center space-y-0">
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-destructive" />
          Charging Deviations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Bus ID</TableHead>
              <TableHead>SOC</TableHead>
              <TableHead>Departure</TableHead>
              <TableHead>Parking Spot</TableHead>
              <TableHead>Deviation Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockDeviations.map((deviation) => (
              <TableRow key={deviation.busId}>
                <TableCell className="font-medium">{deviation.busId}</TableCell>
                <TableCell className="text-destructive font-medium">
                  {deviation.soc}%
                </TableCell>
                <TableCell>{deviation.departureTime}</TableCell>
                <TableCell>{deviation.parkingSpot}</TableCell>
                <TableCell>{deviation.deviationTime}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};