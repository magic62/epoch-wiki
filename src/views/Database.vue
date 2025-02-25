<template>
  <div class="p-4 w-full md:w-3/4 mx-auto flex flex-col md:mt-4">
    <div class="flex flex-row md:flex-row justify-between mb-4 gap-4">
      <div class="flex flex-col md:flex-row gap-2">
        <div class="flex items-center">
          <button @click="toggleSortActive('name')" :class="{ 'bg-gray-300': activeSort === 'name' }" class="px-6 py-2 border rounded w-full md:w-auto">
            Sort by Name
          </button>
          <button @click="toggleSortDirection('name')" :disabled="activeSort !== 'name'" class="py-3 border rounded disabled:opacity-50 md:ml-2 md:w-auto w-8 h-full flex items-center justify-center ml-2 md:px-4 px-6">
            <span class="hidden md:inline">{{ sortDirection.name === 'asc' ? 'A to Z' : 'Z to A' }}</span>
            <i :class="sortDirection.name === 'asc' ? 'pi pi-chevron-up' : 'pi pi-chevron-down'" class="pi md:hidden"></i>
          </button>
        </div>
      </div>
      <div class="flex flex-col md:flex-row gap-2">
        <div class="flex items-center">
          <button @click="toggleSortActive('price')" :class="{ 'bg-gray-300': activeSort === 'price' }" class="px-6 py-2 border rounded w-full md:w-auto">
            Sort by Price
          </button>
          <button @click="toggleSortDirection('price')" :disabled="activeSort !== 'price'" class="py-3 border rounded disabled:opacity-50 md:ml-2 md:w-auto w-8 h-full flex items-center justify-center ml-2 md:px-4 px-6">
            <span class="hidden md:inline">{{ sortDirection.price === 'asc' ? 'Low to High' : 'High to Low' }}</span>
            <i :class="sortDirection.price === 'asc' ? 'pi pi-chevron-down' : 'pi pi-chevron-up'" class="pi md:hidden"></i>
          </button>
        </div>
      </div>
    </div>
    <div class="relative">
      <input v-model="searchQuery" placeholder="Search items..." class="w-full p-2 mb-4 border rounded text-xl md:text-2xl" />
      <i @click="clearSearch" v-if="searchQuery" class="pi pi-times absolute right-3 top-[10px] text-xl cursor-pointer"></i>
    </div>
    <ul class="space-y-2">
      <li v-for="item in paginatedItems" :key="item.entry" class="p-1 border rounded hover:bg-gray-100 flex items-center">
        <a @click="setFromDatabase" :href="`/items/${item.entry}`" class="flex items-center w-full">
          <div class="flex items-center w-3/4">
            <img :src="`/src/assets/icons/${item.icon}.png`" alt="" class="w-12 h-12 mr-2" />
            <span class="text-black text-xl md:text-2xl">{{ item.name }}</span>
          </div>
          <span class="text-gray-600 w-1/4 text-right" v-html="formatPrice(item.price)"></span>
        </a>
      </li>
    </ul>
    <div class="flex justify-between items-center mt-4 text-lg md:text-xl">
      <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1" class="px-4 py-2 bg-gray-300 rounded disabled:opacity-50">
        <span class="hidden md:inline">Previous</span>
        <i class="pi pi-chevron-left md:hidden"></i>
      </button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages" class="px-4 py-2 bg-gray-300 rounded disabled:opacity-50">
        <span class="hidden md:inline">Next</span>
        <i class="pi pi-chevron-right md:hidden"></i>
      </button>
    </div>
  </div>
</template>

<script>
import { fetchItems, fetchAuctions } from '../utils/api';
import { getIcon, formatPrice } from '../utils/item';

export default {
  data: () => ({
    items: [],
    auctions: [],
    searchQuery: '',
    currentPage: 1,
    itemsPerPage: 8,
    activeSort: 'price',
    sortDirection: { name: 'asc', price: 'asc' }
  }),
  computed: {
    filteredItems() {
      return this.sortItems(
        this.items.filter(item => item.name.toLowerCase().includes(this.searchQuery.toLowerCase()))
      );
    },
    paginatedItems() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      return this.filteredItems.slice(start, start + this.itemsPerPage);
    },
    totalPages() {
      return Math.ceil(this.filteredItems.length / this.itemsPerPage);
    }
  },
  watch: {
    searchQuery(newValue) {
      this.storeSearchQuery(newValue);
      this.resetPage();
    },
    currentPage(newPage) {
      this.storeCurrentPage(newPage);
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (from.path && !from.path.startsWith('/items/')) {
        vm.currentPage = 1;
        vm.searchQuery = '';
        vm.storeCurrentPage(1);
        vm.storeSearchQuery('');
      } else {
        vm.currentPage = vm.getStoredPage() || 1;
        vm.searchQuery = vm.getStoredSearchQuery() || '';
      }
    });
  },
  async created() {
    this.currentPage = this.getStoredPage() || this.currentPage;
    this.searchQuery = this.getStoredSearchQuery() || this.searchQuery;
    
    const [items, auctions] = await Promise.all([fetchItems(), fetchAuctions()]);
    this.auctions = auctions;
    this.items = items
      .map(item => ({
        ...item,
        price: auctions.find(auction => auction.entry === item.entry)?.price || 0
      }))
      .filter(item => item.price > 0);
    
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages || 1;
      this.storeCurrentPage(this.currentPage);
    }
  },
  methods: {
    getIcon,
    formatPrice,
    resetPage() {
      this.currentPage = 1;
      this.storeCurrentPage(1);
    },
    toggleSortActive(type) {
      this.activeSort = this.activeSort === type ? null : type;
      this.resetPage();
    },
    toggleSortDirection(type) {
      this.sortDirection[type] = this.sortDirection[type] === 'asc' ? 'desc' : 'asc';
      this.resetPage();
    },
    sortItems(items) {
      if (!this.activeSort) return items;
      const sortFunctions = {
        name: (a, b) => this.sortDirection.name === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name),
        price: (a, b) => this.sortDirection.price === 'asc' ? a.price - b.price : b.price - a.price
      };
      return [...items].sort(sortFunctions[this.activeSort]);
    },
    storeCurrentPage(page) {
      localStorage.setItem('currentPage', page);
    },
    getStoredPage() {
      return Number(localStorage.getItem('currentPage')) || null;
    },
    storeSearchQuery(query) {
      localStorage.setItem('searchQuery', query);
    },
    getStoredSearchQuery() {
      return localStorage.getItem('searchQuery') || null;
    },
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        this.storeCurrentPage(page);
      }
    },
    clearSearch() {
      this.searchQuery = '';
      this.storeSearchQuery('');
    },
    setFromDatabase() {
      localStorage.setItem('fromDatabase', 'true');
    }
  }
};
</script>