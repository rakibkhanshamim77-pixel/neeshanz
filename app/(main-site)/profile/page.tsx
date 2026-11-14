import { ProfileGuard, ProfileView } from "@/components/profile";

export const metadata = {
  title: "Profile",
  description: "Your Neeshanz profile – orders, addresses, and settings.",
};

export default function ProfilePage() {
  return (
    <ProfileGuard>
      <ProfileView />
    </ProfileGuard>
  );
}
