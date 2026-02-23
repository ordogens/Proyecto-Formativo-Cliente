import { NavLink } from "react-router-dom";


export const RopaMujer = () => {
  return (
    <div className="bg-pink-600 h-full w-full flex-col flex">
      <h1>ropa mujer</h1>
      <p><NavLink to="/ropa-mujer/prenda-superior">prenda superior</NavLink></p>
      <p><NavLink to="/ropa-mujer/prenda-inferior">prenda inferior</NavLink></p>
    </div>
  )
}


