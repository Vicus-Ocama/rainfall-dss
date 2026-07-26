import { History } from "lucide-react";
import ComingSoon from "@/components/ComingSoon";

export default function HistoryPage() {
  return (
    <ComingSoon
      icon={<History size={28} />}
      title="History"
      description="A log of past forecasts and observed outcomes will appear here once historical tracking is wired up to the model backend."
    />
  );
}
