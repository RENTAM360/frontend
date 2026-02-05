import { useAppDispatch } from "@/lib/redux/hooks";
import { clearCredentials } from "@/lib/redux/slices/authSlice";
import { persistor } from "@/lib/redux/store";

export const useLogout = () => {
  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    try {
      // Ask the server to clear httpOnly cookies (auth_token, role)
      await fetch("/api/logout", { method: "POST" });
    } catch (e) {
      console.error("Failed to call logout endpoint", e);
      // Even if the request fails, still clear client-side state
    } finally {
      // Clear Redux auth state and any non-httpOnly cookies
      dispatch(clearCredentials());
      document.cookie = "auth_token=; path=/; max-age=0";
      document.cookie = "role=; path=/; max-age=0";
      await persistor.purge();
      window.location.href = "/login";
    }
  };

  return handleLogout;
};
