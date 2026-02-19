import { createClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Home() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="flex flex-col items-center justify-center h-screen gap-6 text-center p-4">
      <h1 className="text-4xl font-bold">
        Bookmark Manager
      </h1>

      <p className="text-gray-600">
        Save and manage your favorite links securely.
      </p>

      <Link
        href="/login"
        className="px-6 py-2 bg-gray-200 text-black rounded hover:bg-gray-300 "
      >
        Get Started
      </Link>
    </main>
  );
}
