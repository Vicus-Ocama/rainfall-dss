import { Settings } from "lucide-react";
import ComingSoon from "@/components/ComingSoon";

export default function SettingsPage() {
  return (
    <ComingSoon
      icon={<Settings size={28} />}
      title="Settings"
      description="Application preferences such as units, default location, and language will be configurable here."
    />
  );
}
