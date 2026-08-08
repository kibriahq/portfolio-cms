import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { AdminsClient } from "@/components/admins/AdminsClient";
import { Button } from "@/components/ui/Button";
import { getAdmins } from "@/actions/admins";
import { auth } from "@/lib/auth";

export default async function AdminsPage() {
  const session = await auth();
  const isSuperAdmin = session?.user?.role === "SUPER_ADMIN";
  const admins = await getAdmins();

  return (
    <>
      <PageHeader
        title="All Admins"
        description={
          isSuperAdmin
            ? "Invite new admins and manage what each of them can do."
            : "Everyone who has access to this workspace."
        }
        actions={
          isSuperAdmin ? (
            <Link href="/admins/new">
              <Button>
                <Plus className="h-4 w-4" />
                Add Admin
              </Button>
            </Link>
          ) : null
        }
      />

      <AdminsClient
        admins={admins}
        currentUserId={session?.user?.id ?? ""}
        isSuperAdmin={isSuperAdmin}
      />
    </>
  );
}
