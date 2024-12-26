import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function PrivatePages({ children }) {
  const { user } = useSelector((state) => state.auth);
  if (user) {
    return children;
  }
  return <Navigate to="/sign-in" />;
}
