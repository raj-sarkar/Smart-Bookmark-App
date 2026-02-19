Smart Bookmark App

A simple bookmark manager built with Next.js (App Router) and Supabase.
Users can sign in with Google OAuth and add/remove bookmarks (title + link).

🚀 Tech Stack

- Next.js (App Router)
- TypeScript
- Supabase (Auth + Database + Realtime)
- Vercel (Deployment)

⚡ Challenges Faced & Learnings
1️⃣ OAuth Redirect Issues (Local vs Production)

- Faced redirect_uri_mismatch and callback errors after deployment.

- Learned how OAuth flow works between Google → Supabase → App callback route.

- Configured correct Site URL and Redirect URLs in Supabase.

- Understood difference between local (localhost) and production (Vercel) environments.

2️⃣ Server vs Client Supabase Setup

Faced:

- Cookies can only be modified in a Server Action or Route Handler

- Learned proper separation between: createClientComponentClient & createServerComponentClient

- Understood how session handling works in Next.js App Router.

3️⃣ State Not Updating After Insert

- Bookmarks were saved in DB but not showing without refresh.

- Fixed by updating local React state immediately after insert/delete.

- Learned importance of keeping UI state in sync with database.

4️⃣ TypeScript Type Issues

- Faced errors like:

 Property 'auth' does not exist on type 'Promise<SupabaseClient>'


- Learned proper async handling and typing for Supabase responses.

- Fixed any[] | null vs never[] state mismatch.

5️⃣ Route Protection

- Users could access login page even when authenticated.

- Implemented session checks and redirects.

- Learned how to handle protected routes in Next.js App Router.

🎯 Key Takeaways

- Deeper understanding of OAuth flow

- Proper Supabase + Next.js integration

- Handling authentication securely in production

- Real-world debugging experience
