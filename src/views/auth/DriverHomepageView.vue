<script setup>
import { ref, computed, onMounted } from 'vue'
import { useOrderStore } from '@/stores/orders'
import { useRouter } from 'vue-router'
import { supabase } from '@/utils/supabase' // Adjust if your Supabase client path differs

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
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) {
    console.error('Error fetching user:', error.message)
    return
  }

  const metadata = user?.user_metadata
  fullName.value = metadata?.full_name || 'Driver'
  email.value = user?.email || 'N/A'
  phone.value = metadata?.phone_num || 'N/A'
  address.value = metadata?.address || 'N/A'
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
  router.push({ name: 'CompletedDeliverypage' })
}

// ========== Profile Settings ==========
const showSettingsCard = ref(false)
const showLogoutDialog = ref(false)

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

// ========== Password Validation ==========
const password = ref('')
const passwordRules = [
  v => !!v || 'Password is required',
  v => v.length >= 6 || 'Password must be at least 6 characters',
]

const passwordCon = ref('')
const passwordConRules = [
  v => !!v || 'Password confirmation is required',
  v => v === password.value || 'Passwords do not match',
]

const showPassword1 = ref(false)
function togglePasswordVisibility1() {
  showPassword1.value = !showPassword1.value
}

const showPassword2 = ref(false)
function togglePasswordVisibility2() {
  showPassword2.value = !showPassword2.value
}

// ========== Logout ==========
function logout() {
  showLogoutDialog.value = true
}

async function confirmLogout() {
  const { error } = await supabase.auth.signOut()
  if (error) {
    console.error('Error logging out:', error.message)
    alert('Failed to log out. Please try again.')
    return
  }

  showLogoutDialog.value = false
  router.replace('/')
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
            <v-list-item-title class="font-weight-bold">{{ fullName }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-divider></v-divider>

        <v-list nav>
          <v-list-item><v-list-item-title><strong>Email:</strong> {{ email }}</v-list-item-title></v-list-item>
          <v-list-item><v-list-item-title><strong>Phone Number:</strong> {{ phone }}</v-list-item-title></v-list-item>
          <v-list-item><v-list-item-title><strong>Address:</strong> {{ address }}</v-list-item-title></v-list-item>

          <v-divider></v-divider>
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
