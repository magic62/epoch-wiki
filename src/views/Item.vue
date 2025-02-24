<template>
  <div class="flex flex-col items-center justify-center">
    <h1 class="text-2xl font-bold mb-4">{{ item.name }}</h1>
    <img :src="iconUrl" :alt="item.name" v-if="iconUrl" class="mb-4" />
    <p v-if="auction" class="text-lg">Price: <span v-html="formattedPrice"></span></p>
    <p v-if="auction" class="text-lg">Quantity: {{ auction.quantity }}</p>
    <button @click="$router.push('/database')" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded">Database</button>
  </div>
</template>

<script>
import { fetchItemByEntry, fetchAuctionByEntry } from '../utils/api';
import { getIcon, formatPrice } from '../utils/item';

export default {
  data() {
    return {
      item: {},
      iconUrl: '',
      auction: null,
      formattedPrice: '',
    };
  },
  async created() {
    const entry = this.$route.params.entry;
    this.item = await fetchItemByEntry(entry);
    this.iconUrl = getIcon(this.item.icon);
    this.auction = await fetchAuctionByEntry(entry);
    if (this.auction) {
      this.formattedPrice = formatPrice(this.auction.price);
    }
  },
};
</script>