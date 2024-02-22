<script setup>
import { useRouter, RouterLink, RouterView } from 'vue-router'
import { useToast } from "vue-toastification"
import { useUserStore } from './stores/user';
import { useTransactionsStore } from './stores/transactions';
import { useVCardsStore } from './stores/vcards';
import { useAdminsStore } from './stores/admins';

const toast = useToast()
const router = useRouter()
const userStore = useUserStore()
const transactionStore = useTransactionsStore()
const vCardsStore = useVCardsStore()
const adminsStore = useAdminsStore()

const logout = async () => {
  if (await userStore.logout()) {
    toast.success('User has logged out of the application.')
    clickMenuOption()
    router.push({ name: 'Login' })
  } else {
    toast.error('There was a problem logging out of the application!')
  }
}

const clickMenuOption = () => {
  const domReference = document.getElementById('buttonSidebarExpandId')
  if (domReference) {
    if (window.getComputedStyle(domReference).display !== "none") {
      domReference.click()
    }
  }
}
</script>

<template>
  <nav class="navbar navbar-expand-md navbar-dark bg-dark sticky-top flex-md-nowrap p-0 shadow">
    <div class="container-fluid">
      <router-link class="navbar-brand col-md-3 col-lg-2 me-0 px-3" :to="{ name: 'home' }" @click="clickMenuOption">
        <img src="@/assets/logo.png" alt="" width="30" height="24" class="d-inline-block align-text-top">
        VCard
      </router-link>
      <button id="buttonSidebarExpandId" class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#sidebarMenu" aria-controls="sidebarMenu" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse justify-content-end">
        <div v-if="userStore.userType == 'V'">
          <span class="badge bg-light mx-1 text-xl-large text-dark">Max Debit: {{ vCardsStore.vcardMaxDebit }}</span>
          <span class="badge bg-light mx-1 text-xl-large text-dark">Balance: {{ vCardsStore.vcardBalance }}</span>
        </div>
        <ul class="navbar-nav">
          <li class="nav-item" v-show="!userStore.user">
            <router-link class="nav-link" :class="{ active: $route.name === 'NewVCard' }" :to="{ name: 'NewVCard' }" @click="clickMenuOption">
              <i class="bi bi-person-check-fill"></i>
              Register
            </router-link>
          </li>
          <li class="nav-item" v-show="!userStore.user">
            <router-link class="nav-link" :class="{ active: $route.name === 'Login' }" :to="{ name: 'Login' }" @click="clickMenuOption">
              <i class="bi bi-box-arrow-in-right"></i>
              Login
            </router-link>
          </li>
          <li class="nav-item dropdown" v-show="userStore.user">
            <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              <img :src="userStore.userPhotoUrl" class="rounded-circle z-depth-0 avatar-img" alt="avatar image">
              <span class="avatar-text">{{ userStore.userName }}</span>
            </a>
            <ul class="dropdown-menu dropdown-menu-dark dropdown-menu-end" aria-labelledby="navbarDropdownMenuLink">
              <li>
                <router-link class="dropdown-item" :class="{ active: (($route.name == 'Admin' && $route.params.id == userStore.userId) || ($route.name == 'VCard' && $route.params.id == userStore.userId)) }" :to="{ name: (userStore.userType == 'A' ? 'Admin' : 'VCard'), params: (userStore.userType == 'A' ? { id: userStore.userId } : { phoneNumber: userStore.userId }) }" @click="clickMenuOption">
                  <i class="bi bi-person-square"></i>
                  Profile
                </router-link>
              </li>
              <li>
                <router-link class="dropdown-item" :class="{ active: $route.name === 'ChangePassword' }" :to="{ name: 'ChangePassword' }" @click="clickMenuOption">
                  <i class="bi bi-key-fill"></i>
                  Change password
                </router-link>
              </li>
              <li v-if="userStore.userType == 'V'">
                <router-link class="dropdown-item" :class="{ active: $route.name === 'ChangeConfirmationCode' }" :to="{ name: 'ChangeConfirmationCode' }" @click="clickMenuOption">
                  <i class="bi bi-shield-lock-fill"></i>
                  Change confirmation code
                </router-link>
              </li>
              <li>
                <hr class="dropdown-divider">
              </li>
              <li>
                <a class="dropdown-item" @click.prevent="logout">
                  <i class="bi bi-arrow-right"></i>Logout
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>

  <div class="container-fluid">
    <div class="row">
      <nav id="sidebarMenu" class="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
        <div class=" position-sticky pt-3">
          <ul class="nav flex-column" v-if="userStore.user">
            <li class="nav-item" v-if="userStore.userType == 'A'">
              <router-link class="nav-link" :class="{ active: $route.name === 'Admins' }" :to="{ name: 'Admins' }" @click="clickMenuOption">
                <i class="bi bi-person-gear"></i>
                Admins
              </router-link>
            </li>
            <li class="nav-item" v-if="userStore.userType == 'A'">
              <router-link class="nav-link" :class="{ active: $route.name === 'VCards' }" :to="{ name: 'VCards' }" @click="clickMenuOption">
                <i class="bi bi-files"></i>
                VCards
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" :class="{ active: $route.name === 'Categories' }" :to="{ name: 'Categories' }">
                <i class="bi bi-list-check"></i>Categories
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" :class="{ active: $route.name === 'Statistics' }" :to="{ name: 'Statistics' }">
                <i class="bi bi-files"></i>
                Statistics
              </router-link>
            </li>

            <li class="nav-item" v-if="userStore.userType == 'A'">
              <router-link class="nav-link" :class="{ active: $route.name === 'NewTransaction' }" :to="{ name: 'NewTransaction' }">
                <i class="bi bi-cash"></i>Credit transaction
              </router-link>
            </li>
            <li class="nav-item" v-if="userStore.userType != 'A'">
              <router-link class="nav-link" :class="{ active: $route.name === 'Transactions' }" :to="{ name: 'Transactions' }">
                <i class="bi bi-bank"></i>Transactions
              </router-link>
            </li>
            <li class="nav-item" v-if="userStore.userType == 'V'">
              <router-link class="nav-link" :class="{ active: $route.name === 'PiggyBank' }" :to="{ name: 'PiggyBank' }">
                <i class="bi bi-piggy-bank"></i>Piggy Bank
              </router-link>
            </li>

          </ul>

          <div class="d-block d-md-none">
            <h6 class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
              <span>User</span>
            </h6>
            <ul class="nav flex-column mb-2">
              <li class="nav-item" v-show="!userStore.user">
                <router-link class="nav-link" :class="{ active: $route.name === 'NewVCard' }" :to="{ name: 'NewVCard' }" @click="clickMenuOption">
                  <i class="bi bi-person-check-fill"></i>
                  Register
                </router-link>
              </li>
              <li class="nav-item" v-show="!userStore.user">
                <router-link class="nav-link" :class="{ active: $route.name === 'Login' }" :to="{ name: 'Login' }" @click="clickMenuOption">
                  <i class="bi bi-box-arrow-in-right"></i>
                  Login
                </router-link>
              </li>
              <li class="nav-item dropdown" v-show="userStore.user">
                <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink2" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <img :src="userStore.userPhotoUrl" class="rounded-circle z-depth-0 avatar-img" alt="avatar image">
                  <span class="avatar-text">{{ userStore.userName }}</span>
                </a>
                <ul class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink2">
                  <li>
                    <router-link class="dropdown-item" :class="{ active: (($route.name == 'Admin' && $route.params.id == userStore.userId) || ($route.name == 'VCard' && $route.params.id == userStore.userId)) }" :to="{ name: (userStore.userType == 'A' ? 'Admin' : 'VCard'), params: (userStore.userType == 'A' ? { id: userStore.userId } : { phoneNumber: userStore.userId }) }" @click="clickMenuOption">
                      <i class="bi bi-person-square"></i>
                      Profile
                    </router-link>
                  </li>
                  <li>
                    <router-link class="dropdown-item" :class="{ active: $route.name === 'ChangePassword' }" :to="{ name: 'ChangePassword' }" @click="clickMenuOption">
                      <i class="bi bi-key-fill"></i>
                      Change password
                    </router-link>
                  </li>
                  <li v-if="userStore.userType == 'V'">
                    <router-link class="dropdown-item" :class="{ active: $route.name === 'ChangeConfirmationCode' }" :to="{ name: 'ChangeConfirmationCode' }" @click="clickMenuOption">
                      <i class="bi bi-key-fill"></i>
                      Change confirmation code
                    </router-link>
                  </li>
                  <li>
                    <hr class="dropdown-divider">
                  </li>
                  <li>
                    <a class="dropdown-item" @click.prevent="logout">
                      <i class="bi bi-arrow-right"></i>Logout
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <main class="col-md-9 ms-sm-auto col-lg-10 px-md-4">
        <router-view></router-view>
      </main>
    </div>
  </div>
</template>

<style>
@import "./assets/dashboard.css";

.avatar-img {
  margin: -1.2rem 0.8rem -2rem 0.8rem;
  width: 3.3rem;
  height: 3.3rem;
}

.avatar-text {
  line-height: 2.2rem;
  margin: 1rem 0.5rem -2rem 0;
  padding-top: 1rem;
}

.dropdown-item {
  font-size: 0.875rem;
}

.btn:focus {
  outline: none;
  box-shadow: none;
}

#sidebarMenu {
  overflow-y: auto;
}

.text-xl-large {
  font-size: 1.0em;
}
</style>
