import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";

export default function RootPage() {
  return (
    <>
      <Header></Header>
      <main className="mt-14 sm:mt-16">
        <Outlet></Outlet>
      </main>
    </>
  );
}
