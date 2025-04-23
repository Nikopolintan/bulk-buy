<script setup>
  import { ref } from 'vue'

  const drawer = ref(null)

// Simulated orders from customers
const orders = ref([
  {
    customer: 'Maria Santos',
    address: 'Blk 12 Lot 3, Zone 5, Brgy. Mabini',
    items: [
      { name: 'Rice 25kg', quantity: 1, price: 1250 },
      { name: 'Canned Tuna', quantity: 3, price: 45 },
    ]
  },
  {
    customer: 'Juan Dela Cruz',
    address: 'Purok 3, Brgy. Maligaya',
    items: [
      { name: 'Coffee 3-in-1', quantity: 2, price: 90 },
      { name: 'Detergent Powder', quantity: 1, price: 230 },
    ]
  }
])

</script>

<template>
  <v-card>
    <v-layout>

      <!-- Navigation Drawer -->
      <v-navigation-drawer v-model="drawer" location="right" temporary>
        <v-list-item
          prepend-avatar="https://randomuser.me/api/portraits/men/78.jpg"
          title="Rider Profile"
        ></v-list-item>

        <v-divider></v-divider>

        <v-list nav>
          <v-list-item prepend-icon="mdi-view-dashboard" title="Home" value="home"></v-list-item>
          <v-list-item prepend-icon="mdi-forum" title="About" value="about"></v-list-item>
        </v-list>
      </v-navigation-drawer>

      <!-- Header Bar -->
      <v-main>
        <v-sheet
          color="light-blue-lighten-3"
          height="70"
          class="d-flex justify-end align-center px-6"
          elevation="2"
        >
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

        <!-- Order Summary -->
        <v-container class="mt-6">
          <v-row>
            <v-col cols="12">
              <v-card elevation="3" class="pa-4">
                <v-card-title class="text-h6 mb-4">Customer Orders</v-card-title>

                <v-row v-for="(order, index) in orders" :key="index" class="mb-4">
                  <v-col cols="12">
                    <v-card outlined>
                      <v-card-title>
                        <div>
                          <div><strong>Customer:</strong> {{ order.customer }}</div>
                          <div class="text-caption grey--text">{{ order.address }}</div>
                        </div>
                      </v-card-title>
                      <v-divider></v-divider>
                      <v-card-text>
                        <v-list dense>
                          <v-list-item
                            v-for="(item, i) in order.items"
                            :key="i"
                          >
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
                      <v-card-actions>
                        <v-btn color="primary" text>Accept Task</v-btn>
                        <v-btn color="success" text>Mark as Delivered</v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-col>
                </v-row>

              </v-card>
            </v-col>
          </v-row>
        </v-container>

      </v-main>
    </v-layout>
  </v-card>

</template>
