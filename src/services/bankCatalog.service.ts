import { transactionsService } from "./transactions.service"

export const bankCatalogService = {
  getBanks() {
    return transactionsService.getBanks()
  },

  createBank(nombre: string) {
    return transactionsService.createBank({ nombre: nombre.trim() })
  },

  updateBank(id: number, nombre: string) {
    return transactionsService.updateBank(id, { nombre: nombre.trim() })
  },

  deleteBank(id: number) {
    return transactionsService.deleteBank(id)
  },
}
