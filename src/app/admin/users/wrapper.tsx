import { requireAdmin } from "../auth-check";

export default async function UsersPageWrapper({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return <>{children}</>;
}