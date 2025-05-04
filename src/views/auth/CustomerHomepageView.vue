<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/utils/supabase'
import baoBaoBg from '/images/bao-bao.png'
import { useOrderStore } from '@/stores/orders'
import ProfileSettings from '@/components/layout/ProfileSettings.vue'
import Logout from '@/components/layout/LogOut.vue'

const router = useRouter()
const orderStore = useOrderStore()

const drawer = ref(false)
const showReceiptDialog = ref(false)


const backgroundStyle = computed(() => ({
  backgroundImage: `url(${baoBaoBg})`,
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  backgroundAttachment: 'fixed',
  backgroundColor: 'rgba(0, 0, 255, 0.1)'
}))

// ========== User Profile Info ==========
const fullName = ref('')
const email = ref('')
const phone = ref('')
const address = ref('')

async function fetchUserInfo() {
  const { data: sessionData, error } = await supabase.auth.getSession()
  if (error || !sessionData.session) {
    console.error('Error fetching session or session is null:', error?.message)
    return
  }

  const user = sessionData.session.user
  const metadata = user?.user_metadata
  fullName.value = metadata?.full_name || 'Driver'
  email.value = user?.email || 'N/A'
  phone.value = metadata?.phone_num || 'N/A'
  address.value = metadata?.address || 'N/A'
}


onMounted(() => {
  fetchUserInfo()
})

const products = ref([
  { name: 'Rice 25kg', description: 'Premium jasmine rice', price: 1250, quantity: 1 },
  { name: 'Cooking Oil 1L', description: 'Vegetable oil', price: 150, quantity: 1 },
  { name: 'Detergent Powder', description: '2kg stain-fighter', price: 230, quantity: 1 },
  { name: 'Canned Tuna', description: '180g in oil', price: 45, quantity: 1 },
  { name: 'Coffee 3-in-1', description: '20 sachets', price: 90, quantity: 1 },
])

const orderedProducts = ref([])

function orderProduct(product) {
  const existing = orderedProducts.value.find((p) => p.name === product.name)
  if (!existing) {
    orderedProducts.value.push({
      ...product,
      price: product.price * product.quantity,
    })
  } else {
    alert(`${product.name} is already in your order list`)
  }
}

function cancelOrder(productName) {
  orderedProducts.value = orderedProducts.value.filter((p) => p.name !== productName)
}

function cancelAllOrders() {
  orderedProducts.value = []
}

const deliveryFee = 50

const totalPrice = computed(() =>
  orderedProducts.value.reduce((sum, item) => sum + item.price, 0)
)

function bookOrder() {
  if (orderedProducts.value.length === 0) return
  showReceiptDialog.value = true
}

function confirmBookOrder() {
  orderStore.addOrder({
  customer: fullName.value,
  address: address.value,
  items: [...orderedProducts.value],
  deliveryFee,
  total: totalPrice.value + deliveryFee,
})

  orderedProducts.value = []
  showReceiptDialog.value = false
  router.push('/OrderHistorypage')
}


</script>

<template>
  <v-card flat class="fill-height">
    <v-layout class="fill-height">
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
          <v-list-item prepend-icon="mdi-cart" @click="router.push('/orderhistorypage')">
            <v-list-item-title>My Orders</v-list-item-title>
          </v-list-item>
          <ProfileSettings></ProfileSettings>
          <Logout></Logout>
        </v-list>
      </v-navigation-drawer>

      <v-main class="scrollable-main">
        <div :style="backgroundStyle" class="background-blur-wrapper"></div>

        <div class="content-wrapper">
          <!-- HEADER -->
          <v-app-bar color="light-blue-lighten-3" flat height="70" elevation="2" app>
            <v-spacer></v-spacer>
            <v-btn icon size="medium" class="mx-5">
              <v-icon>mdi-bell</v-icon>
            </v-btn>
            <v-btn icon size="medium" class="mx-5 pe-3" @click.stop="drawer = !drawer">
              <v-icon>mdi-account</v-icon>
            </v-btn>
          </v-app-bar>





          <!-- PAGE CONTENT -->
          <v-container fluid class="page-content">
            <v-row>
              <!-- ORDER CART -->
              <v-col cols="12" md="3">
                <v-card elevation="3">
                  <v-card-title class="text-h6 text-center bg-light-blue-lighten-4">My Orders</v-card-title>
                  <v-divider></v-divider>

                  <div v-if="orderedProducts.length === 0" class="text-center pa-4 grey--text text--darken-1">
                    No orders yet
                  </div>

                  <v-list dense>
                    <v-list-item v-for="(ordered, index) in orderedProducts" :key="index">
                      <v-row no-gutters align="center" class="w-100">
                        <v-col cols="2" class="d-flex justify-start">
                          <v-btn icon size="x-small" @click="cancelOrder(ordered.name)">
                            <v-icon color="red" size="18">mdi-close</v-icon>
                          </v-btn>
                        </v-col>
                        <v-col cols="5">
                          <div class="font-weight-medium">{{ ordered.name }}</div>
                          <div class="text-caption">Qty: {{ ordered.quantity }}</div>
                        </v-col>
                        <v-col cols="4" class="d-flex justify-between">
                          <span class="pe-1">₱</span><span class="font-weight-medium">{{ ordered.price }}</span>
                        </v-col>
                      </v-row>
                      <hr />
                    </v-list-item>
                  </v-list>

                  <v-divider class="my-2"></v-divider>
                  <div class="text-right px-4 pb-2 font-weight-bold">TOTAL: ₱{{ totalPrice }}</div>

                  <v-btn class="ma-2" color="blue-lighten-4" text="CHECK OUT" variant="flat" @click="showReceiptDialog = true"></v-btn>

                  <v-dialog v-model="showReceiptDialog" max-width="400">
                    <v-card title="Order Summary">
                      <v-btn
                        icon
                        class="ml-auto"
                        color="light-blue-lighten-3"
                        style="position: absolute; top: 10px; right: 10px;"
                        @click="showReceiptDialog = false"
                      >
                        <v-icon>mdi-close</v-icon>
                      </v-btn>

                      <v-card-text>
                        <v-list dense>
                          <v-list-item v-for="(ordered, index) in orderedProducts" :key="index">
                            <v-row no-gutters align="center" class="w-100">
                              <v-col cols="8">
                                <div class="font-weight-medium">{{ ordered.name }}</div>
                                <div class="text-caption">Qty: {{ ordered.quantity }}</div>
                              </v-col>
                              <v-col cols="4" class="d-flex justify-end">
                                <span class="font-weight-medium">₱{{ ordered.price }}</span>
                              </v-col>
                            </v-row>
                          </v-list-item>
                        </v-list>
                        <v-divider class="my-2"></v-divider>
                        <div class="font-weight-bold text-right">TOTAL: ₱{{ totalPrice }}</div>
                      </v-card-text>

                      <v-card-actions>
                        <v-btn text @click="cancelAllOrders">Cancel All Orders</v-btn>
                        <v-btn text @click="bookOrder">BOOK ORDER</v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                </v-card>
              </v-col>

              <!-- PRODUCTS -->
              <v-col cols="12" md="9">
                <v-row class="d-flex align-stretch" justify="start" no-gutters>
                  <v-col
                    v-for="(product, index) in products"
                    :key="index"
                    cols="12"
                    sm="6"
                    md="4"
                    lg="3"
                    class="pa-2"
                  >
                    <v-card class="pa-3 h-100 d-flex flex-column justify-space-between" elevation="5">
                      <div style="height: 100px; background-color: #f0f0f0"></div>
                      <v-card-title class="text-h6">{{ product.name }}</v-card-title>
                      <v-card-subtitle>{{ product.description }}</v-card-subtitle>
                      <v-card-text>
                        <div><strong>Price:</strong> ₱{{ product.price }}</div>
                        <v-text-field
                          v-model="product.quantity"
                          type="number"
                          label="Qty"
                          min="1"
                          class="mt-2"
                          dense
                          hide-details
                        ></v-text-field>
                      </v-card-text>
                      <v-card-actions class="d-flex justify-center">
                        <v-btn color="light-blue-lighten-1" @click="orderProduct(product)">
                          Order
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-col>
                </v-row>
              </v-col>

            </v-row>
          </v-container>
        </div>
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
                <v-divider class="my-2"></v-divider>
                <div class="text-right">
                  <p>Subtotal: ₱{{ totalPrice - deliveryFee }}</p>
                  <p>Delivery Fee: ₱{{ deliveryFee }}</p>
                  <p><strong>Total: ₱{{ totalPrice }}</strong></p>
                </div>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="grey" text @click="showReceiptDialog = false">Cancel</v-btn>
                <v-btn color="blue-darken-1" text @click="confirmBookOrder">Confirm</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
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

.v-list-item {
  cursor: pointer;
}

.animated-switch .v-selection-control__input {
  transition: all 0.3s ease; /* Smooth transition for the thumb */
}

.animated-switch .v-switch__thumb {
  transition: transform 0.3s ease, background-color 0.3s ease; /* Animate thumb movement and color */
}

.animated-switch .v-switch__track {
  transition: background-color 0.3s ease; /* Animate track color */
}
</style>
