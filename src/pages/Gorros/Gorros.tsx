import { NavLink } from "react-router-dom";

export const Gorros = () => {
  return (
    <div className="bg-green-600 h-full w-full">
      <h1>Gorros</h1>
      <p><NavLink to="/gorros/hombre">hombre</NavLink></p>
      <p><NavLink to="/gorros/mujer">mujer</NavLink></p>
    </div>
  )
}


