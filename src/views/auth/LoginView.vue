<script setup>
import { ref } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'

// Models
const username = ref('')
const password = ref('')
const showPassword = ref(false)

// Validation rules
const usernameRules = [(v) => !!v || 'Username is required']
const passwordRules = [(v) => !!v || 'Password is required']

// Toggle function
function togglePasswordVisibility() {
  showPassword.value = !showPassword.value
}
</script>

<template>
  <AppLayout>
    <template #content>
      <v-row class="my-auto">
        <v-col cols="12" class="mx-auto">
          <v-card class="mx-auto text-center border rounded-lg pa-4" width="400" elevation="15">
            <v-card-title class="d-flex flex-column align-center">
              <v-img src="/images/BULKBUY logo.png" width="120" height="120"></v-img>
              <h4 class="font-weight-black">BULKBUY</h4>
              <small><i>bajaj and budget</i></small>
              <!-- Login Buttons -->
              <div class="d-flex justify-center gap-2 mt-1">
                <a
                  href="https://accounts.google.com/v3/signin/identifier?continue=https%3A%2F%2Fmail.google.com%2Fmail%2Fu%2F0%2F&emr=1&followup=https%3A%2F%2Fmail.google.com%2Fmail%2Fu%2F0%2F&ifkv=AXH0vVv1aZquQkKy1DvX7LazCQyITaqv1whhreqNO1DziAMumtmDbQiIkIjKri3LtaMcLKfSgMy6&osid=1&passive=1209600&service=mail&flowName=GlifWebSignIn&flowEntry=ServiceLogin&dsh=S1259117950%3A1744073433066288"
                  target="_blank"
                >
                  <v-img src="/images/googlelogo.png" width="50" height="50"></v-img>
                </a>

                <a class="mt-2" href="https://web.facebook.com/?_rdc=1&_rdr#" target="_blank">
                  <v-img src="/images/fblogo.png" width="35" height="35" class="mx-2"></v-img>
                </a>
              </div>
              <small>——————— or ———————
              </small>
            </v-card-title>

            <v-card-text class="pt-2">
              <v-sheet class="mx-auto" width="300">
                <v-form fast-fail @submit.prevent>
                  <!-- Username Field -->
                  <v-text-field
                    v-model="username"
                    :rules="usernameRules"
                    label="Username"
                    prepend-inner-icon="mdi-account"
                    required
                  ></v-text-field>

                  <!-- Password Field with Eye Toggle -->
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

                  <!-- Submit Button -->
                  <v-container>
                    <p class="pb-3"> Login as </p>
                    <v-row justify="center" align="center" no-gutters class="flex-nowrap">
                      <v-col cols="auto">
                        <v-btn
                          height="40"
                          min-width="110"
                          class="mx-2"
                          color="light-blue-lighten-3"
                          to="/customerhomepage"
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
                          to="/driverhomepage"
                        >
                          Driver
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-form>
              </v-sheet>
              <v-divider class="mt-3"></v-divider>
              <h5 class="mt-2">
                Don't have an account?
                <RouterLink class="text-primary" to="/register">Click to Register</RouterLink>
              </h5>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </template>
  </AppLayout>
</template>

<style scoped>
/* Apply Poppins font*/
body {
  font-family: 'Poppins', sans-serif;
}

.v-app-bar,
.v-card,
.v-card-text,
.v-btn {
  font-family: 'Poppins', sans-serif; /* Ensures components use Poppins */
}
</style>
