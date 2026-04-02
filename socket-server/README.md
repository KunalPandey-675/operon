# socket-server

Socket.IO gateway for task chat.

## Environment

Create a `.env` file in this folder with:

```env
SOCKET_SERVER_PORT=4600
CLIENT_ORIGIN=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your-anon-key
```

## Run

```bash
npm install
npm run dev
```

The health check is available at `http://localhost:4600/health`.

## Database policies

Apply [../supabase/task_messages_owner_access.sql](../supabase/task_messages_owner_access.sql) in Supabase so task owners can read and send in every task chat, not just assigned users.