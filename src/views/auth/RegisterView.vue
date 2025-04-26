<script setup>
import { ref } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'

// Full Name
const fullnametName = ref('')
const fullnameNameRules = [
  (v) => !!v || 'Full name is required',
  (v) => v.length >= 3 || 'First name must be at least 3 characters',
]

// Email
const email = ref('')
const emailRules = [
  (v) => !!v || 'Email is required',
  (v) => /^\S+@\S+\.\S+$/.test(v) || 'Email must be valid',
]

// Phone Number
const phone = ref('')
const phoneRules = [
  (v) => !!v || 'Phone number is required',
  (v) => /^\d{11}$/.test(v) || 'Phone number must be 11 digits',
]

// Address
const address = ref('')
const addressRules = [
  (v) => !!v || 'Address is required',
  (v) => v.length >= 5 || 'Address must be at least 5 characters',
]

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
</script>

<template>
  <AppLayout>
    <template #content>
      <v-row class="my-auto fill-height">
        <v-col cols="12" md="6" class="mx-auto">
          <v-card class="mx-auto text-center border rounded-lg pa-4 scrollable-card" width="400" elevation="15">
            <v-card-title class="d-flex flex-column align-center">
              <v-img src="/images/BULKBUY logo.png" width="120" height="120"></v-img>
              <h4 class="font-weight-black">BULKBUY</h4>
              <small><i>bajaj and budget</i></small>
            </v-card-title>

            <v-card-text class="pt-2">
              <v-sheet class="mx-auto" width="300">
                <v-form fast-fail @submit.prevent>
                  <v-text-field v-model="fullnametName" :rules="fullnameNameRules" label="Full name" />

                  <v-text-field v-model="email" :rules="emailRules" label="Email" type="email" />

                  <v-text-field
                    v-model="phone"
                    :rules="phoneRules"
                    label="Phone Number"
                    type="tel"
                    maxlength="11"
                    @input="phone = phone.replace(/\D/g, '')"
                  />

                  <v-text-field
                    v-model="address"
                    :rules="addressRules"
                    label="Address"
                    type="text"
                  />

                  <v-text-field
                    v-model="password"
                    :rules="passwordRules"
                    :type="showPassword1 ? 'text' : 'password'"
                    label="Password"
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

                  <v-btn color="light-blue-lighten-3" class="mt-2" type="submit" block>
                    Register
                  </v-btn>
                </v-form>
              </v-sheet>
              <v-divider class="mt-3"></v-divider>
              <h5 class="mt-2">
                Already have an account?
                <RouterLink to="/login" class="text-primary">Click to Login</RouterLink>
              </h5>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </template>
  </AppLayout>
</template>

<style scoped>
body {
  font-family: 'Poppins', sans-serif;
}

.v-app-bar,
.v-card,
.v-card-text,
.v-btn {
  font-family: 'Poppins', sans-serif;
}

/* Make the card scrollable */
.scrollable-card {
  max-height: 90vh;
  overflow-y: auto;
}
</style>
