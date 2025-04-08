<script setup>
import { ref } from 'vue'

const theme = ref('light')

function onClick() {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
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
            <slot name="content"></slot>
        </v-container>
      </v-main>

      <v-footer color="light-blue-lighten-5" border app> Copyright @2025</v-footer>

    </v-app>
  </v-responsive>
</template>

