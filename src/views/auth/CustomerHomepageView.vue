<script setup>
// ===== Imports =====
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/utils/supabase'
import baoBaoBg from '/images/bg-image.jpg'
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
  {
    name: 'Rice 25kg',
    description: 'Premium jasmine rice',
    price: 1250,
    quantity: 1,
    image: 'https://www.mashed.com/img/gallery/does-freezing-uncooked-rice-make-it-last-longer/l-intro-1682193675.jpg',
    category: 'Staples'
  },
  {
    name: 'Cooking Oil 1L',
    description: 'Vegetable oil',
    price: 150,
    quantity: 1,
    image: 'http://imgusr.tradekey.com/p-138363-20060310082852/canola-cooking-oil.jpg',
    category: 'Condiments'
  },
  {
    name: 'Detergent Powder',
    description: '2kg stain-fighter',
    price: 230,
    quantity: 1,
    image: 'https://i5.walmartimages.com/asr/a4d6b0da-e216-4d7c-bc16-15ef18331e8c_1.62b72c57cbc3a3ca39e2471d64ef5614.jpeg',
    category: 'Household'
  },
  {
    name: 'Canned Sardines',
    description: 'Mega sardines in tomato sauce',
    price: 25,
    quantity: 1,
    image: 'https://i0.wp.com/megaprimefoods.com.ph/wp-content/uploads/2021/04/MEGA-Sardines-Product-Shot-1024x1024-1.jpg',
    category: 'Canned Goods'
  },
  {
    name: 'Instant Noodles',
    description: 'Beef flavor, 5-pack',
    price: 60,
    quantity: 1,
    image: 'https://marketech-apac.com/wp-content/uploads/2022/07/Lucky-Me.jpg',
    category: 'Snacks'
  },
  {
    name: 'Toilet Paper',
    description: '12 rolls, 2-ply',
    price: 180,
    quantity: 1,
    image: 'https://m.media-amazon.com/images/I/81qzv-uJeOL._AC_SL1500_.jpg',
    category: 'Household'
  },
  {
    name: 'Soya Sauce 1L',
    description: 'Silver Swan soy sauce',
    price: 45,
    quantity: 1,
    image: 'https://cf.shopee.ph/file/ea425e2df3b49121920a53bff0a9a61e',
    category: 'Condiments'
  },
  {
    name: 'Sugar 2kg',
    description: 'Refined white sugar',
    price: 110,
    quantity: 1,
    image: 'https://thumbs.dreamstime.com/b/sm-bonus-brown-sugar-manila-philippines-ph-june-188617887.jpg',
    category: 'Staples'
  },
  {
    name: 'Salt 1kg',
    description: 'Iodized cooking salt',
    price: 25,
    quantity: 1,
    image: 'https://tse4.mm.bing.net/th?id=OIP.998U0oHZKEV9dx4_3-dSvgHaEK&pid=Api&P=0&h=180',
    category: 'Condiments'
  },
  {
    name: 'Coffee 3-in-1',
    description: 'Nescafé Original, 10 sachets',
    price: 85,
    quantity: 1,
    image: 'https://tse1.mm.bing.net/th?id=OIP.0w5y_ZepIm-KGxF2HUN3GgHaHa&pid=Api&P=0&h=180',
    category: 'Beverages'
  },
  {
    name: 'Milo 300g',
    description: 'Energy drink powder',
    price: 75,
    quantity: 1,
    image: 'https://www.nicepng.com/png/detail/392-3921091_nestle-milo-nestle-milo-philippines.png',
    category: 'Beverages'
  },
  {
    name: 'Loaf Bread',
    description: 'Classic white bread',
    price: 55,
    quantity: 1,
    image: 'https://pgmobile.puregold.com.ph/images/4806502720417.jpg',
    category: 'Bakery'
  }
])

const categories = computed(() => {
  return [...new Set(products.value.map(product => product.category))]
})

const selectedCategory = ref('All')

const filteredProducts = computed(() => {
  if (selectedCategory.value === 'All') return products.value
  return products.value.filter(p => p.category === selectedCategory.value)
})

const showSearch = ref(false)

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
            <img src="https://tse2.mm.bing.net/th?id=OIP.sbRjMD2zaP12rWg1bR1PDAHaHa&pid=Api&P=0&h=180" alt="User Avatar" height="50px" width="50px" />
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
        <!-- Animated GIF Centered at Top -->
          <v-container class="top-gif-container" fluid>
            <img src="/images/animation.gif" alt="Top Animation" class="top-gif" />
          </v-container>
        <div :style="backgroundStyle" class="background-blur-wrapper"></div>
        <div class="content-wrapper">
        <!-- App Bar -->
        <v-app-bar color="light-blue-lighten-3" flat height="70" elevation="2" app>
          <!-- Logo on the Left -->
          <v-toolbar-title class="ps-4">
            <img src="/images/BULKBUY logo.png" alt="Bulk Buy Logo" height="50" />
          </v-toolbar-title>

          <v-spacer></v-spacer>

          <!-- Search Icon and Input Field (Positioned Next to Notification) -->
          <v-btn icon @click="showSearch = !showSearch">
            <v-icon>mdi-magnify</v-icon>
          </v-btn>

          <!-- Toggle Search Input -->
          <transition name="fade">
            <v-text-field
              v-if="showSearch"
              v-model="searchQuery"
              placeholder="Search products"
              hide-details
              solo
              flat
              class="white rounded-pill ms-3"
              style="max-width: 600px; height: 40px; background-color: white;"
              @click:append="searchProduct"
            />
          </transition>

          <!-- Categories Dropdown Menu -->
          <v-menu offset-y>
            <template #activator="{ props }">
              <v-btn icon v-bind="props">
                <v-icon>mdi-view-list</v-icon>
              </v-btn>
            </template>

            <v-list>
              <v-list-item
                v-for="category in ['All', ...categories]"
                :key="category"
                @click="selectedCategory = category"
              >
                <v-list-item-title :class="{ 'text-blue-darken-2': selectedCategory === category }">
                  {{ category }}
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>

          <!-- Notification Bell -->
          <v-btn icon>
            <v-icon>mdi-bell</v-icon>
          </v-btn>

          <!-- User Account -->
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
                  <v-col v-for="(product, index) in filteredProducts" :key="index" cols="12" sm="6" md="4" lg="3" class="pa-2">
                    <v-card class="pa-3 h-100 d-flex flex-column justify-space-between" elevation="5">
                      <v-img :src="product.image" height="100" class="mb-2" cover />
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
            <!-- Persistent Footer -->
              <v-footer app color="blue-lighten-4" class="text-center pa-3 mt-8">
                  <span class="text-caption">© {{ new Date().getFullYear() }} BulkBuy. All rights reserved.</span>
              </v-footer>
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

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.top-gif-container {
  position: absolute;
  top: 40px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;
  width: 100%;
  display: flex;
  justify-content: center;
  padding-top: 10px;
  background: transparent;
}

.top-gif {
  max-width: 140px;
  height: auto;
  background: transparent;
}
</style>
