import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../stores/user.js'
import HomeView from '../views/HomeView.vue'
import Login from "../components/auth/Login.vue"
import ChangeCredentials from "../components/auth/ChangeCredentials.vue"
import VCards from "../components/vcards/Vcards.vue"
import VCard from "../components/vcards/Vcard.vue"
import Admins from "../components/admins/Admins.vue"
import Admin from "../components/admins/Admin.vue"
import Categories from "../components/categories/Categories.vue"
import Category from "../components/categories/Category.vue"
import Transaction from "../components/transactions/Transaction.vue"
import Transactions from "../components/transactions/Transactions.vue"
import Statistics from "../components/statistics/Statistics.vue"
import PiggyBank from "../components/piggybank/PiggyBank.vue"
import NotFound from "../views/NotFound.vue"

let handlingFirstRoute = true

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView
        },
        {
            path: '/about',
            name: 'about',
            component: () => import('../views/AboutView.vue')
        },
        {
            path: '/login',
            name: 'Login',
            component: Login,
            meta: { onlyAnonym: true },
        },
        {
            path: '/credentials/password',
            name: 'ChangePassword',
            component: ChangeCredentials,
            props: { changeConfirmationCode: false },
            meta: { requiresAuth: true },
        },
        {
            path: '/credentials/confirmation_code',
            name: 'ChangeConfirmationCode',
            component: ChangeCredentials,
            props: { changeConfirmationCode: true },
            meta: { requiresAuth: true, userType: 'V' },
        },
        {
            path: '/vcards',
            name: 'VCards',
            component: VCards,
            meta: { requiresAuth: true, userType: 'A' },
        },
        {
            path: '/vcards/:phoneNumber',
            name: 'VCard',
            component: VCard,
            props: route => ({ phoneNumber: parseInt(route.params.phoneNumber) }),
            meta: { requiresAuth: true },
        },
        {
            path: '/vcards/new',
            name: 'NewVCard',
            component: VCard,
            props: { phoneNumber: -1 },
            meta: { onlyAnonym: true },
        },
        {
            path: '/admins',
            name: 'Admins',
            component: Admins,
            meta: { requiresAuth: true, userType: 'A' },
        },
        {
            path: '/admins/:id',
            name: 'Admin',
            component: Admin,
            props: route => ({ id: parseInt(route.params.id) }),
            meta: { requiresAuth: true, userType: 'A', onlyHimself: true },
        },
        {
            path: '/admins/new',
            name: 'NewAdmin',
            component: Admin,
            props: { id: -1 },
            meta: { requiresAuth: true, onlyAdmin: true },
        },
        {
            path: '/categories',
            name: 'Categories',
            component: Categories,
            meta: { requiresAuth: true },
        },
        {
            path: '/categories/:id',
            name: 'Category',
            component: Category,
            props: route => ({ id: parseInt(route.params.id) }),
            meta: { requiresAuth: true },
        },
        {
            path: '/categories/new',
            name: 'NewCategory',
            component: Category,
            props: { id: -1 },
            meta: { requiresAuth: true },
        },
        {
            path: '/transaction/new',
            name: 'NewTransaction',
            component: Transaction,
            props: { id: -1 },
            meta: { requiresAuth: true },
        },
        {
            path: '/transactions/:id',
            name: 'Transaction',
            component: Transaction,
            props: route => ({ id: parseInt(route.params.id) }),
            meta: { requiresAuth: true, userType: 'V' },
        },
        {
            path: '/transactions',
            name: 'Transactions',
            component: Transactions,
            meta: { requiresAuth: true, userType: 'V' },
        },
        {
            path: '/statistics',
            name: 'Statistics',
            component: Statistics,
            meta: { requiresAuth: true },
        },
        {
            path: '/piggybank',
            name: 'PiggyBank',
            component: PiggyBank,
            meta: { requiresAuth: true, userType: 'V' },
        },
        {
            path: '/404',
            name: 'NotFound',
            component: NotFound,
        },
        {
            path: '/:catchAll(.*)',
            redirect: '/404',
        },
    ]
})

router.beforeEach(async (to, from, next) => {
    const userStore = useUserStore()

    if (handlingFirstRoute) {
        handlingFirstRoute = false
        await userStore.restoreToken()
    }

    if (to.meta.onlyAnonym && !userStore) {
        next('/');
        return;
    }

    if (to.name == 'VCard' && userStore.userType != 'A' && to.params.phoneNumber != userStore.userId) {
        next('/');
        return;
    }

    if (to.meta.requiresAuth) {
        if (!userStore.user) {
            next('/login');
            return;
        } else if (to.meta.userType && to.meta.userType !== userStore.userType) {
            next('/');
            return;
        } else if (to.meta.onlyAdmin && userStore.userType !== 'A') {
            next('/');
            return;
        } else if (to.meta.onlyHimself && to.params.id != userStore.user.id) {
            next('/');
            return;
        }
        else {
            next();
            return;
        }
    } else {
        next()
        return;
    }
})

export default router