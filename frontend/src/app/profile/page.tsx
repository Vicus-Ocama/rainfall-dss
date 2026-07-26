import { User } from "lucide-react";
import ComingSoon from "@/components/ComingSoon";

export default function ProfilePage() {
  return (
    <ComingSoon
      icon={<User size={28} />}
      title="User Profile"
      description="Account details and preferences will be manageable here once user accounts are introduced."
    />
  );
}
