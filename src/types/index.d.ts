type AppUser = {
  id?: string;
  auth0_id?: string;
  name?: string | null;
  email?: string | null;
  avatar_url?: string | null;
} | null;

type AppShellProps = {
  children: React.ReactNode;
  user: AppUser;
};