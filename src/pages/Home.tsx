import { NavLink } from "react-router-dom";

export const Home = () => {
  return (
    <div className="h-full flex flex-col bg-amber-400">
      <h1>home</h1>
      <div className="flex gap-4">
      <NavLink to="/personalizacion">personalizacion</NavLink>
      <NavLink to="/catalogo">catalogo</NavLink>
      </div>
    </div>
  )
}


