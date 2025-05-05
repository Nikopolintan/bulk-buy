<script setup>
// ===== Imports =====
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/utils/supabase'
import baoBaoBg from '/images/bao-bao.png'
import { useOrderStore } from '@/stores/orders'
import ProfileSettings from '@/components/layout/ProfileSettings.vue'
import Logout from '@/components/layout/LogOut.vue'

// ===== Setup =====
const router = useRouter()
const orderStore = useOrderStore()

// ===== UI State =====
const drawer = ref(false)
const showReceiptDialog = ref(false)

// ===== Background Styling =====
const backgroundStyle = computed(() => ({
  backgroundImage: `url(${baoBaoBg})`,
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  backgroundAttachment: 'fixed',
  backgroundColor: 'rgba(0, 0, 255, 0.1)'
}))

// ===== User Info =====
const fullName = ref('')
const email = ref('')
const phone = ref('')
const address = ref('')

async function fetchUserInfo() {
  const { data: sessionData, error } = await supabase.auth.getSession()
  if (error || !sessionData.session) return

  const user = sessionData.session.user
  const metadata = user?.user_metadata
  fullName.value = metadata?.full_name || 'Driver'
  email.value = user?.email || 'N/A'
  phone.value = metadata?.phone_num || 'N/A'
  address.value = metadata?.address || 'N/A'
}

onMounted(fetchUserInfo)

// ===== Products =====
const products = ref([
  { name: 'Rice 25kg', description: 'Premium jasmine rice', price: 1250, quantity: 1 },
  { name: 'Cooking Oil 1L', description: 'Vegetable oil', price: 150, quantity: 1 },
  { name: 'Detergent Powder', description: '2kg stain-fighter', price: 230, quantity: 1 },
  { name: 'Canned Tuna', description: '180g in oil', price: 45, quantity: 1 },
  { name: 'Coffee 3-in-1', description: '20 sachets', price: 90, quantity: 1 }
])

// ===== Order State =====
const orderedProducts = ref([])
const deliveryFee = 50

const totalPrice = computed(() =>
  orderedProducts.value.reduce((sum, item) => sum + item.price, 0)
)

function orderProduct(product) {
  const existing = orderedProducts.value.find((p) => p.name === product.name)
  if (!existing) {
    orderedProducts.value.push({
      ...product,
      price: product.price * product.quantity
    })
  } else {
    alert(`${product.name} is already in your order list`)
  }
}

function cancelOrder(name) {
  orderedProducts.value = orderedProducts.value.filter((p) => p.name !== name)
}


function bookOrder() {
  if (orderedProducts.value.length > 0) showReceiptDialog.value = true
}

function confirmBookOrder() {
  orderStore.addOrder({
    customer: fullName.value,
    address: address.value,
    items: [...orderedProducts.value],
    deliveryFee,
    total: totalPrice.value + deliveryFee
  })
  orderedProducts.value = []
  showReceiptDialog.value = false
  router.push('/OrderHistorypage')
}
</script>

<template>
  <v-card flat class="fill-height">
    <v-layout class="fill-height">
      <!-- Drawer (User Profile) -->
      <v-navigation-drawer v-model="drawer" location="right" temporary>
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
          <v-list-item prepend-icon="mdi-cart" @click="router.push('/orderhistorypage')">
            <v-list-item-title>My Orders</v-list-item-title>
          </v-list-item>
          <ProfileSettings />
          <Logout />
        </v-list>
      </v-navigation-drawer>

      <v-main class="scrollable-main">
        <div :style="backgroundStyle" class="background-blur-wrapper"></div>
        <div class="content-wrapper">
          <!-- App Bar -->
          <v-app-bar color="light-blue-lighten-3" flat height="70" elevation="2" app>
            <v-spacer></v-spacer>
            <v-btn icon><v-icon>mdi-bell</v-icon></v-btn>
            <v-btn icon class="pe-3" @click.stop="drawer = !drawer">
              <v-icon>mdi-account</v-icon>
            </v-btn>
          </v-app-bar>

          <!-- Page Content -->
          <v-container fluid class="page-content">
            <v-row>
              <!-- Order Cart -->
              <v-col cols="12" md="3">
                <v-card elevation="3">
                  <v-card-title class="text-h6 text-center bg-light-blue-lighten-4">My Orders</v-card-title>
                  <v-divider></v-divider>
                  <div v-if="orderedProducts.length === 0" class="text-center pa-4 grey--text">No orders yet</div>
                  <v-list dense>
                    <v-list-item v-for="(ordered, index) in orderedProducts" :key="index">
                      <v-row no-gutters align="center" class="w-100">
                        <v-col cols="2">
                          <v-btn icon size="x-small" @click="cancelOrder(ordered.name)">
                            <v-icon color="red" size="18">mdi-close</v-icon>
                          </v-btn>
                        </v-col>
                        <v-col cols="6">
                          <div class="font-weight-medium">{{ ordered.name }}</div>
                          <div class="text-caption">Qty: {{ ordered.quantity }}</div>
                        </v-col>
                        <v-col cols="4" class="text-right">
                          ₱{{ ordered.price }}
                        </v-col>
                      </v-row>
                    </v-list-item>
                  </v-list>
                  <v-divider class="my-2"></v-divider>
                  <div class="text-right px-4 pb-2 font-weight-bold">TOTAL: ₱{{ totalPrice }}</div>
                  <v-btn class="ma-2" color="blue-lighten-4" @click="bookOrder">CHECK OUT</v-btn>
                </v-card>
              </v-col>

              <!-- Product List -->
              <v-col cols="12" md="9">
                <v-row class="d-flex align-stretch" justify="start" no-gutters>
                  <v-col v-for="(product, index) in products" :key="index" cols="12" sm="6" md="4" lg="3" class="pa-2">
                    <v-card class="pa-3 h-100 d-flex flex-column justify-space-between" elevation="5">
                      <div style="height: 100px; background-color: #f0f0f0"></div>
                      <v-card-title class="text-h6">{{ product.name }}</v-card-title>
                      <v-card-subtitle>{{ product.description }}</v-card-subtitle>
                      <v-card-text>
                        <div><strong>Price:</strong> ₱{{ product.price }}</div>
                        <v-text-field v-model="product.quantity" type="number" label="Qty" min="1" class="mt-2" dense hide-details />
                      </v-card-text>
                      <v-card-actions class="d-flex justify-center">
                        <v-btn color="light-blue-lighten-1" @click="orderProduct(product)">Order</v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-container>

          <!-- Receipt Dialog -->
          <v-dialog v-model="showReceiptDialog" max-width="400">
            <v-card>
              <v-card-title class="text-h6">Receipt Summary</v-card-title>
              <v-card-text>
                <v-list dense>
                  <v-list-item v-for="item in orderedProducts" :key="item.name">
                    <v-list-item-content>
                      <v-list-item-title>{{ item.name }} (x{{ item.quantity }})</v-list-item-title>
                      <v-list-item-subtitle>₱{{ item.price.toFixed(2) }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
                <v-divider class="my-2" />
                <div class="text-right">
                  <p>Subtotal: ₱{{ totalPrice - deliveryFee }}</p>
                  <p>Delivery Fee: ₱{{ deliveryFee }}</p>
                  <p><strong>Total: ₱{{ totalPrice }}</strong></p>
                </div>
              </v-card-text>
              <v-card-actions>
                <v-btn text color="grey" @click="showReceiptDialog = false">Cancel</v-btn>
                <v-btn text color="blue-darken-1" @click="confirmBookOrder">Confirm</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </div>
      </v-main>
    </v-layout>
  </v-card>
</template>

<style scoped>
html, body, #app {
  height: 100%;
  margin: 0;
  scroll-behavior: smooth;
}

.v-application {
  background: transparent !important;
}

.background-blur-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
}

.content-wrapper {
  position: relative;
  z-index: 1;
  padding-top: 70px;
  padding-bottom: 32px;
}

.page-content {
  padding-top: 16px;
}

.scrollable-main {
  height: 100vh;
  overflow-y: auto;
}
</style>
