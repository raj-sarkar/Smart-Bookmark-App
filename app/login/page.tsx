import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import LoginButton from "./LoginButton";

export default async function LoginPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex h-screen items-center justify-center p-2">
      <div className="x-4 py-8 rounded-lg text-center bg-gray-900 w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6">Welcome Back!</h1>
        <p className="mb-4 text-gray-400">Please sign in to manage your bookmarks.</p>
        <LoginButton />
      </div>
    </div>
  );
}
