<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { requiredValidator, emailValidator } from '@/utils/validators'
import { supabase, formActionDefault } from '@/utils/supabase.js'

const router = useRouter()
const form = ref(null)
const showPassword = ref(false)

const formDataDefault = {
  email: '',
  password: '',
}
const formData = ref({ ...formDataDefault })
const formAction = ref({ ...formActionDefault })

function togglePasswordVisibility() {
  showPassword.value = !showPassword.value
}

const onSubmit = async (role) => {
  formAction.value = { ...formActionDefault }
  formAction.value.formProcess = true

  const { data, error } = await supabase.auth.signInWithPassword({
    email: formData.value.email,
    password: formData.value.password,
  })

  if (error) {
    formAction.value.formErrorMessage = error.message
    formAction.value.formProcess = false
    return
  }

  const userRole = data.user.user_metadata?.role
  if (userRole?.toLowerCase() !== role.toLowerCase()) {
    formAction.value.formErrorMessage = `You are not registered as a ${role}`
    formAction.value.formProcess = false
    return
  }

  formAction.value.formSuccessMessage = `Welcome ${role}!`
  formAction.value.formProcess = false

  if (role.toLowerCase() === 'customer') {
    router.replace('/customerhomepage')
  } else {
    router.replace('/driverhomepage')
  }
}

function login(role) {
  form.value?.validate().then(({ valid }) => {
    if (valid) onSubmit(role)
  })
}
</script>

<template>
  <v-alert
    v-if="formAction.formSuccessMessage"
    :text="formAction.formSuccessMessage"
    title="Success!"
    type="success"
    variant="tonal"
    class="mb-2"
    closable
  />

  <v-alert
    v-if="formAction.formErrorMessage"
    :text="formAction.formErrorMessage"
    title="Oops!"
    type="error"
    variant="tonal"
    class="mb-2"
    closable
  />

  <v-form ref="form">
    <v-text-field
      v-model="formData.email"
      :rules="[requiredValidator, emailValidator]"
      label="Email"
      prepend-inner-icon="mdi-email"
    />

    <v-text-field
      v-model="formData.password"
      :type="showPassword ? 'text' : 'password'"
      :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
      @click:append-inner="togglePasswordVisibility"
      :rules="[requiredValidator]"
      label="Password"
      prepend-inner-icon="mdi-lock"
    />

    <v-container>
      <p class="pb-3">Login as</p>
      <v-row justify="center" align="center" no-gutters class="flex-nowrap">
        <v-col cols="auto">
          <v-btn
            height="40"
            min-width="110"
            class="mx-2"
            color="light-blue-lighten-3"
            @click.prevent="login('Customer')"
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
            @click.prevent="login('Driver')"
          >
            Driver
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>
