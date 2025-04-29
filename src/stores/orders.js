import { defineStore } from 'pinia'

export const useOrderStore = defineStore('orderStore', {
  state: () => ({
    orders: [],
    completedOrders: []
  }),
  actions: {
    addOrder(order) {
      this.orders.push(order)
    },
    addCompletedOrder(order) {
      this.completedOrders.push({
        ...order,
        status: 'Completed'
      })
    },
    removeOrder(orderId) {
      this.orders = this.orders.filter(order => order.id !== orderId)
    }
  }
})
