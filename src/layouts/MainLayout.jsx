import { Outlet, useLocation } from "react-router-dom";

import Navbar from "../components/navbar";
import Footer from "../components/footer";

export default function MainLayout() {
  const { pathname } = useLocation();

  const isProfilePage = pathname.startsWith("/profile");

  return (
    <>
      {!isProfilePage && <Navbar />}

      <Outlet />

      {!isProfilePage && <Footer />}
    </>
  );
}
