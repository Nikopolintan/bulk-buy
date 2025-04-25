<script setup>
import { ref } from 'vue'
import { useOrderStore } from '@/stores/orders'

const drawer = ref(false)
const orderStore = useOrderStore()

// Assuming orders are stored like this:
const pastOrders = orderStore.orders
</script>

<template>
  <v-card>
    <v-layout>
      <!-- Navigation Drawer -->
      <v-navigation-drawer v-model="drawer" location="right" temporary style="z-index: 2000">
        <v-list-item
          prepend-avatar="https://randomuser.me/api/portraits/men/78.jpg"
          title="John Leider"
        ></v-list-item>

        <v-divider></v-divider>

        <v-list nav>
          <v-list-item prepend-icon="mdi-view-dashboard" title="Home" @click="$router.push({ name: 'customerhomepage' })"></v-list-item>
          <v-list-item prepend-icon="mdi-history" title="Order History" @click="$router.push({ name: 'OrderHistorypage' })"></v-list-item>
        </v-list>
      </v-navigation-drawer>

      <v-main>
        <!-- Header -->
        <v-app-bar
            color="light-blue-lighten-3"
            flat
            height="70"
            elevation="2"
            app
          >
            <v-spacer></v-spacer>

            <v-btn icon size="medium" class="mx-5">
              <v-icon>mdi-message-text</v-icon>
            </v-btn>

            <v-btn icon size="medium" class="mx-5">
              <v-icon>mdi-bell</v-icon>
            </v-btn>

            <v-btn icon size="medium" class="mx-5 pe-3" @click.stop="drawer = !drawer">
              <v-icon>mdi-account</v-icon>
            </v-btn>
          </v-app-bar>

        <!-- Order History -->
        <v-container class="mt-6">
          <v-row>
            <v-col cols="12">
              <v-card elevation="4">
                <v-card-title class="text-h5">Order History</v-card-title>
                <v-divider></v-divider>

                <v-card-text>
                  <div v-if="pastOrders.length === 0" class="text-center grey--text">
                    No orders found.
                  </div>

                  <v-accordion v-else>
                    <v-expansion-panels>
                      <v-expansion-panel v-for="(order, index) in pastOrders" :key="index">
                        <v-expansion-panel-title>
                          Order #{{ index + 1 }} — {{ order.customer }} — {{ order.address }}
                        </v-expansion-panel-title>
                        <v-expansion-panel-text>
                          <v-list dense>
                            <v-list-item
                              v-for="(item, idx) in order.items"
                              :key="idx"
                            >
                              <v-list-item-content>
                                <v-list-item-title>{{ item.name }}</v-list-item-title>
                                <v-list-item-subtitle>Qty: {{ item.quantity }} — ₱{{ item.price }}</v-list-item-subtitle>
                              </v-list-item-content>
                            </v-list-item>
                          </v-list>
                        </v-expansion-panel-text>
                      </v-expansion-panel>
                    </v-expansion-panels>
                  </v-accordion>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-main>
    </v-layout>
  </v-card>
</template>
