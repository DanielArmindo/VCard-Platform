import { ref, inject, computed } from 'vue'
import { defineStore } from 'pinia'
import { useToast } from 'vue-toastification'
import { useUserStore } from '../stores/user.js'
import { useRouter } from 'vue-router'

export const useVCardsStore = defineStore('vcards', () => {

    const socket = inject("socket")
    const axios = inject('axios')
    const userStore = useUserStore()
    const toast = useToast()
    const router = useRouter()

    const format = new Intl.NumberFormat('pt-EU', { style: 'currency', currency: 'EUR' });
    const vcard = ref(null)
    const vcardBalance = computed(() => format.format(vcard.value?.balance) ?? 0)
    const vcardMaxDebit = computed(() => format.format(vcard.value?.max_debit) ?? 0)

    async function loadVCard() {
        try {
            const response = await axios.get(`vcards/${userStore.userId}`)
            vcard.value = response.data.data
            console.log(vcard.value.balance)
            return vcard.value
        } catch (error) {
            throw error
        }
    }

    // Sockets
    socket.on('blockedVCard', (blockedVCard) => {
        if (blockedVCard.phone_number == userStore.userId) {
            toast.error(`You have been blocked by an administrator!`)
            userStore.clearUser()
            router.push({ name: 'Login' })
        } else if (userStore.userType == 'A') {
            toast.error(`${blockedVCard.name} has been blocked!`)
        }
    })

    socket.on('unblockedVCard', (unblockedVCard) => {
        if (unblockedVCard.phone_number == userStore.userId) {
            toast.info(`You have been unblocked by an administrator!`)
        } else if (userStore.userType == 'A') {
            toast.info(`${unblockedVCard.name} has been unblocked!`)
        }
    })

    socket.on('deletedVCard', (deletedVCard) => {
        if (deletedVCard.phone_number == userStore.userId) {
            toast.error(`You have been deleted by an administrator!`)
            userStore.clearUser()
            router.push({ name: 'Login' })
        } else if (userStore.userType == 'A') {
            toast.error(`VCard ${deletedVCard.name} has been deleted!`)
        }
    })

    socket.on('maxDebitUpdated', (vcard) => {
        toast.info(`Your maximum debit has been updated to ${vcard.max_debit}€ by an administrator!`)
        loadVCard()
    })
    return { loadVCard, vcardBalance, vcardMaxDebit, vcard }
})