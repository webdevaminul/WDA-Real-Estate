import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { IoMdMenu, IoMdClose } from "react-icons/io";
import { NavLink } from "react-router-dom";

export default function Header() {
  const navLinks = (
    <>
      <NavLink to="/about">About</NavLink>
      <NavLink to="sign-in">Sign-In</NavLink>
    </>
  );

  const [isOpen, setIsOpen] = useState(false);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="bg-slate-200 shadow-md">
      <nav className="flex flex-wrap justify-between items-center  mx-auto p-3">
        {/* Logo */}
        <h1 className="font-bold text-sm sm:text-xl flex-wrap">
          <span className="text-slate-500">WDA</span>
          <span className="text-slate-800">R Estate</span>
        </h1>

        {/* Search */}
        <form className="bg-slate-100 p-3 rounded-lg flex items-center">
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none"
          />
          <FaSearch className="text-slate-500" />
        </form>

        {/* Menu */}
        <div>
          <div className="hidden sm:flex gap-3 bg-slate-300 p-3">{navLinks}</div>
          <div className="sm:hidden">
            <button onClick={toggleNavbar} className="font-semibold text-lg">
              {isOpen ? <IoMdClose /> : <IoMdMenu />}
            </button>
          </div>
        </div>
        {isOpen && <div className="flex flex-col items-center basis-full">{navLinks}</div>}
      </nav>
    </header>
  );
}
