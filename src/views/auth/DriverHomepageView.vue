<script setup>
import { ref, computed } from 'vue'
import { useOrderStore } from '@/stores/orders'
import { useRouter } from 'vue-router'

// Fetching orders from the store (simulated)
const orderStore = useOrderStore()
const orders = computed(() => orderStore.orders)

// Drawer state for navigation
const drawer = ref(false)

// Use router to navigate to Completed Deliveries page
const router = useRouter()

// Method to handle Mark as Delivered button click
function markAsDelivered(orderId) {
  const orderIndex = orders.value.findIndex(order => order.id === orderId)
  if (orderIndex !== -1) {
    const order = orders.value.splice(orderIndex, 1)[0]
    // Add the completed order to the store or move it to the completed orders list
    orderStore.addCompletedOrder(order)
  }
}

// Navigate to the completed deliveries page
function goToCompletedDeliveries() {
  router.push({ name: 'CompletedDeliverypage' })
}
</script>

<template>
  <v-card>
    <v-layout>

      <!-- Navigation Drawer -->
      <v-navigation-drawer v-model="drawer" location="right" temporary style="z-index: 2000">
      <!-- User Profile Section -->
      <v-list-item class="text-center mt-2">
        <v-avatar>
          <img src="https://randomuser.me/api/portraits/men/78.jpg" alt="User Avatar" />
        </v-avatar>
        <v-list-item-content>
          <v-list-item-title class="font-weight-bold">{{ fullName }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <!-- User Information Section -->
      <v-list nav>
        <v-list-item>
          <v-list-item-title><strong>Email:</strong> {{ email }}</v-list-item-title>
        </v-list-item>

        <v-list-item>
          <v-list-item-title><strong>Phone Number:</strong> {{ phone }}</v-list-item-title>
        </v-list-item>

        <v-list-item>
          <v-list-item-title><strong>Address:</strong> {{ address }}</v-list-item-title>
        </v-list-item>

        <v-divider></v-divider>

        <!-- Navigation Links -->
        <v-list-item prepend-icon="mdi-view-dashboard" title="Home" value="home"></v-list-item>
        <v-list-item prepend-icon="mdi-forum" title="About" value="about"></v-list-item>
        <v-list-item prepend-icon="mdi-cogs" title="Settings" value="settings"></v-list-item>
        <v-list-item prepend-icon="mdi-logout" title="Log Out" value="logout"></v-list-item>
      </v-list>
    </v-navigation-drawer>

      <!-- Header Bar -->
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

        <!-- Order Summary -->
        <v-container class="mt-6">
          <v-row>
            <v-col cols="12">
              <v-card elevation="3" class="pa-4">
                <v-card-title class="d-flex justify-space-between align-center">
                  <span class="text-h6">Customer Orders</span>
                  <!-- Completed Deliveries Button in the upper-right corner of the card -->
                  <v-btn
                    color="blue"
                    variant="tonal"
                    @click="goToCompletedDeliveries"
                    class="ml-auto"
                    small
                  >
                    <v-icon start>mdi-check-circle-outline</v-icon>
                    Completed Deliveries
                  </v-btn>
                </v-card-title>

                <!-- Loop through orders and display each order -->
                <v-row v-for="(order, index) in orders" :key="index" class="mb-4">
                  <v-col cols="12">
                    <v-card outlined>
                      <v-card-title>
                        <div>
                          <div><strong>Customer:</strong> {{ order.customer }}</div>
                          <div class="text-caption grey--text">{{ order.address }}</div>
                        </div>
                      </v-card-title>
                      <v-divider></v-divider>
                      <v-card-text>
                        <v-list dense>
                          <v-list-item v-for="(item, i) in order.items" :key="i">
                            <v-list-item-content>
                              <v-list-item-title>
                                {{ item.name }} - Qty: {{ item.quantity }} (₱{{ item.price * item.quantity }})
                              </v-list-item-title>
                            </v-list-item-content>
                          </v-list-item>
                        </v-list>
                        <div class="mt-2 text-right font-weight-bold">
                          Total: ₱{{ order.items.reduce((sum, item) => sum + item.price * item.quantity, 0) }}
                        </div>
                      </v-card-text>
                      <v-card-actions>
                        <v-btn color="primary" text>Accept Task</v-btn>
                        <!-- Mark as Delivered Button -->
                        <v-btn color="success" text @click="markAsDelivered(order.id)">
                          Mark as Delivered
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-col>
                </v-row>

              </v-card>
            </v-col>
          </v-row>
        </v-container>

      </v-main>
    </v-layout>
  </v-card>
</template>
