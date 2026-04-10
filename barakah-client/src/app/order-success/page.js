import Link from "next/link";
import { FaCircleCheck } from "react-icons/fa6";

export default function OrderSuccessPage() {
  return (
    <main className="min-h-screen bg-[#f8f6f1] py-16">
      <div className="mx-auto max-w-3xl px-4">
        <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <FaCircleCheck className="text-4xl text-green-600" />
          </div>

          <h1 className="mt-6 text-4xl font-bold text-[#0f2a44]">
            আপনার অর্ডার সফলভাবে সম্পন্ন হয়েছে
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-lg leading-8 text-[#0f2a44]/70">
            আপনার অর্ডারের জন্য ধন্যবাদ। আমরা আপনার অর্ডারটি গ্রহণ করেছি এবং শীঘ্রই নিশ্চিত করার জন্য আপনার সাথে যোগাযোগ করব।
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <Link
              href="/"
              className="rounded-2xl bg-[#0f2a44] px-3 py-4 text-center font-semibold text-white transition hover:bg-[#d4af37]"
            >
              হোম পেজে ফিরে যান
            </Link>

            <Link
              href="/category/wall-clock/islamic"
              className="rounded-2xl border border-[#0f2a44]/15 px-3 py-4 text-center font-semibold text-[#0f2a44] transition hover:bg-[#faf7f0]"
            >
              কেনাকাটা চালিয়ে যান
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}