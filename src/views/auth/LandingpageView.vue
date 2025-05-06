<script setup>
import { ref } from 'vue'

const drawer = ref(false)

const scrollToAbout = () => {
  const section = document.getElementById('about')
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' })
    drawer.value = false // Closes mobile drawer after clicking
  }
}
</script>

<template>
  <v-app>
    <!-- App Bar -->
    <v-app-bar flat class="px-4 px-md-10 transparent-navbar" color="blue-lighten-3">
      <v-img
        src="/images/BULKBUY logo.png"
        alt="BulkBuy Logo"
        max-height="60"
        max-width="60"
        class="mr-2"
        contain
      />

      <v-spacer></v-spacer>

      <!-- Desktop Navigation -->
      <template v-if="$vuetify.display.mdAndUp">
        <v-btn text class="mx-2 text-black" @click="scrollToAbout">About us</v-btn>
        <v-btn text class="mx-2 text-black">
          <RouterLink class="text-decoration-none text-black" to="/login">Login</RouterLink>
        </v-btn>
        <v-btn text class="mx-2 text-black">
          <RouterLink class="text-decoration-none text-black" to="/register">Sign-up</RouterLink>
        </v-btn>
      </template>

      <!-- Mobile Navigation Menu Button -->
      <template v-else>
        <v-btn icon @click="drawer = !drawer">
          <v-icon>mdi-menu</v-icon>
        </v-btn>
      </template>
    </v-app-bar>

    <!-- Navigation Drawer for Mobile -->
    <v-navigation-drawer v-model="drawer" temporary right location="right">
      <v-list>
        <v-list-item @click="scrollToAbout" title="About us"></v-list-item>
        <v-list-item>
          <RouterLink to="/login" class="text-decoration-none">Login</RouterLink>
        </v-list-item>
        <v-list-item>
          <RouterLink to="/register" class="text-decoration-none">Sign-up</RouterLink>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Main Content -->
    <v-main>
      <!-- Hero Section -->
      <v-container fluid class="hero-section fill-height d-flex align-center">
        <v-row class="d-flex align-center">
          <v-col cols="12" md="6">
            <h1 class="hero-heading text-white mb-4">
              BULK BUY is an online platform committed to transforming how Filipinos engage in
              community-based and bulk purchasing.
            </h1>
            <p class="hero-text text-white mb-6">
              We bridge small businesses and consumers for a smarter, more efficient buying
              experience. With technology-driven solutions, we aim to empower communities and uplift
              local economies.
            </p>
            <div class="d-flex flex-wrap gap-4">
              <v-img
                src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                max-width="150"
                contain
              />
              <v-img
                src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                max-width="150"
                contain
              />
              <v-img
                src="https://upload.wikimedia.org/wikipedia/commons/f/f1/Huawei_AppGallery_badge_EN.svg"
                max-width="150"
                contain
              />
            </div>
          </v-col>
        </v-row>
      </v-container>

      <!-- About Us Section -->
      <v-container id="about" fluid class="about-section py-12" style="background-color: #e3f2fd">
        <v-row align="center" justify="center">
          <v-col cols="12" md="5">
            <v-img
              src="/images/bao-bao.png"
              alt="Delivery Tricab"
              max-width="100%"
              contain
              class="rounded-lg elevation-3"
            />
          </v-col>
          <v-col cols="12" md="5">
            <h2 class="text-h5 text-md-h4 font-weight-bold mb-4">About Us</h2>
            <p class="text-body-1 mb-4">
              BULK BUY is committed to transforming how Filipinos engage in community-based and bulk
              purchasing. We bridge small businesses and consumers for a smarter, more efficient
              buying experience. With technology-driven solutions, we aim to empower communities and
              uplift local economies.
            </p>
            <p class="text-body-1">
              We also provide fast delivery of essential goods like rice, milk, shampoo, and
              more—redefining convenience for every Filipino home.
            </p>
          </v-col>
        </v-row>
      </v-container>
                  <!-- Persistent Footer -->
                  <v-footer app color="blue-lighten-4" class="text-center pa-3 mt-8">
                  <span class="text-caption">© {{ new Date().getFullYear() }} BulkBuy. All rights reserved.</span>
              </v-footer>
    </v-main>
  </v-app>
</template>

<style scoped>
.transparent-navbar {
  background-color: color-mix(in srgb, var(--accent-color), transparent 90%);
  backdrop-filter: blur(15px);
}

.hero-section {
  background-image: url('/images/lp-bg.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  padding-top: 120px;
  padding-bottom: 80px;
  min-height: 30vh;
}

.hero-heading {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.8);
}

.hero-text {
  font-weight: bold;
  margin-bottom: 1rem;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.8);
}
</style>
