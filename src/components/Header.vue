<script>
import { ref, watch } from "vue";

export default {
    name: "Header",
    setup() {
        const links = ref([
            { text: "Database", link: "/database" },
            { text: "About", link: "/about" },
        ]);

        const isMobileMenuOpen = ref(false);
        const mobileOpenDropdowns = ref({});
        const mobileOpenNestedDropdowns = ref({});

        const toggleMobileDropdown = (index) => {
            mobileOpenDropdowns.value[index] = !mobileOpenDropdowns.value[index];
        };

        const toggleMobileNestedDropdown = (parentIndex, childIndex) => {
            if (!mobileOpenNestedDropdowns.value[parentIndex]) {
                mobileOpenNestedDropdowns.value[parentIndex] = {};
            }
            mobileOpenNestedDropdowns.value[parentIndex][childIndex] = !mobileOpenNestedDropdowns.value[parentIndex][childIndex];
        };

        // Watch for changes in isMobileMenuOpen to toggle body overflow
        watch(isMobileMenuOpen, (newValue) => {
            if (newValue) {
                document.body.classList.add('overflow-hidden');
            } else {
                document.body.classList.remove('overflow-hidden');
            }
        });

        return {
            links,
            isMobileMenuOpen,
            mobileOpenDropdowns,
            mobileOpenNestedDropdowns,
            toggleMobileDropdown,
            toggleMobileNestedDropdown,
        };
    },
};
</script>

<template>
    <nav class="bg-gray-900">
        <!-- Desktop Header (Visible on screens larger than XL) -->
        <div class="hidden xl:flex xl:items-center xl:justify-between mx-auto w-10/12">
            <!-- Logo -->
            <div class="flex-shrink-0">
                <a href="/" class="flex gap-4 items-center">
                    <img src="/src/assets/images/full-logo.png" alt="Logo" class="w-64 h-auto" />
                    <h1 class="text-yellow-400 text-2xl">Auction House</h1>
                </a>
            </div>
            <ul class="flex justify-center items-center xl:flex-row text-lg">
                <li v-for="(item, index) in links" :key="index" class="relative group xl:w-auto">
                    <a v-if="!item.dropdown" :href="item.link" :target="item.newTab ? '_blank' : '_self'"
                        class="text-white px-5 py-7 hover:bg-gray-800 transition-colors inline-flex items-center">
                        {{ item.text }}
                    </a>
                    <span v-else
                        class="text-white px-5 py-7 hover:bg-gray-800 cursor-pointer transition-colors inline-flex items-center gap-3">
                        <span>{{ item.text }}</span>
                        <i class="pi pi-chevron-down"></i>
                    </span>
                    <ul v-if="item.dropdown"
                        class="absolute left-0 w-48 bg-gray-700 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                        <li v-for="(dropdownItem, dropdownIndex) in item.dropdown" :key="dropdownIndex"
                            class="relative group/item">
                            <a :href="dropdownItem.link || '#'" :target="dropdownItem.newTab ? '_blank' : '_self'"
                                class="text-white px-4 py-2 hover:bg-gray-600 flex items-center justify-between">
                                {{ dropdownItem.text }}
                                <i v-if="dropdownItem.dropdown" class="pi pi-chevron-down"></i>
                            </a>
                            <ul v-if="dropdownItem.dropdown"
                                class="absolute left-full top-0 w-48 bg-gray-700 shadow-md opacity-0 invisible group-hover/item:opacity-100 group-hover/item:visible transition-all duration-200 z-20">
                                <li v-for="(nestedItem, nestedIndex) in dropdownItem.dropdown" :key="nestedIndex">
                                    <a :href="nestedItem.link" :target="nestedItem.newTab ? '_blank' : '_self'"
                                        class="block text-white px-4 py-2 hover:bg-gray-600">
                                        {{ nestedItem.text }}
                                    </a>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>

        <!-- Mobile Header (Visible on XL and below, toggleable) -->
        <div class="xl:hidden flex items-center justify-between p-4">
            <!-- Toggle Button -->
            <button @click="isMobileMenuOpen = !isMobileMenuOpen" class="text-white focus:outline-none">
                <i class="text-xl" :class="isMobileMenuOpen ? 'pi pi-times' : 'pi pi-bars'"></i>
            </button>
            <!-- Centered Logo -->
            <div class="text-center mx-auto">
                <a href="/" class="flex flex-col items-center sm:flex-row sm:gap-4">
                    <img src="/src/assets/images/full-logo.png" alt="Logo" class="w-40 h-auto" />
                    <h1 class="text-yellow-400 text-2xl">Auction House</h1>
                </a>
            </div>
        </div>

        <!-- Mobile Navigation Menu (Hidden by default, toggles with button, positioned at top) -->
        <ul
            :class="['absolute w-full h-[calc(100vh-105px)] bg-gray-800 shadow-lg z-20 xl:hidden overflow-y-auto transition-all duration-500', isMobileMenuOpen ? 'left-0' : '-left-full']">
            <li v-for="(item, index) in links" :key="index" class="relative group w-full text-xl">
                <!-- Regular link for mobile -->
                <a v-if="!item.dropdown" :href="item.link" :target="item.newTab ? '_blank' : '_self'"
                    class="text-white px-4 py-2 text-center block w-full">
                    {{ item.text }}
                </a>
                <!-- Dropdown trigger for mobile -->
                <div v-else class="text-white px-4 py-2 cursor-pointer block w-full"
                    @click.stop="toggleMobileDropdown(index)">
                    <div class="inline-flex items-center gap-3 w-full justify-center"
                        :class="{ 'ml-3': item.dropdown }">
                        <span>{{ item.text }}</span>
                        <i class="pi pi-chevron-down" :class="{ 'rotate-180': mobileOpenDropdowns[index] }"></i>
                    </div>
                </div>
                <!-- Mobile Dropdown (Level 1) -->
                <ul v-if="mobileOpenDropdowns[index]" class="bg-gray-700 w-full overflow-y-auto overflow-x-hidden">
                    <li v-for="(dropdownItem, dropdownIndex) in item.dropdown" :key="dropdownIndex"
                        class="relative group/item w-full">
                        <a :href="dropdownItem.link || '#'" :target="dropdownItem.newTab ? '_blank' : '_self'"
                            class="text-white px-4 py-2 w-full flex items-center justify-center gap-3"
                            :class="{ 'ml-3': dropdownItem.dropdown }"
                            @click.stop="toggleMobileNestedDropdown(index, dropdownIndex)">
                            {{ dropdownItem.text }}
                            <i v-if="dropdownItem.dropdown" class="pi pi-chevron-down"
                                :class="{ 'rotate-180': mobileOpenNestedDropdowns[index]?.[dropdownIndex] }"></i>
                        </a>
                        <!-- Mobile Nested Dropdown (Level 2) - Positioned below parent -->
                        <ul v-if="dropdownItem.dropdown && mobileOpenNestedDropdowns[index]?.[dropdownIndex]"
                            class="bg-gray-600 w-full overflow-y-auto">
                            <li v-for="(nestedItem, nestedIndex) in dropdownItem.dropdown" :key="nestedIndex"
                                class="w-full">
                                <a :href="nestedItem.link" :target="nestedItem.newTab ? '_blank' : '_self'"
                                    class="text-white px-4 py-2 text-center block w-full" @click.stop>
                                    {{ nestedItem.text }}
                                </a>
                            </li>
                        </ul>
                    </li>
                </ul>
            </li>
        </ul>
    </nav>
</template>