import { FileText } from "lucide-react";
import ComingSoon from "@/components/ComingSoon";

export default function ReportsPage() {
  return (
    <ComingSoon
      icon={<FileText size={28} />}
      title="Reports"
      description="Exportable rainfall and advisory summaries for extension officers and researchers will be available here."
    />
  );
}
