import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "charging" | "available" | "offline" | "error";
  className?: string;
}

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const getStatusStyles = () => {
    switch (status) {
      case "charging":
        return "bg-primary/20 text-primary border-primary/30 charging-pulse";
      case "available":
        return "bg-green-500/20 text-green-600 border-green-500/30";
      case "offline":
        return "bg-gray-200 text-gray-600 border-gray-300";
      case "error":
        return "bg-destructive/20 text-destructive border-destructive/30";
      default:
        return "bg-gray-200 text-gray-600 border-gray-300";
    }
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        getStatusStyles(),
        className
      )}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};