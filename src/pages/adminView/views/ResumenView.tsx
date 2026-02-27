import { AdminCards } from "../../../components/admin/AdminCards";
import { cards } from "../../../data/cards";

export const ResumenView = () => {
  return (
    <div className='bg-[#f3f0eb] dark:bg-gray-900 w-full h-full flex flex-col gap-2 md:gap-4'>
      <div className="grid grid-cols-2 gap-2 md:gap-4 md:grid-cols-4">
        {cards.map((card) => (
          <AdminCards key={card.title} {...card} />
        ))}
      </div>
      <div className="bg-white rounded-lg h-100 w-auto border-1 border-gray-300 dark:bg-gray-900">
        {/* Aquí van las gráficas estadísticas de barra con un scroll vertical con el fin de que queden todas en la misma vista y sean accesibles desde ahí */}
      </div>
    </div >
  )
}
