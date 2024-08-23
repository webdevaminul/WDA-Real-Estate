import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";

export default function RootPage() {
  return (
    <>
      <Header></Header>
      <Outlet></Outlet>
    </>
  );
}
