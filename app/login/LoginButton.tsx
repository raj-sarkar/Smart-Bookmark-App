"use client";

import { createClient } from "@/lib/supabase-client";

export default function LoginButton() {
    const supabase = createClient();

    const handleLogin = async () => {
        await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
            },
        });
    };

    return (
        <button
            onClick={handleLogin}
            className="px-4 py-2 bg-black text-white rounded cursor-pointer hover:bg-gray-800 flex flex-row items-center gap-2 m-auto"
        >
            <img src="/google.svg" alt="Google logo" className="w-5 h-5" />
            Sign in with Google
        </button>
    );
}
