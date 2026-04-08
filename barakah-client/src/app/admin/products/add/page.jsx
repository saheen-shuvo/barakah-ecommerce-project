export default function AddProductPage() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm max-w-2xl">
      <h2 className="text-2xl font-bold mb-6">Add Product</h2>

      <form className="space-y-4">
        <input
          type="text"
          placeholder="Product Name"
          className="w-full border p-3 rounded-lg"
        />

        <input
          type="number"
          placeholder="Price"
          className="w-full border p-3 rounded-lg"
        />

        <select className="w-full border p-3 rounded-lg">
          <option value="">Select Category</option>
          <option value="wall-clock">Wall Clock</option>
          <option value="wall-canvas">Wall Canvas</option>
        </select>

        <select className="w-full border p-3 rounded-lg">
          <option value="">Select Subcategory</option>
          <option value="natural">Natural</option>
          <option value="islamic">Islamic</option>
        </select>

        <input
          type="file"
          className="w-full border p-3 rounded-lg"
        />

        <button
          type="submit"
          className="bg-[#d4af37] text-white px-6 py-3 rounded-lg"
        >
          Add Product
        </button>
      </form>
    </div>
  );
}