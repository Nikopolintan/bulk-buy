<script setup>
import { ref } from 'vue'

const theme = ref('light')

function onClick() {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}

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
  <v-responsive class="border rounded">
    <v-app  :theme="theme">
      <v-app-bar color="light-blue-lighten-4" class="px-3">
        <v-spacer></v-spacer>

        <v-btn
          :prepend-icon="theme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'"
          slim
          @click="onClick"
        ></v-btn>
      </v-app-bar>

      <v-main>
        <v-container>
          <v-row class="my-auto">
            <v-col cols="12" md="6" class="mx-auto">
              <v-card
                class="mx-auto text-center"
                subtitle="less hassle on bulkbuying"
                width="400"
                >
                <template v-slot:title>
                  <span class="font-weight-black">BULKBUY</span>
                </template>

                <v-card-text class="pt-4">
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
                        <v-btn color="light-blue-lighten-3" class="mt-2" type="submit" block>Login</v-btn>
                      </v-form>
                    </v-sheet>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-main>

      <v-footer color="light-blue-lighten-5" border app> Copyright @2025</v-footer>

    </v-app>
  </v-responsive>
</template>
