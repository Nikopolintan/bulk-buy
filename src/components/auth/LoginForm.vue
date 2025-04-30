<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { requiredValidator, emailValidator } from '@/utils/validators'

const router = useRouter()
const form = ref(null)
const showPassword = ref(false)

function togglePasswordVisibility() {
  showPassword.value = !showPassword.value
}

const formDataDefault = {
  email: '',
  password: '',
}

const formData = ref({
  ...formDataDefault
})

const onSubmit = () => {
  //conditions for supabase
}


async function login(role) {
  const isValid = await form.value.validate()
  if (!isValid.valid) {
    return // Don't navigate if not valid
  }

  onSubmit()

  if (role === 'customer') {
    router.push('/customerhomepage')
  } else if (role === 'driver') {
    router.push('/driverhomepage')
  }
}
</script>

<template>

<v-form ref="form" @submit.prevent="login">
                <!-- Email Field -->
                <v-text-field
                  v-model="formData.email"
                  :rules="[requiredValidator, emailValidator]"
                  label="Email"
                  prepend-inner-icon="mdi-email"
                  required
                ></v-text-field>

                <!-- Password Field -->
                <v-text-field
                  v-model="formData.password"
                  :type="showPassword ? 'text' : 'password'"
                  :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append-inner="togglePasswordVisibility"
                  :rules="[requiredValidator]"
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
                        type="submit"
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
                        type="submit"
                        @click="login('driver')"
                      >
                        Driver
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-container>
              </v-form>

</template>
