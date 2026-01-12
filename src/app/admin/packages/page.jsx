import AdminPackagesClient from "./AdminPackagesClient";

export const metadata = {
  title: "Packages Management | Admin Dashboard",
  description: "Create, edit, and manage travel packages.",
};

export default function PackagesPage() {
  return <AdminPackagesClient />;
}
