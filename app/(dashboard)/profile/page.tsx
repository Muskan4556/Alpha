import { getSession } from "@/lib/session-server";
import { redirect } from "next/navigation";
import { ProfileView } from "@/components/profile/ProfileView";

export default async function ProfilePage() {
  const session = await getSession();
  if (!session) redirect("/login");

  return <ProfileView session={session} />;
}
