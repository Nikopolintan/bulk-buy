<script setup>
import { ref } from 'vue'

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

</template>
