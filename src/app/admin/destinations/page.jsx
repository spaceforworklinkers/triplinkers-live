import AdminDestinationsClient from "./AdminDestinationsClient";

export const metadata = {
  title: "Destinations Management | Admin Dashboard",
  description: "Manage global and local travel destinations.",
};

export default function DestinationsPage() {
  return <AdminDestinationsClient />;
}
