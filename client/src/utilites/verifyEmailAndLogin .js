import { loginRequest, loginSuccess, loginFailure } from "./authSlice";
import axios from "axios";

export const verifyEmailAndLogin = (token) => async (dispatch) => {
  dispatch(loginRequest());

  try {
    const response = await axios.get(`/api/auth/verify-email?token=${token}`);
    const { success, user, token: authToken } = response.data;

    if (success) {
      // Save the token to localStorage (optional)
      localStorage.setItem("authToken", authToken);

      // Dispatch loginSuccess with the user data
      dispatch(loginSuccess(user));
    } else {
      dispatch(loginFailure("Verification failed."));
    }
  } catch (error) {
    dispatch(loginFailure("Something went wrong. Please try again."));
  }
};
