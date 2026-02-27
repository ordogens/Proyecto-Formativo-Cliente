import { Header } from "../components/header/Header";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export const PrincipalLayout = ({ children }: Props) => {
  return (
    <div className="h-screen w-screen flex flex-col overflow-x-hidden bg-[#f3f0eb]">
      <Header />
      <div className="flex-1 h-screen w-screen">{children}</div>
    </div>
  );
};
