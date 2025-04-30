<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import RegisterForm from '@/components/auth/RegisterForm.vue'

</script>

<template>
  <AppLayout>
    <template #content>
      <v-row class="my-auto fill-height">
        <v-col cols="12" md="6" class="mx-auto">
          <v-card class="mx-auto text-center border rounded-lg pa-4" width="400" elevation="15">
            <v-card-title class="d-flex flex-column align-center">
              <v-img src="/images/BULKBUY logo.png" width="120" height="120"></v-img>
              <h4 class="font-weight-black">BULKBUY</h4>
              <small><i>bajaj and budget</i></small>
            </v-card-title>

            <v-card-text class="pt-2">
              <v-sheet class="mx-auto" width="300">

              <RegisterForm></RegisterForm>

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
