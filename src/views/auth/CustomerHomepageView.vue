<script setup>
// ===== Imports =====
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/utils/supabase'
import baoBaoBg from '/images/bg-image.jpg'
import ProfileSettings from '@/components/layout/ProfileSettings.vue'
import Logout from '@/components/layout/LogOut.vue'

// ===== Setup =====
const router = useRouter()

// ===== UI State =====
const drawer = ref(false)
const showReceiptDialog = ref(false)

// ===== Background Styling =====
const backgroundStyle = computed(() => ({
  backgroundImage: `url(${baoBaoBg})`,
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  backgroundAttachment: 'fixed',
  backgroundColor: 'rgba(0, 0, 255, 0.1)',
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
const products = ref([])

async function fetchProducts() {
  const { data, error } = await supabase.from('products').select('*')
  if (error) {
    console.error('Error fetching products:', error)
  } else {
    products.value = data
  }
}

onMounted(() => {
  fetchUserInfo()
  fetchProducts()
})

// ===== New Product State =====
// const newProduct = ref({
//   name: '',
//   description: '',
//   price: null,
//   quantity: 1,
//   image_url: null
// })

// function handleFileChange(event) {
//   const file = event?.target?.files?.[0] || event
//   if (file) {
//     newProduct.value.image_url = file
//   }
// }

// async function uploadProduct() {
//   const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
//   if (sessionError || !sessionData.session) {
//     alert('You must be logged in to upload products.')
//     return
//   }

//   const product = newProduct.value

//   if (!product.name || !product.description || !product.price || !product.image_url) {
//     alert('Please fill all fields and upload an image.')
//     return
//   }

//   // Upload image to Supabase Storage
//   const file = product.image_url
//   const fileExt = file.name.split('.').pop()
//   const fileName = `${Date.now()}.${fileExt}`
//   const filePath = `${fileName}`

//   const { error: uploadError } = await supabase.storage
//     .from('product-images')
//     .upload(filePath, file)

//   if (uploadError) {
//     console.error('Image upload failed:', uploadError)
//     alert('Image upload failed.')
//     return
//   }

//   const { data: publicUrlData } = supabase
//     .storage
//     .from('product-images')
//     .getPublicUrl(filePath)

//   const imageUrl = publicUrlData.publicUrl

//   const { error } = await supabase.from('products').insert([
//     {
//       name: product.name,
//       description: product.description,
//       price: product.price,
//       quantity: product.quantity,
//       image_url: imageUrl
//     }
//   ])

//   if (error) {
//     console.error('Upload error:', error)
//     alert('Failed to upload product.')
//   } else {
//     alert('Product uploaded successfully!')
//     newProduct.value = {
//       name: '',
//       description: '',
//       price: null,
//       quantity: 1,
//       image_url: null
//     }
//     fetchProducts()
//   }
// }

// ===== Order State =====
const orderedProducts = ref([])
const deliveryFee = 50

const totalPrice = computed(() =>
  orderedProducts.value.reduce((sum, item) => sum + item.price * item.quantity, 0),
)

function orderProduct(product) {
  const existing = orderedProducts.value.find((p) => p.id === product.id)
  if (!existing) {
    orderedProducts.value.push({
      ...product,
      quantity: product.quantity || 1,
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

async function confirmBookOrder() {
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
  if (sessionError || !sessionData.session) {
    alert('You must be logged in to place an order.')
    return
  }
  const user = sessionData.session.user
  const customer_id = user.id

  // Insert the order (get the new order id)
  const { data: orderData, error: orderError } = await supabase
    .from('orders')
    .insert([
      {
        subtotal: totalPrice.value,
        delivery_fee: deliveryFee,
        total_price: totalPrice.value + deliveryFee,
        customer_id,
      },
    ])
    .select('id')
    .single()

  if (orderError || !orderData) {
    alert('Failed to place order: ' + (orderError?.message || 'Unknown error'))
    return
  }
  const order_id = orderData.id

  // Insert each product as an order_item
  for (const item of orderedProducts.value) {
    const { error: itemError } = await supabase.from('order_items').insert([
      {
        order_id,
        product_id: item.id,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.price * item.quantity,
      },
    ])
    if (itemError) {
      alert('Failed to add order item: ' + itemError.message)
      return
    }
  }

  orderedProducts.value = []
  showReceiptDialog.value = false
  router.push('/OrderHistorypage')
}

const searchQuery = ref('')

const filteredProducts = computed(() => {
  if (!searchQuery.value.trim()) return products.value
  const q = searchQuery.value.trim().toLowerCase()
  return products.value.filter(
    (p) =>
      (p.name && p.name.toLowerCase().includes(q)) ||
      (p.description && p.description.toLowerCase().includes(q)),
  )
})
</script>

<template>
  <v-card flat class="fill-height">
    <v-layout class="fill-height">
      <!-- Drawer (User Profile) -->
      <v-navigation-drawer v-model="drawer" location="right" temporary>
        <v-list-item class="text-center mt-2">
          <v-avatar>
            <img
              src="https://tse2.mm.bing.net/th?id=OIP.sbRjMD2zaP12rWg1bR1PDAHaHa&pid=Api&P=0&h=180"
              alt="User Avatar"
              height="50px"
              width="50px"
            />
          </v-avatar>
          <v-list-item-content>
            <v-list-item-title class="font-weight-bold">{{ fullName }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
        <v-list nav>
          <v-list-item
            ><v-list-item-title><strong>Email:</strong> {{ email }}</v-list-item-title></v-list-item
          >
          <v-list-item
            ><v-list-item-title><strong>Phone:</strong> {{ phone }}</v-list-item-title></v-list-item
          >
          <v-list-item
            ><v-list-item-title
              ><strong>Address:</strong> {{ address }}</v-list-item-title
            ></v-list-item
          >
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

            <!-- Toggle Search Input -->
            <v-text-field
              v-model="searchQuery"
              placeholder="Search products"
              variant="outlined"
              density="compact"
              append-inner-icon="mdi-magnify"
              clearable
              style="max-width: 600px; height: 40px; background-color: white"
            />

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
                  <v-list-item-title
                    :class="{ 'text-blue-darken-2': selectedCategory === category }"
                  >
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
                  <v-card-title class="text-h6 text-center bg-light-blue-lighten-4"
                    >My Orders</v-card-title
                  >
                  <v-divider></v-divider>
                  <div v-if="orderedProducts.length === 0" class="text-center pa-4 grey--text">
                    No orders yet
                  </div>
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
                          ₱{{ (ordered.price * ordered.quantity).toLocaleString() }}
                        </v-col>
                      </v-row>
                    </v-list-item>
                  </v-list>
                  <v-divider class="my-2"></v-divider>
                  <div class="text-right px-4 pb-2 font-weight-bold">TOTAL: ₱{{ totalPrice }}</div>
                  <v-btn class="ma-2" color="blue-lighten-4" @click="bookOrder">CHECK OUT</v-btn>
                </v-card>
              </v-col>

              <!-- <v-col cols="11" md="6">
            <v-card class="pa-4" elevation="4">
      <v-card-title>Upload New Product</v-card-title>
      <v-card-text>
        <v-form>
          <v-text-field v-model="newProduct.name" label="Product Name" />
          <v-text-field v-model="newProduct.description" label="Description" />
          <v-text-field v-model="newProduct.price" label="Price" type="number" />
          <v-text-field v-model="newProduct.quantity" label="Quantity" type="number" />

          <v-file-input
            label="Upload Image"
            accept="image/*"
            @change="handleFileChange"
          />

          <v-btn color="primary" @click="uploadProduct">Upload Product</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
           </v-col> -->
            </v-row>

            <v-row>
              <!-- Product List -->
              <v-col cols="12" md="9">
                <v-row class="d-flex align-stretch" justify="start" no-gutters>
                  <v-col
                    v-for="(product, index) in filteredProducts"
                    :key="index"
                    cols="12"
                    sm="6"
                    md="4"
                    lg="3"
                    class="pa-2"
                  >
                    <v-card
                      class="pa-3 h-100 d-flex flex-column justify-space-between"
                      elevation="5"
                    >
                      <v-img :src="product.image_url" height="100px" contain></v-img>

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
                        />
                      </v-card-text>
                      <v-card-actions class="d-flex justify-center">
                        <v-btn color="light-blue-lighten-1" @click="orderProduct(product)"
                          >Order</v-btn
                        >
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
                      <v-list-item-subtitle class="text-right"
                        >₱{{
                          (item.price * item.quantity).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })
                        }}</v-list-item-subtitle
                      >
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
                <v-divider class="my-2" />
                <div class="text-right">
                  <p>Subtotal: ₱{{ totalPrice - deliveryFee }}</p>
                  <p>Delivery Fee: ₱{{ deliveryFee }}</p>
                  <p>
                    <strong>Total: ₱{{ totalPrice }}</strong>
                  </p>
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
          <span class="text-caption"
            >© {{ new Date().getFullYear() }} BulkBuy. All rights reserved.</span
          >
        </v-footer>
      </v-main>
    </v-layout>
  </v-card>
</template>

<style scoped>
html,
body,
#app {
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
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
