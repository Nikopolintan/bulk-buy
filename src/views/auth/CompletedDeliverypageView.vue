<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useOrderStore } from '@/stores/orders'
import baoBaoBg from '/images/bg-image.jpg'

// ===== Background Styling =====
const backgroundStyle = computed(() => ({
  backgroundImage: `url(${baoBaoBg})`,
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  backgroundAttachment: 'fixed',
  backgroundColor: 'rgba(0, 0, 255, 0.1)'
}))

const router = useRouter()
const orderStore = useOrderStore()
const completedOrders = computed(() => orderStore.completedOrders)

// Navigate back
const goToDriverMain = () => {
  router.push('/driverhomepage')
}
</script>


<template>
  <v-card>
    <v-layout>
      <v-container class="mt-6">
            <!-- Animated GIF Centered at Top -->
            <v-container class="top-gif-container" fluid>
            <img src="/images/animation.gif" alt="Top Animation" class="top-gif" />
          </v-container>
        <div :style="backgroundStyle" class="background-blur-wrapper"></div>
        <div class="content-wrapper">
          <!-- Header -->
          <v-app-bar color="light-blue-lighten-3" flat height="70" elevation="2" app>
            <v-btn icon @click="goToDriverMain">
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
            <v-toolbar-title>Tasks</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-app-bar>
          <v-row>
          <v-col cols="12">
            <v-card elevation="3" class="pa-4">
              <v-card-title class="text-h6">Completed Deliveries</v-card-title>

              <v-row v-for="(order, index) in completedOrders" :key="index" class="mb-4">
                <v-col cols="12">
                  <v-card outlined>
                    <v-card-title>
                      <div>
                        <div><strong>Customer:</strong> {{ order.customer }}</div>
                        <div class="text-caption grey--text">{{ order.address }}</div>
                        <div><strong>Status:</strong> {{ order.status }}</div>
                      </div>
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-card-text>
                      <v-list dense>
                        <v-list-item v-for="(item, i) in order.items" :key="i">
                          <v-list-item-content>
                            <v-list-item-title>
                              {{ item.name }} - Qty: {{ item.quantity }} (₱{{ item.price * item.quantity }})
                            </v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                      </v-list>
                      <div class="mt-2 text-right font-weight-bold">
                        Total: ₱{{ order.items.reduce((sum, item) => sum + item.price * item.quantity, 0) }}
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
        </div>

      </v-container>
    </v-layout>
  </v-card>
</template>

<style scoped>
html, body, #app {
  height: 100%;
  margin: 0;
  scroll-behavior: smooth;
}

.v-application {
  background: transparent !important;
}

.background-blur-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
}

.content-wrapper {
  position: relative;
  z-index: 1;
  padding-top: 70px;
  padding-bottom: 32px;
}

.page-content {
  padding-top: 16px;
}

.scrollable-main {
  height: 100vh;
  overflow-y: auto;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.top-gif-container {
  position: absolute;
  top: 40px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;
  width: 100%;
  display: flex;
  justify-content: center;
  padding-top: 10px;
  background: transparent;
}

.top-gif {
  max-width: 140px;
  height: auto;
  background: transparent;
}
</style>
