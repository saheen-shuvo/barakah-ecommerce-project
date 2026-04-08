import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen flex bg-[#faf7f0] text-[#3d2f1f]">
      <aside className="w-64 bg-white border-r border-[#e5dccf] p-5">
        <AdminSidebar />
      </aside>

      <div className="flex-1">
        <header className="h-16 bg-white border-b border-[#e5dccf] flex items-center px-6">
          <h1 className="text-lg font-semibold">Dashboard</h1>
        </header>

        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}