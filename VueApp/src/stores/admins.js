import { ref, inject } from 'vue'
import { defineStore } from 'pinia'
import { useToast } from 'vue-toastification'
import { useUserStore } from '../stores/user.js'
import { useRouter } from 'vue-router'

export const useAdminsStore = defineStore('admins', () => {

    const socket = inject("socket")
    const userStore = useUserStore()
    const toast = useToast()
    const router = useRouter()

    // Sockets
    socket.on('deletedAdmin', (deletedAdmin) => {
        if (deletedAdmin.id == userStore.userId) {
            toast.error(`You have been deleted by an administrator!`)
            userStore.clearUser()
            router.push({ name: 'Login' })
        } else if (userStore.userType == 'A') {
            toast.error(`Administrator ${deletedAdmin.name} has been deleted!`)
        }
    })

    return {}
})