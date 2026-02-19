import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import DashboardClient from "@/components/DashboardClient";
import { Bookmark } from "@/models/bookmark.model";

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let { data: bookmarks } = await supabase
    .from("bookmarks")
    .select("*")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false });

  if (!user) redirect("/login");

  return <DashboardClient initialBookmarks={(bookmarks as Bookmark[]) ?? []} user={user} />;
}
