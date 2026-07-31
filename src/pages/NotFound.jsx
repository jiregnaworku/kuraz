import { Link } from "react-router-dom";
import { FaHome } from "react-icons/fa";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4">
      <div className="text-9xl font-bold text-[#d4af37]">404</div>
      <h1 className="mt-4 text-4xl font-bold text-[#24312c]">Page Not Found</h1>
      <p className="mt-2 text-gray-500">
        Oops! The page you're looking for doesn't exist.
      </p>
      <Link
        to="/"
        className="mt-8 flex items-center gap-2 rounded-xl bg-[#d4af37] px-8 py-3 font-medium text-white transition hover:bg-[#b88f1d]"
      >
        <FaHome />
        Go Back Home
      </Link>
    </div>
  );
}
