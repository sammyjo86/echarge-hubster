import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const DepotMap = () => {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Depot Map</CardTitle>
      </CardHeader>
      <CardContent className="h-[400px] bg-accent/50 rounded-lg flex items-center justify-center">
        <p className="text-muted-foreground">Interactive depot map coming soon</p>
      </CardContent>
    </Card>
  );
};