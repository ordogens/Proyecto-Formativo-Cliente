import { ShoppingCart, Moon, Sun, LogIn } from "lucide-react";
import { NavLink } from "react-router-dom";

export const Header = () => {
  return (
    <div className="flex h-15 bg-red-500 justify-between items-center px-4">
      <p><NavLink to="/">CraftYourStyle</NavLink></p>
      <div className="flex">
        {""}
        <ShoppingCart /> <Moon /> <Sun /> <LogIn />
      </div>
    </div>
  );
};
