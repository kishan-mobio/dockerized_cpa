import { logout } from "@/redux/Thunks/Authentication";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

const LogoutButton = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleSignOut = () => {
    dispatch(logout());
    router.push("/login");
  };
  return (
    <button
      onClick={handleSignOut}
      className="w-full flex items-center gap-3 text-white px-4 py-3 rounded-xl text-[#7C7C9A] hover:bg-red-100 hover:text-red-600 transition-all duration-200 group"
    >
      <LogOut size={20} className="text-white group-hover:text-red-600" />
      <span className="font-medium">Sign Out</span>
    </button>
  );
};

export default LogoutButton;
