import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import { Flip, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { HelmetProvider } from "react-helmet-async";

export default function RootPage() {
  return (
    <HelmetProvider>
      <Header></Header>
      <main className="mt-[3.5rem] sm:mt-[3.625rem]">
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
    </HelmetProvider>
  );
}
