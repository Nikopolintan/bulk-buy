<script setup>
import { useRouter } from 'vue-router'
import { ref, onMounted, computed } from 'vue'
import baoBaoBg from '/images/bao-bao.png'
import { supabase } from '@/utils/supabase'
import { useOrderStore } from '@/stores/orders'

const router = useRouter()
const orderStore = useOrderStore()

// Toggle for the drawer
const drawer = ref(false)

// User Profile Info
const fullName = ref('Customer')
const email = ref('N/A')
const phone = ref('N/A')
const address = ref('N/A')

async function fetchUserInfo() {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) {
    console.error('Error fetching user:', error.message)
    return
  }

  const metadata = user?.user_metadata || {}
  fullName.value = metadata.full_name || 'Customer'
  email.value = user?.email || 'N/A'
  phone.value = metadata.phone_num || 'N/A'
  address.value = metadata.address || 'N/A'
}

onMounted(() => {
  fetchUserInfo()
  fetchOrders()
})

function goToCustomerHomepage() {
  router.push('/customerhomepage')
}

const backgroundStyle = computed(() => ({
  backgroundImage: `url(${baoBaoBg})`,
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  backgroundAttachment: 'fixed',
  backgroundColor: 'rgba(0, 0, 255, 0.1)'
}))

// Order History Section
async function fetchOrders() {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching orders:', error.message)
    return
  }

  data.forEach(order => orderStore.addOrder(order))
}

// Settings Toggles and Dialogs
const showSettingsCard = ref(false)
const showChangePasswordDialog = ref(false)
const showNotificationPreferencesDialog = ref(false)
const showAccountPrivacyDialog = ref(false)
const showLogoutDialog = ref(false)

// Password Section
const currentPassword = ref('')
const password = ref('')
const passwordCon = ref('')
const showPassword1 = ref(false)
const showPassword2 = ref(false)

function togglePasswordVisibility1() {
  showPassword1.value = !showPassword1.value
}

function togglePasswordVisibility2() {
  showPassword2.value = !showPassword2.value
}

const passwordRules = [
  v => !!v || 'Password is required',
  v => v.length >= 6 || 'Password must be at least 6 characters',
]

const passwordConRules = [
  v => !!v || 'Password confirmation is required',
  v => v === password.value || 'Passwords do not match',
]

function saveNewPassword() {
  if (password.value !== passwordCon.value) {
    alert('Passwords do not match!')
    return
  }
  alert('Password updated successfully!')
  showChangePasswordDialog.value = false
}

// Notification Preferences
const emailNotifications = ref(true)
const smsNotifications = ref(false)
const appNotifications = ref(true)

function saveNotificationPreferences() {
  alert('Notification preferences saved!')
  showNotificationPreferencesDialog.value = false
}

// Privacy Settings
const accountPrivacySetting = ref('public')

function saveAccountPrivacy() {
  alert('Privacy setting saved!')
  showAccountPrivacyDialog.value = false
}

// Dialog Openers
function openSettings() {
  showSettingsCard.value = true
}
function openChangePassword() {
  showChangePasswordDialog.value = true
}
function openNotificationPreferences() {
  showNotificationPreferencesDialog.value = true
}
function openAccountPrivacy() {
  showAccountPrivacyDialog.value = true
}

// Logout
function logout() {
  showLogoutDialog.value = true
}
function confirmLogout() {
  router.push('/login')
  showLogoutDialog.value = false
}
function cancelLogout() {
  showLogoutDialog.value = false
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
            <v-list-item-title class="font-weight-bold" @click="openSettings">{{ fullName }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-divider></v-divider>

        <v-list nav>
          <v-list-item><v-list-item-title><strong>Email:</strong> {{ email }}</v-list-item-title></v-list-item>
          <v-list-item><v-list-item-title><strong>Phone:</strong> {{ phone }}</v-list-item-title></v-list-item>
          <v-list-item><v-list-item-title><strong>Address:</strong> {{ address }}</v-list-item-title></v-list-item>

          <v-divider class="my-2"></v-divider>

          <v-list-item prepend-icon="mdi-home" @click="goToCustomerHomepage">
            <v-list-item-title>Home</v-list-item-title>
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
        <!-- App Bar -->
        <v-app-bar color="light-blue-lighten-3" flat height="70" elevation="2" app>
          <v-spacer></v-spacer>
          <v-btn icon class="mx-5">
            <v-icon>mdi-bell</v-icon>
          </v-btn>
          <v-btn icon class="mx-5 pe-3" @click.stop="drawer = !drawer">
            <v-icon>mdi-account</v-icon>
          </v-btn>
        </v-app-bar>

        <!-- 🧾 Order History Section -->
        <v-container>
          <v-row v-if="orderStore.orders.length === 0">
            <v-col class="text-center">
              <p>No orders found.</p>
            </v-col>
          </v-row>

          <v-row v-else>
            <!-- Single Card to Display All Orders -->
            <v-col cols="12" class="d-flex justify-center">
              <v-card elevation="2" class="mx-auto" style="max-width: 900px; width: 100%;">
                <v-card-subtitle class="text-center">Order History</v-card-subtitle>
                <v-card-text>
                  <div v-for="(order, index) in orderStore.orders" :key="index" class="mb-4">
                    <div class="font-weight-bold">{{ order.customer }}</div>
                    <div v-for="(item, idx) in order.items" :key="idx" class="d-flex justify-space-between">
                      <div>{{ item.name }} - Qty: {{ item.quantity }}</div>
                      <div>₱{{ item.price }}</div>
                    </div>

                    <!-- Delivery Fee & Total -->
                    <v-row class="mt-4">
                      <v-col class="text-start font-weight-medium">Delivery Fee:</v-col>
                      <v-col class="text-end">₱{{ order.deliveryFee }}</v-col>
                    </v-row>
                    <v-row>
                      <v-col class="text-start font-weight-medium">Total:</v-col>
                      <v-col class="text-end font-weight-bold text-primary">₱{{ order.total }}</v-col>
                    </v-row>
                    <hr />
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>

        <!-- Logout Dialog -->
        <v-dialog v-model="showLogoutDialog" persistent>
          <v-card class="mx-auto">
            <v-card-title class="text-center">Are you sure you want to log out?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text color="blue-lighten-1" @click="cancelLogout">Cancel</v-btn>
              <v-btn text color="red" @click="confirmLogout">Log Out</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- Settings Dialog -->
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
              <v-btn text color="blue-lighten-1" @click="showSettingsCard = false">Close</v-btn>
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
              <v-switch v-model="emailNotifications" label="Email Notifications" color="blue" />
              <v-switch v-model="smsNotifications" label="SMS Notifications" color="blue" />
              <v-switch v-model="appNotifications" label="App Notifications" color="blue" />
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
                <v-radio label="Public Profile" value="public" />
                <v-radio label="Private Profile" value="private" />
              </v-radio-group>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text color="blue" @click="saveAccountPrivacy">Save</v-btn>
              <v-btn text @click="showAccountPrivacyDialog = false">Cancel</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-main>
    </v-layout>
  </v-card>
</template>

<style scoped>
.background-blur-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
}
</style>
