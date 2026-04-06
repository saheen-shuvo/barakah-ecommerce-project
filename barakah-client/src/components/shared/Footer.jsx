export default function Footer() {
  return (
    <footer className="mt-20 bg-[#3d2f1f] text-white">
      <div className="mx-auto max-w-7xl px-6 py-10 text-center">
        <h2 className="text-xl font-semibold">Barakah</h2>
        <p className="mt-2 text-sm opacity-80">
          Islamic Clock and Canvas
        </p>

        <div className="mt-6 flex justify-center gap-6 text-sm">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms</a>
          <a href="#">Contact</a>
        </div>

        <p className="mt-6 text-xs opacity-60">
          © {new Date().getFullYear()} Barakah. All rights reserved.
        </p>
      </div>
    </footer>
  );
}