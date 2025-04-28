<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useOrderStore } from '@/stores/orders'  // <-- Import your store

const router = useRouter()

// Toggle for the drawer
const drawer = ref(false)

// Access the order store
const orderStore = useOrderStore()

const fullName = 'John Doe'
const email = 'johndoe@example.com'
const phone = '09123456789'
const address = '123 Main Street, Cityville'

function goToAbout() {
  router.push('/about')
}

function openSettings() {
  // Settings function (you can implement later)
}

function logout() {
  // Logout function (you can implement later)
}
</script>

<template>
  <v-card>
    <v-layout>
      <!-- Navigation Drawer -->
      <v-navigation-drawer v-model="drawer" location="right" temporary style="z-index: 2000">
        <v-list-item class="text-center mt-2">
          <v-avatar>
            <img src="https://randomuser.me/api/portraits/men/78.jpg" alt="User Avatar" />
          </v-avatar>
          <v-list-item-content>
            <v-list-item-title class="font-weight-bold">{{ fullName }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-divider></v-divider>

        <v-list nav>
          <v-list-item><v-list-item-title><strong>Email:</strong> {{ email }}</v-list-item-title></v-list-item>
          <v-list-item><v-list-item-title><strong>Phone:</strong> {{ phone }}</v-list-item-title></v-list-item>
          <v-list-item><v-list-item-title><strong>Address:</strong> {{ address }}</v-list-item-title></v-list-item>

          <v-divider></v-divider>

          <v-list-item prepend-icon="mdi-forum" @click="goToAbout">
            <v-list-item-title>About</v-list-item-title>
          </v-list-item>
          <v-list-item prepend-icon="mdi-cogs" @click="openSettings">
            <v-list-item-title>Settings</v-list-item-title>
          </v-list-item>
          <v-list-item prepend-icon="mdi-logout" @click="logout">
            <v-list-item-title>Log Out</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>

      <v-main>
        <!-- Header -->
        <v-app-bar color="light-blue-lighten-3" flat height="70" elevation="2" app>
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
                  <div v-if="orderStore.orders.length === 0" class="text-center grey--text">
                    No orders found.
                  </div>

                  <v-expansion-panels v-else>
                    <v-expansion-panel v-for="(order, index) in orderStore.orders" :key="index">
                      <v-expansion-panel-title>
                        Order #{{ index + 1 }}
                        <br>
                        <p class="px-2">DATE:</p>
                        <small>{{ order.date }} {{ order.time }}</small>  <!-- show date and time -->
                      </v-expansion-panel-title>
                      <v-expansion-panel-text>
                        <v-list dense>
                          <strong>Order Description:</strong> {{ order.description }}
                          <v-list-item v-for="(item, idx) in order.items" :key="idx">
                            <v-list-item-content>
                              <v-list-item-title>{{ item.name }}</v-list-item-title>
                              <v-list-item-subtitle>Qty: {{ item.quantity }} — ₱{{ item.price }}</v-list-item-subtitle>
                            </v-list-item-content>
                          </v-list-item>
                          <div class="mt-2 text-right font-weight-bold">
                          Total: ₱{{ order.items.reduce((sum, item) => sum + item.price * item.quantity, 0) }}
                        </div>
                        </v-list>
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
