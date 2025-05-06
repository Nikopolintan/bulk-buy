<script setup>
import { computed } from 'vue'
import { useOrderStore } from '@/stores/orders'

const orderStore = useOrderStore()
const completedOrders = computed(() => orderStore.completedOrders)
</script>


<template>
  <v-card>
    <v-layout>
      <v-container class="mt-6">
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
      </v-container>
                  <!-- Persistent Footer -->
                  <v-footer app color="blue-lighten-4" class="text-center pa-3 mt-8">
                  <span class="text-caption">© {{ new Date().getFullYear() }} BulkBuy. All rights reserved.</span>
              </v-footer>
    </v-layout>
  </v-card>
</template>
