import { useState } from "react";
import { IoMdMenu, IoMdClose } from "react-icons/io";
import { IoEnterOutline } from "react-icons/io5";
import { Link, NavLink } from "react-router-dom";
import Darkmode from "../features/darkmode/Darkmode";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  const navLinks = (
    <>
      <NavLink
        to="/about"
        className="border-b-2 border-transparent hover:border-highlight p-2 font-medium w-full sm:w-fit text-primary text-center sm:text-start"
      >
        About
      </NavLink>
      <NavLink
        to="sign-in"
        className="border-b-2 border-transparent hover:border-highlight p-2 font-medium w-full sm:w-fit text-highlight text-center sm:text-start flex gap-1 items-center justify-center"
      >
        <span className="text-2xl">
          <IoEnterOutline />
        </span>
        <span>Sign In</span>
      </NavLink>
    </>
  );

  return (
    <header className="bg-primaryBgShade1 shadow">
      <nav className="container mx-auto flex flex-wrap gap-1 justify-between items-center p-2 sm:p-0">
        {/* Logo */}
        <Link to="/">
          <h1 className="font-bold text-xl flex-wrap">
            <span className="text-highlightGray">WDA</span>
            <span className="text-highlight">R Estate</span>
          </h1>
        </Link>

        {/* Menu */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex gap-2 p-2">{navLinks}</div>
          <Darkmode></Darkmode>
          <button onClick={toggleNavbar} className="sm:hidden">
            {isOpen ? (
              <IoMdClose className="text-2xl text-primary" />
            ) : (
              <IoMdMenu className="text-2xl text-primary" />
            )}
          </button>
        </div>
        {isOpen && (
          <div className="flex flex-col gap-1 items-center basis-full p-1">{navLinks}</div>
        )}
      </nav>
    </header>
  );
}
