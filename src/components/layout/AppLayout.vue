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


      <v-main class="bg-img">
        <v-container>
            <slot name="content"></slot>
        </v-container>
      </v-main>


    </v-app>
  </v-responsive>
</template>

<style scoped>
.bg-img{
background: url('/images/bg-img.png')no-repeat center center;
background-size: cover;

}

</style>
