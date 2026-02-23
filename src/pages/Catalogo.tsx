import { NavLink } from "react-router-dom";


export const Catalogo = () => {
  return (
    <div className="bg-blue-600 h-full w-full">
      <h1>Catalogo</h1>
      <p><NavLink to="/ropa-hombre">ropa de hombre</NavLink></p>
      <p><NavLink to="/ropa-mujer">ropa de mujer</NavLink></p>
      <p><NavLink to="/gorros">Gorros</NavLink></p>
    </div>
  )
}


