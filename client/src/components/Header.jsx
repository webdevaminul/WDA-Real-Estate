import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { IoMdMenu, IoMdClose } from "react-icons/io";
import { Link, NavLink } from "react-router-dom";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  const navLinks = (
    <>
      <NavLink
        to="/about"
        className="bg-slate-100 hover:bg-slate-400 p-2 rounded-md font-semibold w-full sm:w-fit text-center sm:text-start"
      >
        About
      </NavLink>
      <NavLink
        to="sign-in"
        className="bg-slate-100 hover:bg-slate-400 p-2 rounded-md font-semibold w-full sm:w-fit text-center sm:text-start"
      >
        Sign-In
      </NavLink>
    </>
  );

  return (
    <header className="bg-slate-200 shadow-md">
      <nav className="flex flex-wrap gap-1 justify-between items-center  mx-auto p-2 sm:p-0">
        {/* Logo */}
        <Link to="/">
          <h1 className="font-bold text-sm sm:text-xl flex-wrap p-2 sm:p-3">
            <span className="text-slate-500">WDA</span>
            <span className="text-slate-800">R Estate</span>
          </h1>
        </Link>

        {/* Search */}
        <form className="bg-slate-100 rounded-lg flex items-center w-1/3 sm:w-fit grow sm:grow-0">
          <input
            type="search"
            placeholder="Search..."
            className="bg-transparent w-full sm:w-fit focus:outline-none p-2 sm:p-3"
          />
          <button type="submit" className="p-2 sm:p-3">
            <FaSearch className="text-slate-500" />
          </button>
        </form>

        {/* Menu */}
        <div className="p-2 sm:p-3">
          <div className="hidden sm:flex gap-3">{navLinks}</div>
          <div className="sm:hidden">
            <button onClick={toggleNavbar} className="font-semibold text-lg">
              {isOpen ? <IoMdClose className="text-2xl" /> : <IoMdMenu className="text-2xl" />}
            </button>
          </div>
        </div>
        {isOpen && <div className="flex flex-col gap-1 items-center basis-full">{navLinks}</div>}
      </nav>
    </header>
  );
}
