<template>
  <div class="p-4 w-full sm:w-3/4 lg:w-2/3 2xl:w-1/3 mx-auto flex flex-col">
    <div class="flex flex-row md:flex-row justify-between gap-4">
    </div>
    <div class="flex gap-6 items-center mb-4 justify-between">
      <h1 class="text-2xl font-bold">{{ item.name }}</h1>
      <button @click="toggleSortDirection('price')" class="py-2 border rounded md:w-auto px-4">
        <span class="hidden md:inline">{{ sortDirection.price === 'asc' ? 'Low to High' : 'High to Low' }}</span>
        <div class="md:hidden">
          <span class="text-lg mr-2">Price</span>
          <i :class="sortDirection.price === 'asc' ? 'pi pi-chevron-down' : 'pi pi-chevron-up'"></i>
        </div>
      </button>
    </div>
    <div class="flex items-center justify-between mb-4">
      <p v-if="auction" class="text-lg">Market Value: <span v-html="formattedPrice"></span></p>
      <p v-if="auction" class="text-lg">Total Quantity: {{ auction.totalQuantity }}</p>
    </div>
    <div v-if="filteredAuctions && filteredAuctions.length > 0">
      <ul class="space-y-2">
        <li v-for="auction in paginatedAuctions" :key="auction._id"
          class="p-1 border rounded hover:bg-gray-100 flex items-center">
          <div class="flex items-center w-full justify-between">
            <div class="flex items-center gap-4">
              <img :src="iconUrl" :alt="item.name" v-if="iconUrl" class="w-12 h-12" />
              <span class="text-black text-xl">x{{ auction.quantity }}</span>
            </div>
            <span class="text-gray-600 w-1/4 text-right"><span v-html="formatPrice(auction.price)"></span></span>
          </div>
        </li>
      </ul>
      <div class="flex justify-between items-center mt-4 text-lg md:text-xl">
        <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1"
          class="px-4 py-2 bg-gray-300 rounded disabled:opacity-50">
          <i class="pi pi-chevron-left"></i>
        </button>
        <span>Page {{ currentPage }} of {{ totalPages }}</span>
        <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages"
          class="px-4 py-2 bg-gray-300 rounded disabled:opacity-50">
          <i class="pi pi-chevron-right"></i>
        </button>
      </div>
    </div>
    <button v-if="cameFromDatabase" @click="$router.push('/database')"
      class="mt-4 px-4 py-2 bg-blue-500 text-white rounded">Back</button>
  </div>
</template>

<script>
import { fetchItemByEntry, fetchAuctionByEntry, fetchDataByEntry } from '../utils/api';
import { getIcon, formatPrice } from '../utils/item';

export default {
  data() {
    return {
      item: {},
      iconUrl: '',
      auctions: [],
      auction: null,
      formattedPrice: '',
      cameFromDatabase: false,
      currentPage: 1,
      itemsPerPage: 8,
      searchQuery: '',
      activeSort: 'price',
      sortDirection: { price: 'asc' }
    };
  },
  computed: {
    filteredAuctions() {
      return this.sortItems(
        this.auctions.filter(auction => auction.price.toString().toLowerCase().includes(this.searchQuery.toLowerCase()))
      );
    },
    paginatedAuctions() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      return this.filteredAuctions.slice(start, start + this.itemsPerPage);
    },
    totalPages() {
      return Math.ceil(this.filteredAuctions.length / this.itemsPerPage);
    }
  },
  watch: {
    searchQuery() {
      this.resetPage();
    }
  },
  async created() {
    const entry = this.$route.params.entry;
    this.item = await fetchItemByEntry(entry);
    this.iconUrl = getIcon(this.item.icon);
    try {
      const auctionResponse = await fetchAuctionByEntry(entry);
      if (auctionResponse && auctionResponse.length > 0) {
        this.auctions = auctionResponse;
      }
      const auctionData = await fetchDataByEntry(entry);
      if (auctionData && auctionData.length > 0) {
        this.auction = auctionData[0];
        this.formattedPrice = formatPrice(this.auction.averagePrice);
      }
    } catch (error) {
      console.error('Error fetching auction data:', error);
    }
    this.cameFromDatabase = localStorage.getItem('fromDatabase') === 'true';
    localStorage.removeItem('fromDatabase');
  },
  methods: {
    formatPrice,
    resetPage() {
      this.currentPage = 1;
    },
    toggleSortDirection(type) {
      this.sortDirection[type] = this.sortDirection[type] === 'asc' ? 'desc' : 'asc';
      this.resetPage();
    },
    sortItems(auctions) {
      const sortFunctions = {
        price: (a, b) => this.sortDirection.price === 'asc' ? a.price - b.price : b.price - a.price
      };
      return [...auctions].sort(sortFunctions['price']);
    },
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
    clearSearch() {
      this.searchQuery = '';
    }
  }
};
</script>