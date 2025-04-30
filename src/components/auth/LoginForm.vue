<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const form = ref(null)
const router = useRouter()

const emailRules = [(v) => !!v || 'Email is required']
const passwordRules = [(v) => !!v || 'Password is required']

function togglePasswordVisibility() {
  showPassword.value = !showPassword.value
}

async function login(role) {
  const isValid = await form.value.validate()
  if (!isValid.valid) {
    return // Don't navigate if not valid
  }

  if (role === 'customer') {
    router.push('/customerhomepage')
  } else if (role === 'driver') {
    router.push('/driverhomepage')
  }
}
</script>

<template>

<v-form ref="form" fast-fail @submit.prevent="login">
                <!-- Email Field -->
                <v-text-field
                  v-model="email"
                  type="email"
                  :rules="emailRules"
                  label="Email"
                  prepend-inner-icon="mdi-email"
                  required
                ></v-text-field>

                <!-- Password Field -->
                <v-text-field
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append-inner="togglePasswordVisibility"
                  :rules="passwordRules"
                  label="Password"
                  prepend-inner-icon="mdi-lock"
                  required
                ></v-text-field>

                <v-container>
                  <p class="pb-3">Login as</p>
                  <v-row justify="center" align="center" no-gutters class="flex-nowrap">
                    <v-col cols="auto">
                      <v-btn
                        height="40"
                        min-width="110"
                        class="mx-2"
                        color="light-blue-lighten-3"
                        @click="login('customer')"
                        block
                      >
                        Customer
                      </v-btn>
                    </v-col>

                    <v-col cols="auto">
                      <v-btn
                        height="40"
                        min-width="110"
                        class="mx-2"
                        color="light-blue-lighten-3"
                        @click="login('driver')"
                      >
                        Driver
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-container>
              </v-form>

</template>
