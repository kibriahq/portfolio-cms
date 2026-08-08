import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { AdminForm } from "@/components/forms/AdminForm";
import { Button } from "@/components/ui/Button";
import { auth } from "@/lib/auth";

export default async function NewAdminPage() {
  const session = await auth();

  if (session?.user?.role !== "SUPER_ADMIN") {
    redirect("/admins");
  }

  return (
    <>
      <PageHeader
        title="Add Admin"
        description="Create an account and choose what the new admin is allowed to do."
        actions={
          <Link href="/admins">
            <Button variant="secondary">
              <ArrowLeft className="h-4 w-4" />
              Back to Admins
            </Button>
          </Link>
        }
      />

      <AdminForm />
    </>
  );
}
