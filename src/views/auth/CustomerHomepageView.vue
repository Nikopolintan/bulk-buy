<script setup>
  import { ref } from 'vue'

  const drawer = ref(null)

  const products = ref([
  { name: 'Rice 25kg', description: 'Premium jasmine rice', price: 1250, quantity: 1 },
  { name: 'Cooking Oil 1L', description: 'Vegetable oil', price: 150, quantity: 1 },
  { name: 'Detergent Powder', description: '2kg stain-fighter', price: 230, quantity: 1 },
  { name: 'Canned Tuna', description: '180g in oil', price: 45, quantity: 1 },
  { name: 'Coffee 3-in-1', description: '20 sachets', price: 90, quantity: 1 },
])

const orderedProducts = ref([])

function orderProduct(product) {
  // Check if already ordered
  const existing = orderedProducts.value.find(p => p.name === product.name)
  if (!existing) {
    orderedProducts.value.push({ ...product })
    alert(`Ordered ${product.quantity} of ${product.name}`)
  } else {
    alert(`${product.name} is already in your order list`)
  }
}

function cancelOrder(productName) {
  orderedProducts.value = orderedProducts.value.filter(p => p.name !== productName)
}

</script>

<template>
  <v-card > <!-- margin on all sides -->
    <v-layout>

      <!-- Navigation Drawer -->
      <v-navigation-drawer
        v-model="drawer"
        location="right"
        temporary
      >
        <v-list-item
          prepend-avatar="https://randomuser.me/api/portraits/men/78.jpg"
          title="John Leider"
        ></v-list-item>

        <v-divider></v-divider>

        <v-list nav>
          <v-list-item prepend-icon="mdi-view-dashboard" title="Home" value="home"></v-list-item>
          <v-list-item prepend-icon="mdi-forum" title="About" value="about"></v-list-item>
        </v-list>
      </v-navigation-drawer>

      <!-- Header Bar with Icons -->
      <v-main>
        <v-sheet color="light-blue-lighten-3" height="70" class="d-flex justify-end align-center px-6" elevation="2">
          <v-btn icon size="x-small" class="mx-2">
            <v-icon>mdi-message-text</v-icon>
          </v-btn>

          <v-btn icon size="x-small" class="mx-2">
            <v-icon>mdi-bell</v-icon>
          </v-btn>

          <v-btn icon size="x-small" class="mx-2" @click.stop="drawer = !drawer">
            <v-icon>mdi-account</v-icon>
          </v-btn>
        </v-sheet>
      </v-main>

    </v-layout>
      </v-card>
      <v-container class="ma-4 mt-8">
        <v-row>

          <!-- Left Column: Order List -->
          <v-col cols="12" md="3">
            <v-card elevation="3">
              <v-card-title class="text-h6">My Orders</v-card-title>
              <v-divider></v-divider>
              <v-list dense>
                <v-list-item
                  v-for="(ordered, index) in orderedProducts"
                  :key="index"
                >
                  <v-list-item-content>
                    <v-list-item-title>{{ ordered.name }}</v-list-item-title>
                    <v-list-item-subtitle>Qty: {{ ordered.quantity }}</v-list-item-subtitle>
                  </v-list-item-content>
                  <v-btn icon @click="cancelOrder(ordered.name)">
                    <v-icon color="red">mdi-close</v-icon>
                  </v-btn>
                </v-list-item>
              </v-list>
              <div v-if="orderedProducts.length === 0" class="text-center pa-4 grey--text text--darken-1">
                No orders yet
              </div>
            </v-card>
          </v-col>

          <!-- Right Column: Product Grid -->
          <v-col cols="12" md="9">
            <v-row justify="center" align="start" class="g-4">
              <v-col
                v-for="(product, index) in products"
                :key="index"
                cols="12"
                sm="6"
                md="4"
                lg="3"
                class="d-flex justify-center"
              >
                <v-card class="pa-3" elevation="5" style="width: 90%;"> <!-- smaller card -->
                  <div style="height: 100px; background-color: #f0f0f0;"></div> <!-- slightly shorter image -->

                  <v-card-title class="text-h6">{{ product.name }}</v-card-title>
                  <v-card-subtitle>{{ product.description }}</v-card-subtitle>
                  <v-card-text>
                    <div><strong>Price:</strong> ₱{{ product.price }}</div>
                    <v-text-field
                      v-model="product.quantity"
                      type="number"
                      label="Qty"
                      min="1"
                      class="mt-2"
                      dense
                      hide-details
                    ></v-text-field>
                  </v-card-text>
                  <v-card-actions>
                    <v-btn color="success" @click="orderProduct(product)">Order</v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
          </v-col>

        </v-row>
      </v-container>

</template>
