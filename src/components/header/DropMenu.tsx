import { useState } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useThemeContext } from "../../context/ThemeContext";

interface DropMenuProps {
  onLoginClick: () => void;
  onLogout: () => void;
  isLoggedIn: boolean;
  isAdmin: boolean;
}

type MenuAction = () => void;

export const DropMenu = ({
  onLoginClick,
  onLogout,
  isLoggedIn,
  isAdmin,
}: DropMenuProps) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useThemeContext();

  const options = [
    {
      label: "Theme",
      action: toggleTheme,
    },
    {
      label: "Catálogo",
      action: () => navigate("/catalogo"),
    },
    {
      label: "Personalización",
      action: () => navigate("/personalizacion"),
    },
    ...(isAdmin
      ? [
          {
            label: "Panel admin",
            action: () => navigate("/admin-view"),
          },
        ]
      : []),
    ...(isLoggedIn
      ? [
          {
            label: "Logout",
            action: onLogout,
          },
        ]
      : [
          {
            label: "Login",
            action: onLoginClick,
          },
        ]),
  ];

  const handleClick = (action: MenuAction) => {
    action();
    setOpen(false);
  };

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)}>
        {open ? <X size={30} /> : <Menu size={30} />}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg z-50 transition-colors duration-300">
          <ul className="p-2 text-sm text-gray-700 dark:text-gray-300 flex flex-col gap-2">
            {options.map(({ label, action }) => (
              <li key={label}>
                <button
                  className="w-full flex items-center justify-between px-4 py-1 rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                  onClick={() => handleClick(action)}
                >
                  {label}

                  {label === "Theme" &&
                    (theme === "dark" ? (
                      <Sun size={18} color="orange" />
                    ) : (
                      <Moon size={18} />
                    ))}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
