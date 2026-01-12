import TravelPackagesClient from "./TravelPackagesClient";

export const metadata = {
  title: "All Tour Packages | TripLinkers",
  description: "Browse our diverse collection of international tour packages, including honeymoon, family, and adventure trips suited for every budget.",
};

export default function PackagesPage() {
  return <TravelPackagesClient />;
}