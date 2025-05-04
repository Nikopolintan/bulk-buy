<script setup>
import { ref, computed, onMounted } from 'vue'
import { useOrderStore } from '@/stores/orders'
import { useRouter } from 'vue-router'
import { supabase } from '@/utils/supabase' // Adjust if your Supabase client path differs
import ProfileSettings from '@/components/layout/ProfileSettings.vue'
import Logout from '@/components/layout/LogOut.vue'

const router = useRouter()
const drawer = ref(false)
const orderStore = useOrderStore()
const orders = computed(() => orderStore.orders)

// ========== User Profile Info ==========
const fullName = ref('')
const email = ref('')
const phone = ref('')
const address = ref('')

async function fetchUserInfo() {
  const { data: { session }, error } = await supabase.auth.getSession()
  if (error) {
    console.error('Error fetching session:', error.message)
    return
  }

  const user = session?.user
  if (user) {
    const metadata = user?.user_metadata
    fullName.value = metadata?.full_name || 'Driver'
    email.value = user?.email || 'N/A'
    phone.value = metadata?.phone_num || 'N/A'
    address.value = metadata?.address || 'N/A'
  }
}

onMounted(() => {
  fetchUserInfo()
})

// ========== Order Actions ==========
function markAsDelivered(orderId) {
  const order = orderStore.orders.find(order => order.id === orderId)
  if (order) {
    orderStore.removeOrder(orderId)
    orderStore.addCompletedOrder(order)
  }
}

function goToCompletedDeliveries() {
  router.push({ name: 'completed-delivery' })
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
          <ProfileSettings></ProfileSettings>
          <Logout></Logout>
        </v-list>
      </v-navigation-drawer>

      <!-- Main Content -->
      <v-main>
        <!-- App Bar -->
        <v-app-bar color="light-blue-lighten-3" flat height="70" elevation="2" app>
          <v-spacer></v-spacer>
          <v-btn icon size="medium" class="mx-5"><v-icon>mdi-bell</v-icon></v-btn>
          <v-btn icon size="medium" class="mx-5 pe-3" @click.stop="drawer = !drawer">
            <v-icon>mdi-account</v-icon>
          </v-btn>
        </v-app-bar>

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
                          <div><strong>Contact Info:</strong> {{ order.phone_num }}</div>
                          <div class="text-caption grey--text">Address: {{ order.address }}</div>
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
