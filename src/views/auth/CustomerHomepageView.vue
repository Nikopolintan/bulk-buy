<script setup>
import { ref, computed } from 'vue'
import { useOrderStore } from '@/stores/orders'
const orderStore = useOrderStore()

const drawer = ref(false)
const showReceiptDialog = ref(false)

const products = ref([
  { name: 'Rice 25kg', description: 'Premium jasmine rice', price: 1250, quantity: 1 },
  { name: 'Cooking Oil 1L', description: 'Vegetable oil', price: 150, quantity: 1 },
  { name: 'Detergent Powder', description: '2kg stain-fighter', price: 230, quantity: 1 },
  { name: 'Canned Tuna', description: '180g in oil', price: 45, quantity: 1 },
  { name: 'Coffee 3-in-1', description: '20 sachets', price: 90, quantity: 1 },
])

const orderedProducts = ref([])

function orderProduct(product) {
  const existing = orderedProducts.value.find((p) => p.name === product.name)
  if (!existing) {
    orderedProducts.value.push({
      ...product,
      price: product.price * product.quantity,
    })
  } else {
    alert(`${product.name} is already in your order list`)
  }
}

function cancelOrder(productName) {
  orderedProducts.value = orderedProducts.value.filter((p) => p.name !== productName)
}

function cancelAllOrders() {
  orderedProducts.value = []
}

const totalPrice = computed(() =>
  orderedProducts.value.reduce((sum, item) => sum + item.price, 0)
)

function placeOrder() {
  if (orderedProducts.value.length === 0) return

  orderStore.addOrder({
    customer: 'John Doe',
    address: '123 Sample St.',
    items: [...orderedProducts.value],
  })

  orderedProducts.value = []
  showReceiptDialog.value = false
}
</script>

<template>
  <v-card>
    <v-layout>
      <!-- Navigation Drawer -->
      <v-navigation-drawer v-model="drawer" location="right" temporary style="z-index: 2000">
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

      <v-main>
        <!-- Header -->
          <v-app-bar
            color="light-blue-lighten-3"
            flat
            height="70"
            elevation="2"
            app
          >
            <v-spacer></v-spacer>

            <v-btn icon size="medium" class="mx-5">
              <v-icon>mdi-message-text</v-icon>
            </v-btn>

            <v-btn icon size="medium" class="mx-5">
              <v-icon>mdi-bell</v-icon>
            </v-btn>

            <v-btn icon size="medium" class="mx-5 pe-3" @click.stop="drawer = !drawer">
              <v-icon>mdi-account</v-icon>
            </v-btn>
          </v-app-bar>

        <!-- Main Content -->
        <v-container fluid class="ma-4 mt-8">
          <!-- ORDER HISTORY BUTTON -->
          <v-row justify="end" class="mb-4 me-4">
            <v-col cols="auto">
              <v-btn
                color="blue-lighten-4"
                @click="$router.push({ name: 'OrderHistorypage' })"
              >
                Order History
              </v-btn>
            </v-col>
          </v-row>

          <v-row>
            <!-- Left Column: Order List -->
            <v-col cols="12" md="3">
              <v-card elevation="3">
                <v-card-title class="text-h6 text-center bg-light-blue-lighten-4">
                  My Orders
                </v-card-title>
                <v-divider></v-divider>

                <div
                  v-if="orderedProducts.length === 0"
                  class="text-center pa-4 grey--text text--darken-1"
                >
                  No orders yet
                </div>

                <v-list dense>
                  <v-list-item v-for="(ordered, index) in orderedProducts" :key="index">
                    <v-row no-gutters align="center" class="w-100">
                      <v-col cols="2" class="d-flex justify-start">
                        <v-btn icon size="x-small" @click="cancelOrder(ordered.name)">
                          <v-icon color="red" size="18">mdi-close</v-icon>
                        </v-btn>
                      </v-col>

                      <v-col cols="5">
                        <div class="font-weight-medium">{{ ordered.name }}</div>
                        <div class="text-caption">Qty: {{ ordered.quantity }}</div>
                      </v-col>

                      <v-col cols="4" class="d-flex justify-between">
                        <span class="pe-1">Price:</span>
                        <span class="font-weight-medium">₱{{ ordered.price }}</span>
                      </v-col>
                    </v-row>
                    <hr />
                  </v-list-item>
                </v-list>

                <v-divider class="my-2"></v-divider>
                <div class="text-right px-4 pb-2 font-weight-bold">TOTAL: ₱{{ totalPrice }}</div>

                <v-btn
                  class="ma-2"
                  color="blue-lighten-4"
                  text="View Receipt"
                  variant="flat"
                  @click="showReceiptDialog = true"
                ></v-btn>

                <v-dialog v-model="showReceiptDialog" max-width="500">
                  <v-card title="Receipt Summary">
                    <v-btn
                      icon
                      class="ml-auto"
                      color="light-blue-lighten-3"
                      style="position: absolute; top: 10px; right: 10px;"
                      @click="showReceiptDialog = false"
                    >
                      <v-icon>mdi-close</v-icon>
                    </v-btn>

                    <v-card-text>
                      <v-list dense>
                        <v-list-item v-for="(ordered, index) in orderedProducts" :key="index">
                          <v-row no-gutters align="center" class="w-100">
                            <v-col cols="8">
                              <div class="font-weight-medium">{{ ordered.name }}</div>
                              <div class="text-caption">Qty: {{ ordered.quantity }}</div>
                            </v-col>
                            <v-col cols="4" class="d-flex justify-end">
                              <span class="font-weight-medium">₱{{ ordered.price }}</span>
                            </v-col>
                          </v-row>
                        </v-list-item>
                      </v-list>
                      <v-divider class="my-2"></v-divider>
                      <div class="font-weight-bold text-right">TOTAL: ₱{{ totalPrice }}</div>
                    </v-card-text>

                    <v-card-actions>
                      <v-btn text @click="cancelAllOrders">Cancel All Orders</v-btn>
                      <v-btn text @click="placeOrder">PLACE ORDER</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-card>
            </v-col>

            <!-- Right Column: Product Grid -->
            <v-col cols="12" md="9">
              <v-row
                class="d-flex align-stretch"
                justify="start"
                no-gutters
              >
                <v-col
                  v-for="(product, index) in products"
                  :key="index"
                  cols="12"
                  sm="6"
                  md="4"
                  lg="3"
                  class="pa-2"
                >
                  <v-card class="pa-3 h-100 d-flex flex-column justify-space-between" elevation="5">
                    <div style="height: 100px; background-color: #f0f0f0"></div>

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
                    <v-card-actions class="d-flex justify-center">
                      <v-btn color="light-blue-lighten-1" @click="orderProduct(product)">
                        Order
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-container>
      </v-main>
    </v-layout>
  </v-card>
</template>
