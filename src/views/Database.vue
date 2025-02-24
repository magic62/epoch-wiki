<template>
  <div class="p-4 w-full md:w-3/4 mx-auto flex flex-col md:mt-4">
    <h1 class="mx-auto text-4xl pb-4 mb-2 md:mb-4">Database</h1>
    <input v-model="searchQuery" placeholder="Search items..." class="w-full p-2 mb-4 border rounded text-2xl" />
    <ul class="space-y-2">
      <li v-for="item in paginatedItems" :key="item.entry" class="p-1 border rounded hover:bg-gray-100 flex items-center">
        <a :href="`/items/${item.entry}`" class="flex items-center w-full">
          <img :src="`/src/assets/icons/${item.icon}.png`" alt="" class="w-12 h-12 mr-2" />
          <span class="text-black text-2xl">{{ item.name }}</span>
          <span class="text-gray-600 ml-auto" v-html="getPrice(item.entry)"></span>
        </a>
      </li>
    </ul>
    <div class="flex justify-between items-center mt-4 text-xl">
      <button @click="prevPage" :disabled="currentPage === 1" class="px-4 py-2 bg-gray-300 rounded disabled:opacity-50">
        Previous
      </button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages" class="px-4 py-2 bg-gray-300 rounded disabled:opacity-50">
        Next
      </button>
    </div>
  </div>
</template>

<script>
import { fetchItems, fetchAuctions } from '../utils/api';
import { getIcon, formatPrice } from '../utils/item';

export default {
  data() {
    return {
      items: [],
      auctions: [],
      searchQuery: '',
      currentPage: 1,
      itemsPerPage: 8,
    };
  },
  computed: {
    filteredItems() {
      return this.items.filter(item =>
        item.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
    paginatedItems() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredItems.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredItems.length / this.itemsPerPage);
    },
  },
  async created() {
    this.items = await fetchItems();
    this.auctions = await fetchAuctions();
  },
  watch: {
    searchQuery() {
      this.resetPage();
    },
  },
  methods: {
    getIcon(icon) {
      return getIcon(icon);
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    resetPage() {
      this.currentPage = 1;
    },
    getPrice(entry) {
      const auction = this.auctions.find(auction => auction.entry === entry);
      return auction ? formatPrice(auction.price) : 'No price available';
    },
  },
};
</script>