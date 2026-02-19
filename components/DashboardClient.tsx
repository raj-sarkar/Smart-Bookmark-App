"use client";

import { useState } from "react";
import BookmarkList from "@/components/BookmarkList";
import { createClient } from "@/lib/supabase-client";
import { Bookmark } from "@/models/bookmark.model";

export default function DashboardClient({
    initialBookmarks,
    user,
}: {
    initialBookmarks: Bookmark[];
    user: any;
}) {
    const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks);
    const supabase = createClient();

    const addBookmark = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const fd = new FormData(form);
        const title = (fd.get("title") as string) ?? "";
        const url = (fd.get("url") as string) ?? "";

        const { data, error } = await supabase
            .from("bookmarks")
            .insert({ title, url, user_id: user?.id })
            .select()
            .single();

        if (!error && data) {
            setBookmarks((prev) => [data as Bookmark, ...prev]);
            form.reset();
            const bc = new BroadcastChannel("bookmarks");
            bc.postMessage({ type: "added", bookmark: data });
            bc.close();
            localStorage.setItem("bookmarks-sync", JSON.stringify({ type: "added", bookmark: data, ts: Date.now() }));
        }
    };

    const deleteBookmark = async (id: string) => {
        const { error } = await supabase.from("bookmarks").delete().eq("id", id);
        if (!error) {
            setBookmarks((prev) => prev.filter((b) => b.id !== id));
            const bc = new BroadcastChannel("bookmarks");
            bc.postMessage({ type: "deleted", id });
            bc.close();
            localStorage.setItem("bookmarks-sync", JSON.stringify({ type: "deleted", id, ts: Date.now() }));
        }
    };

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold">Welcome {user.user_metadata.full_name}</h1>

            <form onSubmit={addBookmark} className="flex flex-col gap-4 sm:flex-row items-center">
                <input 
                    name="title" placeholder="Title" 
                    required 
                    className="bg-[#222630] px-4 py-3 outline-none w-70 text-white rounded-lg border-2 transition-colors duration-100 border-solid focus:border-[#596A95] border-[#2B3040]"
                    />
                <input 
                    name="url" placeholder="https://example.com" 
                    required 
                    className="bg-[#222630] px-4 py-3 outline-none w-70 text-white rounded-lg border-2 transition-colors duration-100 border-solid focus:border-[#596A95] border-[#2B3040]" 
                />
                <button 
                    type="submit" 
                    className="h-10 bg-green-500 text-white px-4 rounded cursor-pointer hover:bg-green-600"
                >Add
                </button>
            </form>

            <h2 className="text-xl font-semibold">Your Bookmarks:</h2>

            <BookmarkList initialBookmarks={bookmarks} deleteBookmark={deleteBookmark} />
        </div>
    );
}
