import { AdminCards } from "../../../components/admin/AdminCards";
import { cards } from "../../../data/cards";

export const ResumenView = () => {
  return (
    <div className='bg-[#f3f0eb] w-full h-full'>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {cards.map((card) => (
          <AdminCards key={card.title} {...card} />
        ))}
      </div>
      <div>
        // TODO: Aquí van las gráficas estadísticas de barra con un scroll vertical con el fin de que queden todas en la misma vista y sean accesibles desde ahí
      </div>
    </div >
  )
}
