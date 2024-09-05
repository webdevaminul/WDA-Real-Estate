import { useEffect, useState, useRef } from "react";
import { IoMdMenu, IoMdClose } from "react-icons/io";
import { IoCreateOutline, IoEnterOutline, IoExitOutline, IoOptions } from "react-icons/io5";
import { Link, NavLink } from "react-router-dom";
import Darkmode from "../features/darkmode/Darkmode";
import { useSelector } from "react-redux";
import { BiCreditCardFront } from "react-icons/bi";

export default function Header() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [rotating, setRotating] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const mobileMenuRef = useRef(null);
  const [profileMenu, setProfileMenu] = useState(false);
  const profileMenuRef = useRef(null);

  const triggerRotationAnimation = () => {
    setRotating(true);
    // Remove animation class after animation ends
    setTimeout(() => setRotating(false), 400);
  };

  // Toggle Mobile Menu
  const toggleMobileMenu = () => {
    setMobileMenu(!mobileMenu);
    setProfileMenu(false);
    triggerRotationAnimation();
  };

  // Toggle Profile Menu
  const toggleProfileMenu = () => {
    setProfileMenu(!profileMenu);
    setMobileMenu(false);
  };

  // Handle Click Outside Mobile Menu
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
        setMobileMenu(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-primaryBgShade1 fixed top-0 left-0 w-full z-50">
      <nav className="flex justify-between items-center px-2 py-1 sm:py-0">
        {/* Left Part Logo */}
        <Link
          onClick={() => setMobileMenu(false)}
          to="/"
          className="font-bold text-xl whitespace-nowrap"
        >
          <span className="text-highlightGray">WDA</span>
          <span className="text-highlight">R Estate</span>
        </Link>

        {/* Right Part Menu and Icons */}
        <div className="flex items-center gap-2">
          {/* Navigation Menu */}
          <ul className="hidden sm:flex gap-2 py-2">
            <NavLink
              to="/about"
              className="border-b-2 border-transparent hover:border-highlight p-2 font-medium w-full sm:w-fit text-center sm:text-start"
            >
              About
            </NavLink>
          </ul>

          {/* Profile or Sign in */}
          {user && isAuthenticated ? (
            <div ref={profileMenuRef} className="relative">
              <button onClick={toggleProfileMenu}>
                <img
                  src={user?.userInfo?.userPhoto}
                  className="h-8 w-8 rounded-full object-center"
                  loading="lazy"
                />
              </button>

              {profileMenu && (
                <div className="absolute top-[3.2rem] sm:right-0 right-[-4.5rem] z-40 bg-primaryBgShade1 p-4 shadow-sm border border-highlightGray/15 rounded-xl flex flex-col gap-4">
                  <div className="">
                    <p className="whitespace-nowrap">Hi, {user?.userInfo?.userName}</p>
                    <p className="text-xs ">{user?.userInfo?.userEmail}</p>
                  </div>

                  <Link
                    onClick={() => setProfileMenu(false)}
                    to="/manage-posts"
                    className="text-sm bg-primaryBgShade2 hover:bg-primaryShadeHover border border-highlightGray/10 whitespace-nowrap w-full rounded-xl p-2 flex items-center  gap-2"
                  >
                    <span className="text-2xl">
                      <BiCreditCardFront />
                    </span>
                    <span>Manage posts</span>
                  </Link>
                  <Link
                    onClick={() => setProfileMenu(false)}
                    to="/manage-account/overview"
                    className="text-sm bg-primaryBgShade2 hover:bg-primaryShadeHover border border-highlightGray/10 whitespace-nowrap w-full rounded-xl p-2 flex items-center  gap-2"
                  >
                    <span className="text-2xl">
                      <IoOptions />
                    </span>
                    <span>Manage account</span>
                  </Link>
                  <button className="text-sm bg-highlight hover:bg-highlightHover text-primaryWhite border border-highlightGray/10 whitespace-nowrap w-full rounded-xl p-2 flex items-center  gap-2">
                    <span className="text-2xl">
                      <IoExitOutline />
                    </span>
                    <span>Sign out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <NavLink
              to="sign-in"
              className="border-b-2 border-transparent hover:border-highlight py-2 font-medium w-full sm:w-fit text-highlight text-center sm:text-start flex gap-1 items-center justify-center"
            >
              <span className="text-2xl">
                <IoEnterOutline />
              </span>
              <span>Sign In</span>
            </NavLink>
          )}

          {/* Darkmode Button */}
          <Darkmode />

          {/* Mobile Menu Button*/}
          <button
            onClick={toggleMobileMenu}
            className={`sm:hidden ${rotating ? "animate-rotate" : ""}`}
          >
            {mobileMenu ? (
              <IoMdClose className="text-2xl transition-none" />
            ) : (
              <IoMdMenu className="text-2xl transition-none" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenu && (
        <div ref={mobileMenuRef} className="flex flex-col gap-1 items-center p-1">
          <Link
            onClick={() => setMobileMenu(false)}
            to="/about"
            className="p-2 font-medium w-full hover:text-highlight text-center"
          >
            About
          </Link>
        </div>
      )}
    </header>
  );
}
