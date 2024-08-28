import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { BiCreditCardFront } from "react-icons/bi";
import { LiaUserEditSolid } from "react-icons/lia";

export default function ManageAccount() {
  return (
    <main className="flex">
      <aside className="bg-primaryBgShade1 fixed w-full sm:w-52 h-fit sm:h-full top-12 sm:top-[3.625rem] left-0 bottom-0 z-30 shadow border-r border-highlightGray/10 ">
        <ul className="flex flex-row sm:flex-col gap-2 sm:py-5 sm:pr-4">
          <NavLink
            to="/manage-account/overview"
            className="hover:bg-primaryShadeHover whitespace-nowrap w-full sm:rounded-r-full p-2 flex items-center justify-center sm:justify-start gap-2"
          >
            <span className="text-2xl">
              <IoIosInformationCircleOutline />
            </span>
            <span>Overview</span>
          </NavLink>
          <NavLink
            to="/manage-account/update-profile"
            className="hover:bg-primaryShadeHover whitespace-nowrap w-full sm:rounded-r-full p-2 flex items-center justify-center sm:justify-start gap-2"
          >
            <span className="text-2xl">
              <LiaUserEditSolid />
            </span>
            <span className="hidden sm:inline">Update</span>
            <span>Profile</span>
          </NavLink>
          <NavLink
            to="/manage-account/manage-post"
            className="hover:bg-primaryShadeHover whitespace-nowrap w-full sm:rounded-r-full p-2 flex items-center justify-center sm:justify-start gap-2"
          >
            <span className="text-2xl">
              <BiCreditCardFront />
            </span>
            <span className="hidden sm:inline">Manage</span>
            <span>Post</span>
          </NavLink>
        </ul>
      </aside>
      <section className="sm:pl-52 pt-12 sm:pt-0 text-justify w-full">
        <Outlet></Outlet>
      </section>
    </main>
  );
}
