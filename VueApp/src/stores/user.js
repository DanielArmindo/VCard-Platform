import { ref, computed, inject } from 'vue'
import { defineStore } from 'pinia'
import { useToast } from 'vue-toastification'
import { useVCardsStore } from './vcards'
import avatarNoneUrl from '@/assets/avatar-none.png'

export const useUserStore = defineStore('user', () => {

    const axios = inject('axios')
    const serverBaseUrl = inject('serverBaseUrl')
    const socket = inject("socket")
    const vCardsStore = useVCardsStore()
    const toast = useToast()

    const user = ref(null)
    const userName = computed(() => user.value?.name ?? 'Anonymous')
    const userId = computed(() => user.value?.id ?? -1)
    const userType = computed(() => user.value?.user_type ?? 'Anonymous')
    const userPhotoUrl = computed(() => user.value?.photo_url ? serverBaseUrl + '/storage/fotos/' + user.value.photo_url : avatarNoneUrl)


    async function loadUser() {
        try {
            const response = await axios.get('/users/me')
            user.value = response.data.data
            if (userType.value == 'V') {
                vCardsStore.loadVCard()
            }
        } catch (error) {
            clearUser()
            throw error
        }
    }

    function clearUser() {
        delete axios.defaults.headers.common.Authorization
        sessionStorage.removeItem('token')
        user.value = null
    }

    async function login(credentials) {
        try {
            const response = await axios.post('/auth/login', credentials)
            axios.defaults.headers.common.Authorization = "Bearer " + response.data.access_token
            sessionStorage.setItem('token', response.data.access_token)
            await loadUser()
            socket.emit('loggedIn', user.value)
            return true
        }
        catch (error) {
            clearUser()
            return false
        }
    }

    async function logout() {
        try {
            await axios.post('logout')
            clearUser()
            return true
        } catch (error) {
            return false
        }
    }

    async function changeCredentials(credentials) {
        if (userId.value < 0) {
            throw 'Anonymous users cannot change the password!'
        }

        try {
            let url = credentials.confirmation_code != '' ? `vcards/${user.value.id}/confirmation_code` : `users/${user.value.id}/password`
            await axios.patch(url, credentials)
            return true
        } catch (error) {
            throw error
        }
    }

    async function restoreToken() {
        let storedToken = sessionStorage.getItem('token')
        if (storedToken) {
            axios.defaults.headers.common.Authorization = "Bearer " + storedToken
            await loadUser()
            socket.emit('loggedIn', user.value)
            return true
        }
        clearUser()
        return false
    }


    return { user, userId, userName, userType, userPhotoUrl, loadUser, clearUser, login, logout, restoreToken, changeCredentials }
})
