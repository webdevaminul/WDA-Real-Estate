import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";

export default function RootPage() {
  return (
    <>
      <Header></Header>
      <main className="mt-[3rem] sm:mt-[3.7rem]">
        <Outlet></Outlet>
      </main>
    </>
  );
}
