<script setup>
import { ref } from 'vue'

const showSettingsCard = ref(false)

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

</script>

<template>

<v-list-item prepend-icon="mdi-cogs" @click="openSettings">
            <v-list-item-title>Settings</v-list-item-title>
          </v-list-item>

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
                <v-text-field v-model="newPassword" label="New Password" type="password" />
                <v-text-field v-model="confirmNewPassword" label="Confirm New Password" type="password" />
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
</template>
