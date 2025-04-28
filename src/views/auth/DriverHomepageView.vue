<script setup>
import { ref, computed } from 'vue'
import { useOrderStore } from '@/stores/orders'
import { useRouter } from 'vue-router'

const orderStore = useOrderStore()
const orders = computed(() => orderStore.orders)

const drawer = ref(false)
const router = useRouter()

// Marks an order as delivered and moves it to completed orders
function markAsDelivered(orderId) {
  const orderIndex = orders.value.findIndex(order => order.id === orderId)
  if (orderIndex !== -1) {
    const order = orders.value.splice(orderIndex, 1)[0]
    orderStore.addCompletedOrder(order)
  }
}

function goToCompletedDeliveries() {
  router.push({ name: 'CompletedDeliverypage' })
}

const showLogoutDialog = ref(false)  // Initially set to false so it's hidden

function logout() {
  showLogoutDialog.value = true // Show the confirmation dialog when logout is clicked
}

function confirmLogout() {
  router.push('/login')  // Redirect to login page
  showLogoutDialog.value = false  // Close the confirmation dialog
}

function cancelLogout() {
  showLogoutDialog.value = false  // Close the confirmation dialog without logging out
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
          <v-list-item><v-list-item-title><strong>Phone Number:</strong> {{ phone }}</v-list-item-title></v-list-item>
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

      <!-- Main Content -->
      <v-main>
        <!-- App Bar -->
        <v-app-bar color="light-blue-lighten-3" flat height="70" elevation="2" app>
          <v-spacer></v-spacer>
          <v-btn icon size="medium" class="mx-5"><v-icon>mdi-message-text</v-icon></v-btn>
          <v-btn icon size="medium" class="mx-5"><v-icon>mdi-bell</v-icon></v-btn>
          <v-btn icon size="medium" class="mx-5 pe-3" @click.stop="drawer = !drawer">
            <v-icon>mdi-account</v-icon>
          </v-btn>
        </v-app-bar>

        <!-- LOGOUT CONFIRMATION DIALOG -->
        <v-dialog v-model="showLogoutDialog" persistent>
              <v-card class="mx-auto">
                <v-card-title class="text-center">
                  Are you sure you want to log out?
                </v-card-title>
                <v-card-actions>
                  <v-btn color="blue-lighten-1" text @click="cancelLogout">Cancel</v-btn>
                  <v-btn color="red" text @click="confirmLogout">Log Out</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>

        <!-- Customer Orders -->
        <v-container class="mt-6">
          <v-row>
            <v-col cols="12">
              <v-card elevation="3" class="pa-4">
                <v-card-title class="d-flex justify-space-between align-center">
                  <span class="text-h6">Customer Orders</span>
                  <v-btn color="blue" variant="tonal" @click="goToCompletedDeliveries" class="ml-auto" small>
                    <v-icon start>mdi-check-circle-outline</v-icon>
                    Completed Deliveries
                  </v-btn>
                </v-card-title>

                <!-- Orders Loop -->
                <v-row v-for="(order, index) in orders" :key="index" class="mb-4">
                  <v-col cols="12">
                    <v-card outlined>
                      <v-card-title>
                        <div>
                          <small>{{ order.date }} {{ order.time }}</small>  <!-- show date and time -->
                          <div><strong>Customer:</strong> {{ order.customer }}</div>
                          <div class="text-caption grey--text">{{ order.address }}</div>
                        </div>
                      </v-card-title>

                      <v-divider></v-divider>

                      <v-card-text>
                        <!-- NEW: Order Description -->
                        <div class="mb-4">
                          <strong>Order Description:</strong> {{ order.description }}
                        </div>

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
                        <v-btn color="success" text @click="markAsDelivered(order.id)">Mark as Delivered</v-btn>
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
