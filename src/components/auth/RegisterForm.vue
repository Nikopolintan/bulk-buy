<script setup>
import { ref } from 'vue'
import {
  requiredValidator,
  emailValidator,
  passwordValidator,
  confirmedValidator,
} from '@/utils/validators'
import AlertNotification from '@/components/common/AlertNotification.vue'
import { supabase, formActionDefault } from '@/utils/supabase.js'

const refVForm = ref()

const formDataDefault = {
  full_name: '',
  email: '',
  phone_num: '',
  address: '',
  password: '',
  password_confirmation: '',
  role: '', // NEW
}

const formData = ref({
  ...formDataDefault,
})

const formAction = ref({
  ...formActionDefault,
})

const onSubmit = async () => {
  formAction.value = { ...formActionDefault }
  formAction.value.formProcess = true

  //conditions for supabase
  const { data, error } = await supabase.auth.signUp({
    email: formData.value.email,
    password: formData.value.password,
    options: {
      data: {
        full_name: formData.value.full_name,
        address: formData.value.address,
        phone_num: formData.value.phone_num,
        role: formData.value.role,
      },
    },
  })

  if (error) {
    console.log(error)
    formAction.value.formErrorMessage = error.message
    formAction.value.formStatus = error.status
  } else if (data) {
    console.log(data)
    formAction.value.formSuccessMessage = 'Successfully Registered'
    // you can add here more action if you want
  }
  refVForm.value?.reset()
  formAction.value.formProcess = false
}

const onFormSubmit = () => {
  refVForm.value?.validate().then(({ valid }) => {
    if (valid) onSubmit()
  })
}

// Toggle functions
const showPassword1 = ref(false)
const showPassword2 = ref(false)

function togglePasswordVisibility1() {
  showPassword1.value = !showPassword1.value
}
function togglePasswordVisibility2() {
  showPassword2.value = !showPassword2.value
}

const phoneRules = [
  (v) => !!v || 'Phone number is required',
  (v) => /^09\d{9}$/.test(v) || 'Enter a valid Philippine phone number (e.g., 09123456789)',
]
</script>

<template>
  <AlertNotification
    :form-success-message="formAction.formSuccessMessage"
    :form-error-message="formAction.formErrorMessage"
  ></AlertNotification>

  <v-form class="mt-5" ref="refVForm" @submit.prevent="onFormSubmit">
    <v-text-field v-model="formData.full_name" :rules="[requiredValidator]" label="Full name" />

    <v-text-field
      v-model="formData.email"
      :rules="[requiredValidator, emailValidator]"
      label="Email"
      type="email"
    />

    <v-text-field
      v-model="formData.phone_num"
      :rules="phoneRules"
      label="Phone Number"
      type="tel"
      maxlength="11"
      @input="formData.phone_num = formData.phone_num.replace(/\D/g, '')"
    />

    <v-text-field
      v-model="formData.address"
      :rules="[requiredValidator]"
      label="Address"
      type="text"
    />

    <v-text-field
      v-model="formData.password"
      :rules="[requiredValidator, passwordValidator]"
      :type="showPassword1 ? 'text' : 'password'"
      label="Password"
      :append-inner-icon="showPassword1 ? 'mdi-eye' : 'mdi-eye-off'"
      @click:append-inner="togglePasswordVisibility1"
    />

    <v-text-field
      v-model="formData.password_confirmation"
      :rules="[
        requiredValidator,
        confirmedValidator(formData.password_confirmation, formData.password),
      ]"
      :type="showPassword2 ? 'text' : 'password'"
      label="Password Confirmation"
      :append-inner-icon="showPassword2 ? 'mdi-eye' : 'mdi-eye-off'"
      @click:append-inner="togglePasswordVisibility2"
    />

    <v-select
      v-model="formData.role"
      :items="['Customer', 'Driver']"
      label="Register as"
      :rules="[requiredValidator]"
      item-title="Role"
      item-value="Role"
    />

    <v-btn
      color="light-blue-lighten-3"
      class="mt-2"
      type="submit"
      :disabled="formAction.formProcess"
      :loading="formAction.formProcess"
      block
    >
      Register
    </v-btn>
  </v-form>
</template>
