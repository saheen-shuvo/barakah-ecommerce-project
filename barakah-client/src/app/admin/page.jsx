import AdminRoute from "@/components/auth/AdminRoute";
import Image from "next/image";
import Link from "next/link";
export const dynamic = "force-dynamic";

async function getDashboardData() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  try {
    const [productsRes, ordersRes] = await Promise.allSettled([
      fetch(`${baseUrl}/api/products`, {
        next: { revalidate: 60 },
      }),
      fetch(`${baseUrl}/api/orders`, {
        next: { revalidate: 60 },
      }),
    ]);

    let products = [];
    let orders = [];

    // products
    if (productsRes.status === "fulfilled" && productsRes.value.ok) {
      const productsJson = await productsRes.value.json();
      products = productsJson?.data || [];
    }

    // orders
    if (ordersRes.status === "fulfilled" && ordersRes.value.ok) {
      const ordersJson = await ordersRes.value.json();
      orders = ordersJson?.data || [];
    }

    const totalProducts = products.length;
    const totalOrders = orders.length;

    // revenue calculation
    // tries: order.total, order.totalAmount, order.price
    const totalRevenue = orders.reduce((sum, order) => {
      const amount =
        Number(order?.total) ||
        Number(order?.totalAmount) ||
        Number(order?.price) ||
        0;

      return sum + amount;
    }, 0);

    const recentProducts = [...products].slice(0, 5);
    const recentOrders = [...orders].slice(0, 5);

    return {
      totalProducts,
      totalOrders,
      totalRevenue,
      recentProducts,
      recentOrders,
    };
  } catch (error) {
    return {
      totalProducts: 0,
      totalOrders: 0,
      totalRevenue: 0,
      recentProducts: [],
      recentOrders: [],
    };
  }
}

export default async function AdminHomePage() {
  const {
    totalProducts,
    totalOrders,
    totalRevenue,
    recentProducts,
    recentOrders,
  } = await getDashboardData();

  return (
    <AdminRoute>
      <div className="space-y-6">
        {/* Heading */}
        <div>
          <h2 className="text-2xl font-bold mb-2">
            Welcome to Admin Dashboard
          </h2>
          <p className="text-gray-500">
            Manage your products, orders, and store settings here.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <p className="text-sm text-gray-500">Total Products</p>
            <h3 className="text-3xl font-bold mt-2">{totalProducts}</h3>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <p className="text-sm text-gray-500">Total Orders</p>
            <h3 className="text-3xl font-bold mt-2">{totalOrders}</h3>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <p className="text-sm text-gray-500">Revenue</p>
            <h3 className="text-3xl font-bold mt-2">
              ৳ {totalRevenue.toLocaleString()}
            </h3>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/products"
              className="btn border border-[#d4af37] text-[#d4af37] hover:bg-[#0f2a44] hover:border-[#0f2a44] transition"
            >
              View Products
            </Link>

            <Link
              href="/admin/products/add"
              className="btn border border-[#d4af37] text-[#d4af37] hover:bg-[#0f2a44] hover:border-[#0f2a44] transition"
            >
              Add Product
            </Link>

            <Link
              href="/admin/orders"
              className="btn border border-[#d4af37] text-[#d4af37] hover:bg-[#0f2a44] hover:border-[#0f2a44] transition"
            >
              View Orders
            </Link>
          </div>
        </div>

        {/* Recent Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Products */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Recent Products</h3>
              <Link href="/admin/products" className="text-sm text-blue-600">
                View all
              </Link>
            </div>

            {recentProducts.length === 0 ? (
              <p className="text-gray-500 text-sm">No products found.</p>
            ) : (
              <div className="space-y-4">
                {recentProducts.map((product) => (
                  <div
                    key={product._id}
                    className="flex items-center gap-3 border-b pb-3 last:border-b-0 border-gray-200"
                  >
                    <Image
                      src={product.image || "/placeholder.png"}
                      alt={product.name || "Product"}
                      className="w-12 h-12 rounded-lg object-cover border"
                      width={48}
                      height={48}
                    />

                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">
                        {product.name || "Untitled Product"}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {product.category || "No category"}
                      </p>
                    </div>

                    <div className="text-sm font-semibold">
                      ৳ {product.price || 0}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Orders */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Recent Orders</h3>
              <Link href="/admin/orders" className="text-sm text-blue-600">
                View all
              </Link>
            </div>

            {recentOrders.length === 0 ? (
              <p className="text-gray-500 text-sm">No orders found.</p>
            ) : (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div
                    key={order._id}
                    className="flex items-center justify-between border-b pb-3 last:border-b-0 border-gray-200"
                  >
                    <div className="min-w-0">
                      <p className="font-medium truncate">
                        {order.customerName || order.name || "Unnamed Customer"}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {order.email || order.phone || "No contact info"}
                      </p>
                    </div>

                    <div className="text-sm font-semibold">
                      ৳{" "}
                      {Number(
                        order.total || order.totalAmount || order.price || 0,
                      ).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminRoute>
  );
}
