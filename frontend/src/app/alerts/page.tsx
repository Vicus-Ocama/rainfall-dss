import { Bell } from "lucide-react";
import ComingSoon from "@/components/ComingSoon";

export default function AlertsPage() {
  return (
    <ComingSoon
      icon={<Bell size={28} />}
      title="Alerts"
      description="Configurable notifications for heavy rain and other forecast thresholds will be managed here."
    />
  );
}
