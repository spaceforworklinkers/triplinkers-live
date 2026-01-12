export const metadata = {
  title: "Page Not Found | TripLinkers",
  description: "The page you are looking for does not exist. Return to TripLinkers homepage.",
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-slate-800">404</h1>
        <p className="mt-2 text-slate-600">
          The page you are looking for does not exist.
        </p>
      </div>
    </div>
  );
}
