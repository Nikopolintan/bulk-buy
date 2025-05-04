<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/utils/supabase'

const showLogoutDialog = ref(false)
const router = useRouter()

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

<v-list-item prepend-icon="mdi-logout" @click="logout">
            <v-list-item-title>Log Out</v-list-item-title>
          </v-list-item>

          <!-- LOGOUT CONFIRMATION DIALOG -->
          <v-dialog v-model="showLogoutDialog" max-width="400" persistent>
              <v-card class="pa-4">
                <v-card-title class="text-center">
                  Are you sure you want to log out?
                </v-card-title>
                <v-card-actions>
                  <v-btn color="blue-lighten-1" text @click="cancelLogout">Cancel</v-btn>
                  <v-btn color="red" text @click="confirmLogout">Log Out</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>

</template>
