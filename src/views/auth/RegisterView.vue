<script setup>
import { ref } from 'vue'

const theme = ref('light')

function onClick() {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}

const firstName = ref('')
  const firstNameRules = [
    value => {
      if (value?.length >= 3) return true
      return 'First name must be at least 3 characters.'
    },
  ]

  const lastName = ref('123')
  const lastNameRules = [
    value => {
      if (/[^0-9]/.test(value)) return true
      return 'Last name can not contain digits.'
    },
  ]


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
                      <v-text-field
                        v-model="firstName"
                        :rules="firstNameRules"
                        label="First name"
                      ></v-text-field>

                      <v-text-field
                        v-model="lastName"
                        :rules="lastNameRules"
                        label="Last name"
                      ></v-text-field>

                      <v-btn class="mt-2" type="submit" block>Submit</v-btn>
                    </v-form>
                  </v-sheet>
                    <v-divider class="my-5"></v-divider>
                    <h5>Already have an account? <RouterLink to="/login">Click to Login</RouterLink></h5>
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

<style scoped>
/* Apply Poppins font */
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
