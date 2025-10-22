import { Link, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";

const HeroLayout = () => {
  const [navbarOpacity, setNavbarOpacity] = useState("bg-opacity-100");

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY === 0) {
        setNavbarOpacity("bg-opacity-100");
      } else {
        setNavbarOpacity("bg-opacity-20");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className="flex flex-col bg-black justify-between"
      style={{ overscrollBehaviorY: "none" }}
    >
      {/* Navbar */}
      <div
        className={`fixed top-0 left-0 right-0 flex flex-row items-center w-full justify-between bg-black ${navbarOpacity} backdrop-blur-sm px-52 py-6 z-50 transition-opacity duration-300`}
      >
        <Link to="/"><img
          src="public/assets/Logo_Text_White.png"
          height="20px"
          width="120px"
          className="pl-25"
          alt="Logo"
        /></Link>
        <div className="flex flex-row">
          <div className="text-white px-5 hidden md:block">
            <Link to="/search">Search</Link>
            <Link to="/updates" className="ml-16">Updates</Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-16 bg-black">
        <Outlet />
      </div>

      {/* Footer */}
      <footer className="w-screen bg-black">
        <nav className="flex align-middle items-center justify-center p-4 flex-row">
          <p className="text-base text-white mb-3 mx-5">© 2024 Syntony, Inc.</p>
          <Link className="text-base text-white mb-3 mx-5 hover:underline" to="/privacy-policy">
            Privacy Policy
          </Link>
          <Link className="text-base text-white mb-3 mx-5 hover:underline" to="/terms-of-service">
            Terms of Service
          </Link>
        </nav>
      </footer>
    </div>
  );
};

export default HeroLayout;
