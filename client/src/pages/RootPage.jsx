import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import { Flip, Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function RootPage() {
  return (
    <>
      <Header></Header>
      <main className="mt-[3rem] sm:mt-[3.7rem]">
        <Outlet></Outlet>
      </main>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Flip}
      />
    </>
  );
}
