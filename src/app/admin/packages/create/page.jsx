import PackageForm from "./PackageForm";

export default function CreatePackagePage() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-6">Add Package</h1>
      <PackageForm />
    </div>
  );
}
