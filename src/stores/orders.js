import { defineStore } from 'pinia'

export const useOrderStore = defineStore('orderStore', {
  state: () => ({
    orders: []
  }),
  actions: {
    addOrder(order) {
      this.orders.push(order)
    }
  }
})
