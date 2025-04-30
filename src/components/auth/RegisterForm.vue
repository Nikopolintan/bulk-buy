<script setup>
import { ref } from 'vue'
import { requiredValidator, emailValidator, passwordValidator, confirmedValidator } from '@/utils/validators'
import { supabase, formActionDefault } from '@/utils/supabase.js'

const refVForm = ref()

const formDataDefault = {
  full_name: '',
  email: '',
  phone_num: '',
  address: '',
  password: '',
  password_confirmation: '',
}

const formData = ref({
  ...formDataDefault
})

const onSubmit = () => {
 //conditions for supabase
//  alert(formData.value.email)
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
  (v) => /^09\d{9}$/.test(v) || 'Enter a valid Philippine phone number (e.g., 09123456789)'
]
</script>


<template>

<v-form ref="refVForm" @submit.prevent="onFormSubmit">
                  <v-text-field v-model="formData.full_name" :rules="[requiredValidator]" label="Full name" />

                  <v-text-field v-model="formData.email" :rules="[requiredValidator, emailValidator]" label="Email" type="email" />

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
                    :rules="[requiredValidator, confirmedValidator(formData.password_confirmation, formData.password)]"
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
