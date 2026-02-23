import { NavLink } from "react-router-dom";


export const RopaHombre = () => {
  return (
    <div className="bg-blue-600 h-full w-full flex-col flex">
      <h1>ropa hombre</h1>
      <NavLink to="/ropa-hombre/prenda-superior">prenda superior</NavLink>
      <NavLink to="/ropa-hombre/prenda-inferior">prenda inferior</NavLink>
    </div>
  )
}

 
