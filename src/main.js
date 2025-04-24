// import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

// stores/orders.js
import { defineStore } from 'pinia'

export const useOrderStore = defineStore('orders', {
  state: () => ({
    orders: [
      // Sample orders
      {
        id: 1,
        customer: 'John Doe',
        address: '123 Main St',
        items: [
          { name: 'Pizza', quantity: 1, price: 300 },
          { name: 'Coke', quantity: 2, price: 50 }
        ]
      },
      {
        id: 2,
        customer: 'Jane Smith',
        address: '456 Oak St',
        items: [
          { name: 'Burger', quantity: 2, price: 150 },
          { name: 'Fries', quantity: 1, price: 80 }
        ]
      }
    ],
    completedOrders: [] // Completed orders
  }),

  actions: {
    removeOrder(orderId) {
      this.orders = this.orders.filter(order => order.id !== orderId)
    },
    addCompletedOrder(orderId) {
      const order = this.orders.find(order => order.id === orderId)
      if (order) {
        this.completedOrders.push(order)
      }
    }
  }
})

// Vuetify
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import App from './App.vue'
import router from './router'

const app = createApp(App)

const vuetify = createVuetify({
  icons: {
    defaultSet: 'mdi',
  },
  components,
  directives,

})



app.use(createPinia())
app.use(router)
app.use(vuetify)

app.mount('#app')
