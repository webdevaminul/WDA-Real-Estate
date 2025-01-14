import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { persistor, store } from "./redux/store";
import RootPage from "./pages/RootPage";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import About from "./pages/About";
import VerifyEmail from "./pages/VerifyEmail";
import { PersistGate } from "redux-persist/integration/react";
import ManageAccount from "./pages/ManageAccount";
import PrivatePages from "./pages/PrivatePages";
import Overview from "./pages/Overview";
import ManagePost from "./pages/ManagePost";
import UpdateProfile from "./pages/UpdateProfile";
import ChangePassword from "./pages/ChangePassword";
import DeleteAccount from "./pages/DeleteAccount";
import ForgetPassword from "./pages/ForgetPassword";
import PasswordRecovery from "./pages/PasswordRecovery";
import PropertyList from "./pages/PropertyList";
import CreateProperty from "./pages/CreateProperty";
import UpdateProperty from "./pages/UpdateProperty";
import PropertyDetails from "./pages/PropertyDetails";
import AllProperties from "./pages/AllProperties";
import FAQ from "./pages/FAQ";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootPage />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/sign-up",
        element: <SignUp />,
      },
      {
        path: "/verify-email",
        element: <VerifyEmail />,
      },
      {
        path: "/sign-in",
        element: <SignIn />,
      },
      {
        path: "/forget-password",
        element: <ForgetPassword />,
      },
      {
        path: "/password-recovery",
        element: <PasswordRecovery />,
      },
      {
        path: "/manage-account/",
        element: (
          <PrivatePages>
            <ManageAccount />
          </PrivatePages>
        ),
        children: [
          {
            path: "/manage-account/overview",
            element: <Overview />,
          },
          {
            path: "/manage-account/manage-profile",
            element: <UpdateProfile />,
          },
          {
            path: "/manage-account/change-password",
            element: <ChangePassword />,
          },
          {
            path: "/manage-account/delete-account",
            element: <DeleteAccount />,
          },
        ],
      },
      {
        path: "/manage-posts",
        element: (
          <PrivatePages>
            <ManagePost />
          </PrivatePages>
        ),
        children: [
          {
            path: "/manage-posts/post-list",
            element: <PropertyList />,
          },
          {
            path: "/manage-posts/create-post",
            element: <CreateProperty />,
          },
          {
            path: "/manage-posts/update-post/:propertyId",
            element: <UpdateProperty />,
          },
          {
            path: "/manage-posts/property/:propertyId",
            element: <PropertyDetails />,
          },
        ],
      },
      {
        path: "/all-properties",
        element: <AllProperties />,
      },
      {
        path: "/property/:propertyId",
        element: <PropertyDetails />,
      },
      {
        path: "/faq",
        element: <FAQ />,
      },
      {
        path: "/about",
        element: <About />,
      },
    ],
    errorElement: <NotFound />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </PersistGate>
  </Provider>
);
