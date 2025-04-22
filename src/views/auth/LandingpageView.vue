<template>
  <v-app>
    <!-- Transparent Navbar -->
    <v-app-bar color="transparent light-blue-lighten-4" class="px-10">

    <v-img
      src="/images/BULKBUY logo.png"
      alt="BulkBuy Logo"
      max-height="60"
      max-width="60"
      class="mr-2"
      contain
    />
    
  <v-spacer></v-spacer>

      <v-btn text class="mx-2 text-black">Home</v-btn>
      <v-btn text class="mx-2 text-black">About us</v-btn>
      <v-btn text class="mx-2 text-black"><RouterLink class="text-decoration-none text-black" to="/login">Login</RouterLink></v-btn>
      <v-btn text class="mx-2 text-black"><RouterLink class="text-decoration-none text-black" to="/register">Sign-up</RouterLink></v-btn>
    </v-app-bar>

    <!-- Hero Section -->
    <v-main>
      <v-container fluid class="hero-section fill-height d-flex align-center">
        <v-row class="d-flex align-center">
          <!-- Text Content -->
          <v-col cols="12" md="6">
            <h1 class="text-h4 font-weight-bold mb-4 text-blue-lighten-2">
              BULK BUY an online platform committed to transforming how Filipinos  <br />
              engage in community-based and bulk purchasing.
            </h1>
            <p class="text-body-1 mb-6">

              We bridge small businesses and consumers for a smarter, more efficient buying experience.
              With technology-driven solutions, we aim to empower communities and uplift local economies.
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

       <!-- About Section -->
       <v-container fluid class="about-section">
        <v-row class="justify-center">
          <v-col cols="12" md="8" class="text-center">
            <h2 class="text-h4 font-weight-bold mb-4">About Us</h2>
            <p class="text-body-1">
              BULK BUY is committed to transforming how Filipinos engage in community-based and bulk purchasing.
              We bridge small businesses and consumers for a smarter, more efficient buying experience.
              With technology-driven solutions, we aim to empower communities and uplift local economies.
            </p>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>

// No logic needed for static landing page
</script>

<style scoped>


.hero-section {
  background-image: url('/images/lp-bg.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  padding-top: 120px;
  padding-bottom: 80px;
  min-height: 100vh;
}

</style>
