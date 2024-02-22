<script setup>
import { useUserStore } from '../../stores/user.js'
import StatisticsAdmin from './StatisticsAdmin.vue'
import StatisticsVCard from './StatisticsVcard.vue'

const userStore = useUserStore()

const url = userStore.userType === 'V' ? `vcards/${userStore.userId}/statistics` : 'admins/statistics';
</script>

<template>
  <div v-if="userStore.userType === 'A'">
    <statistics-admin :url="url" />
  </div>
  <div v-else>
    <statistics-v-card :url="url" />
  </div>
</template>