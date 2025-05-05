<script setup>
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'
import { useOrderStore } from '@/stores/orders'
import { supabase } from '@/utils/supabase'

const router = useRouter()
const orderStore = useOrderStore()

// Navigate back
const goToCustomerMain = () => {
  router.push('/customerhomepage')
}

// Fetch orders on mount
async function fetchOrders() {
  const { data: orders, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching orders:', error.message)
    return
  }

  orders.forEach(order => orderStore.addOrder(order))
}

onMounted(() => {
  fetchOrders()
})
</script>

<template>
  <v-card>
    <v-layout>
      <v-main>
        <!-- Header -->
        <v-app-bar color="light-blue-lighten-3" flat height="70" elevation="2" app>
          <v-btn icon @click="goToCustomerMain">
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
          <v-toolbar-title>Order History</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-app-bar>

        <!-- Order History Section -->
        <v-container class="mt-6">
          <v-row>
            <v-col cols="12">
              <v-card elevation="4">
                <v-card-title class="text-h5">Order History</v-card-title>
                <v-divider></v-divider>

                <v-card-text>
                  <div v-if="orderStore.orders.length === 0" class="text-center grey--text">
                    No orders found.
                  </div>

                  <v-expansion-panels v-else>
                    <v-expansion-panel
                      v-for="(order, index) in orderStore.orders"
                      :key="order.id"
                    >
                      <v-expansion-panel-title>
                        Order #{{ index + 1 }}
                        <br>
                        <small>{{ order.date }} {{ order.time }}</small>
                      </v-expansion-panel-title>

                      <v-expansion-panel-text>
  <v-row class="px-4">
    <v-col cols="12">
      <div class="font-weight-bold">{{ order.customer }}</div>

      <v-row v-for="(item, idx) in order.items" :key="idx" align="center">
        <v-col cols="6">{{ item.name }} - Qty: {{ item.quantity }}</v-col>
        <v-col cols="6" class="text-right">₱{{ item.price }}</v-col>
      </v-row>

      <v-divider class="my-2" />

      <v-row>
        <v-col cols="6">Delivery Fee:</v-col>
        <v-col cols="6" class="text-right">₱{{ order.deliveryFee }}</v-col>
      </v-row>

      <v-row class="font-weight-bold">
        <v-col cols="6">Total:</v-col>
        <v-col cols="6" class="text-right text-blue-darken-2">₱{{ order.total }}</v-col>
      </v-row>

      <v-row>
        <v-col cols="6">Status:</v-col>
        <v-col cols="6" class="text-right">{{ order.status }}</v-col>
      </v-row>

      <v-row justify="end" class="mt-2">
        <v-btn color="red-darken-1" class="text-white" size="small">
          CANCEL ORDER
        </v-btn>
      </v-row>
    </v-col>
  </v-row>
</v-expansion-panel-text>

                    </v-expansion-panel>
                  </v-expansion-panels>

                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-main>
    </v-layout>
  </v-card>
</template>
