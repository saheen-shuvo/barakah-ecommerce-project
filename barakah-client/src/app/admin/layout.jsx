"use client";

import Link from "next/link";
import { FiHome, FiBox, FiPlus, FiShoppingCart } from "react-icons/fi";
import { IoMdMenu } from "react-icons/io";

export default function AdminLayout({ children }) {
  return (
    <div className="drawer lg:drawer-open min-h-screen">
      {/* Toggle checkbox */}
      <input id="admin-drawer" type="checkbox" className="drawer-toggle" />

      {/* Main content */}
      <div className="drawer-content flex flex-col bg-[#faf7f0]">
        {/* Navbar */}
        <div className="flex lg:hidden navbar bg-white border-b border-[#e5dccf] px-4">
          {/* Mobile menu button */}
          <div className="flex-none lg:hidden">
            <label htmlFor="admin-drawer" className="btn btn-square btn-ghost">
              <IoMdMenu size={22} />
            </label>
          </div>

          {/* Title */}
          <div className="lg:hidden flex-1 text-lg font-semibold text-[#3d2f1f]">
            <h1>Admin Dashboard</h1>
          </div>
        </div>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>

      {/* Sidebar */}
      <div className="drawer-side">
        <label htmlFor="admin-drawer" className="drawer-overlay"></label>

        <aside className="min-h-full w-64 bg-white border-r border-[#e5dccf] py-6 px-4">

          <ul className="menu text-[#3d2f1f] w-full gap-1">
            <li>
              <Link href="/admin">
                <FiHome />
                Dashboard
              </Link>
            </li>

            <li>
              <Link href="/admin/products">
                <FiBox />
                All Products
              </Link>
            </li>

            <li>
              <Link href="/admin/products/add">
                <FiPlus />
                Add Product
              </Link>
            </li>

            <li>
              <Link href="/admin/orders">
                <FiShoppingCart />
                Orders
              </Link>
            </li>
          </ul>
        </aside>
      </div>
    </div>
  );
}
