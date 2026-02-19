"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase-client";
import { Bookmark } from "@/models/bookmark.model";

export default function BookmarkList({
    initialBookmarks,
    deleteBookmark
}: {
    initialBookmarks: Bookmark[];
    deleteBookmark: (id: string) => Promise<void>;
}) {
    const supabase = createClient();
    const [bookmarks, setBookmarks] = useState(initialBookmarks);

    useEffect(() => {
        setBookmarks(initialBookmarks);
    }, [initialBookmarks]);

    useEffect(() => {
        const channel = supabase
            .channel("bookmarks-realtime")
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "bookmarks",
                },
                (payload) => {
                    if (payload.eventType === "INSERT") {
                        setBookmarks((prev) => {
                            const id = (payload.new as Bookmark).id;
                            if (prev.some((b) => b.id === id)) return prev;
                            return [payload.new as Bookmark, ...prev];
                        });
                    }

                    if (payload.eventType === "DELETE") {
                        setBookmarks((prev) =>
                            prev.filter((b) => b.id !== payload.old.id)
                        );
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [supabase]);

    useEffect(() => {
        const bc = new BroadcastChannel("bookmarks");
        const handler = (msg: any) => {
            if (msg?.type === "added") {
                setBookmarks((prev: Bookmark[]) => {
                    if (!msg.bookmark || prev.some(b => b.id === msg.bookmark.id)) return prev;
                    return [msg.bookmark as Bookmark, ...prev];
                });
            }
            if (msg?.type === "deleted") {
                setBookmarks((prev: Bookmark[]) => prev.filter(b => b.id !== msg.id));
            }
        };
        bc.addEventListener("message", (e) => handler(e.data));

        const onStorage = (e: StorageEvent) => {
            if (e.key === "bookmarks-sync" && e.newValue) handler(JSON.parse(e.newValue));
        };
        window.addEventListener("storage", onStorage);

        return () => { bc.close(); window.removeEventListener("storage", onStorage); };
    }, []);

    return (
        <div className="space-y-4 flex flex-row flex-wrap gap-2 items-stretch justify-start">
            {bookmarks?.length === 0 && <p>No bookmarks yet.</p>}

            {bookmarks?.map((bookmark) => (
                <div
                    key={bookmark.id}
                    className="p-4 border rounded flex justify-between items-center w-full bg-[#222630] border-[#2B3040] "
                >
                    <div>
                        <p className="font-semibold text-lg">{bookmark.title}</p>
                        <a
                            href={bookmark.url}
                            target="_blank"
                            className="text-blue-500 text-sm"
                        >
                                {bookmark.url}
                        </a>
                    </div>

                    <button
                        onClick={async () => await deleteBookmark(bookmark.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded cursor-pointer hover:bg-red-700"
                    >
                        Delete
                    </button>
                </div>
            ))}

        </div>
    );
}
