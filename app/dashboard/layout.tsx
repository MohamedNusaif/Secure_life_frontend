import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />

      <div className="lg:pl-64">
        <Topbar />

        <main>{children}</main>
      </div>
    </div>
  );
}