import { useAppDispatch } from "@/lib/redux/hooks";
import { clearCredentials } from "@/lib/redux/slices/authSlice";

export const useLogout = () => {
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(clearCredentials());
    document.cookie = "auth_token=; path=/; max-age=0";
    document.cookie = "role=; path=/; max-age=0";
    window.location.href = "/login";
  };

  return handleLogout;
};
