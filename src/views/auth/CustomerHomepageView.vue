<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import baoBaoBg from '@/assets/images/bao-bao.png'
import { useOrderStore } from '@/stores/orders'

const router = useRouter()
const orderStore = useOrderStore()

const drawer = ref(false)
const showReceiptDialog = ref(false)
const showSettingsCard = ref(false)

const backgroundStyle = computed(() => ({
  backgroundImage: `url(${baoBaoBg})`,
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  backgroundAttachment: 'fixed',
  filter: 'blur(8px)',
  backgroundColor: 'rgba(0, 0, 255, 0.1)'
}))

const products = ref([
  { name: 'Rice 25kg', description: 'Premium jasmine rice', price: 1250, quantity: 1 },
  { name: 'Cooking Oil 1L', description: 'Vegetable oil', price: 150, quantity: 1 },
  { name: 'Detergent Powder', description: '2kg stain-fighter', price: 230, quantity: 1 },
  { name: 'Canned Tuna', description: '180g in oil', price: 45, quantity: 1 },
  { name: 'Coffee 3-in-1', description: '20 sachets', price: 90, quantity: 1 },
])

const orderedProducts = ref([])
const orderDescription = ref('')  // This will store the custom description


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

const totalPrice = computed(() =>
  orderedProducts.value.reduce((sum, item) => sum + item.price, 0)
)

function placeOrder() {
  if (orderedProducts.value.length === 0) return

  const now = new Date()
  const date = now.toLocaleDateString()
  const time = now.toLocaleTimeString()

  orderStore.addOrder({
    date,
    time,
  description: orderDescription.value, // add this
  items: [...orderedProducts.value],
})

orderedProducts.value = []
orderDescription.value = ''
showReceiptDialog.value = false


}

function goToAbout() {
  router.push('/about')
}

function openSettings() {
  showSettingsCard.value = true
}

const showChangePasswordDialog = ref(false)
const showNotificationPreferencesDialog = ref(false)
const showAccountPrivacyDialog = ref(false)

const currentPassword = ref('')
const newPassword = ref('')
const confirmNewPassword = ref('')

const emailNotifications = ref(true)
const smsNotifications = ref(false)
const appNotifications = ref(true)

const accountPrivacySetting = ref('public')

function openChangePassword() {
  showChangePasswordDialog.value = true
}


function openAccountPrivacy() {
  showAccountPrivacyDialog.value = true
}

function saveNewPassword() {
  if (newPassword.value !== confirmNewPassword.value) {
    alert('Passwords do not match!')
    return
  }
  alert('Password updated successfully!')
  showChangePasswordDialog.value = false
}

function openNotificationPreferences() {
  showNotificationPreferencesDialog.value = true
}

function saveNotificationPreferences() {
  alert('Notification preferences saved!')
  showNotificationPreferencesDialog.value = false
}

function saveAccountPrivacy() {
  alert('Privacy setting saved!')
  showAccountPrivacyDialog.value = false
}

// Password
const password = ref('')
const passwordRules = [
  (v) => !!v || 'Password is required',
  (v) => v.length >= 6 || 'Password must be at least 6 characters',
]

// Confirm Password
const passwordCon = ref('')
const passwordConRules = [
  (v) => !!v || 'Password confirmation is required',
  (v) => v === password.value || 'Passwords do not match',
]

// Toggle functions
const showPassword1 = ref(false)
function togglePasswordVisibility1() {
  showPassword1.value = !showPassword1.value
}

const showPassword2 = ref(false)
function togglePasswordVisibility2() {
  showPassword2.value = !showPassword2.value
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

const fullName = 'John Doe'
const email = 'johndoe@example.com'
const phone = '09123456789'
const address = '123 Main Street, Cityville'
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

          <v-list-item prepend-icon="mdi-forum" @click="goToAbout">
            <v-list-item-title>About</v-list-item-title>
          </v-list-item>
          <v-list-item prepend-icon="mdi-cart" @click="router.push('/orderhistorypage')">
            <v-list-item-title>My Orders</v-list-item-title>
          </v-list-item>
          <v-list-item prepend-icon="mdi-cogs" @click="openSettings">
            <v-list-item-title>Settings</v-list-item-title>
          </v-list-item>
          <v-list-item prepend-icon="mdi-logout" @click="logout">
            <v-list-item-title>Log Out</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>

      <v-main class="scrollable-main">
        <div :style="backgroundStyle" class="background-blur-wrapper"></div>

        <div class="content-wrapper">
          <!-- HEADER -->
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

          <!-- SETTINGS -->
          <v-dialog v-model="showSettingsCard" max-width="400" persistent>
            <v-card class="pa-4">
              <v-card-title>Settings</v-card-title>
              <v-divider></v-divider>
              <v-card-text>
                <v-list>
                  <v-list-item prepend-icon="mdi-lock-reset" @click="openChangePassword">
                    <v-list-item-title>Change Password</v-list-item-title>
                  </v-list-item>
                  <v-list-item prepend-icon="mdi-bell-ring" @click="openNotificationPreferences">
                    <v-list-item-title>Notification Preferences</v-list-item-title>
                  </v-list-item>
                  <v-list-item prepend-icon="mdi-shield-account" @click="openAccountPrivacy">
                    <v-list-item-title>Account Privacy</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue-lighten-1" text @click="showSettingsCard = false">Close</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <!-- Change Password Dialog -->
          <v-dialog v-model="showChangePasswordDialog" max-width="400">
            <v-card class="pa-4">
              <v-card-title>Change Password</v-card-title>
              <v-divider></v-divider>
              <v-card-text>
                <v-text-field v-model="currentPassword" label="Current Password" type="password" />
                <v-text-field
                    v-model="password"
                    :rules="passwordRules"
                    :type="showPassword1 ? 'text' : 'password'"
                    label="New Password"
                    :append-inner-icon="showPassword1 ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append-inner="togglePasswordVisibility1"
                  />

                  <v-text-field
                    v-model="passwordCon"
                    :rules="passwordConRules"
                    :type="showPassword2 ? 'text' : 'password'"
                    label="Password Confirmation"
                    :append-inner-icon="showPassword2 ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append-inner="togglePasswordVisibility2"
                  />
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text color="blue" @click="saveNewPassword">Save</v-btn>
                <v-btn text @click="showChangePasswordDialog = false">Cancel</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <!-- Notification Preferences Dialog -->
          <v-dialog v-model="showNotificationPreferencesDialog" max-width="500">
              <v-card class="pa-4">
                <v-card-title>Notification Preferences</v-card-title>
                <v-divider></v-divider>
                <v-card-text>
                  <v-switch
                    v-model="emailNotifications"
                    label="Email Notifications"
                    color="blue"
                    class="animated-switch"
                  />
                  <v-switch
                    v-model="smsNotifications"
                    label="SMS Notifications"
                    color="blue"
                    class="animated-switch"
                  />
                  <v-switch
                    v-model="appNotifications"
                    label="App Notifications"
                    color="blue"
                    class="animated-switch"
                  />
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn text color="blue" @click="saveNotificationPreferences">Save</v-btn>
                  <v-btn text @click="showNotificationPreferencesDialog = false">Cancel</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>

          <!-- Account Privacy Dialog -->
          <v-dialog v-model="showAccountPrivacyDialog" max-width="500">
            <v-card class="pa-4">
              <v-card-title>Account Privacy</v-card-title>
              <v-divider></v-divider>
              <v-card-text>
                <v-radio-group v-model="accountPrivacySetting">
                  <v-radio label="Public Profile" value="public"></v-radio>
                  <v-radio label="Private Profile" value="private"></v-radio>
                </v-radio-group>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text color="blue" @click="saveAccountPrivacy">Save</v-btn>
                <v-btn text @click="showAccountPrivacyDialog = false">Cancel</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

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
                  <v-text-field
                  v-model="orderDescription"
                  label="Order Description"
                  placeholder="Add special instruction"
                  outlined
                  dense
                  class="mx-2 mt-2"
                />

                 <v-btn class="ma-2" color="blue-lighten-4" text="View Receipt" variant="flat" @click="showReceiptDialog = true"></v-btn>

                  <v-dialog v-model="showReceiptDialog" max-width="400">
                    <v-card title="Receipt Summary">
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
                          <div v-if="orderDescription" class="mb-2">
  <strong>Order Description:</strong> {{ orderDescription }}
</div>

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
                        <v-btn text @click="placeOrder">PLACE ORDER</v-btn>
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
