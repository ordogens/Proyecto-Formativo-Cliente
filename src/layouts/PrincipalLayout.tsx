import { Header } from "../components/header/Header";
export const PrincipalLayout = ({ children }) => {
  return (
    <div className="h-screen w-screen flex flex-col">
      <Header />
      <div className="flex-1 h-screen w-screen">{children}</div>
    </div>
  );
};

