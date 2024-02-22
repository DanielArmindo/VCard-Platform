import { ref, inject } from 'vue'
import { defineStore } from 'pinia'
import { useToast } from 'vue-toastification'
import { useUserStore } from '../stores/user.js'
import { useVCardsStore } from './vcards.js'
import CustomToast from '../components/global/CustomToast.vue'

export const useTransactionsStore = defineStore('transactions', () => {

    const socket = inject("socket")
    const axios = inject('axios')
    const userStore = useUserStore()
    const vCardsStore = useVCardsStore()
    const toast = useToast()
    const transactions = ref({ data: [] })
    const totalTransactions = ref(0)

    let params = {
        payment_reference: '',
        start_date: '',
        end_date: '',
        type: '',
        sort: 'DDESC'
    }
    let currentPage = 1

    async function loadTransactions(page, filterByPaymentReference, filterByStartDate, filterByEndDate, filterByType, sortBy) {
        try {
            params = {
                payment_reference: filterByPaymentReference,
                start_date: filterByStartDate,
                end_date: filterByEndDate,
                type: filterByType,
                sort: sortBy
            };
            const searchParams = new URLSearchParams(params);
            const queryString = searchParams.toString();

            const response = await axios.get(`vcards/${userStore.userId}/transactions?page=${page}&${queryString}`)
            transactions.value = response.data
            totalTransactions.value = response.data.meta.total
            currentPage = page
            return transactions.value
        } catch (error) {
            throw error
        }
    }

    async function insertTransaction(newTransaction) {
        let url = userStore.userType != 'A' ? 'transactions/debit' : 'transactions/credit'
        const response = await axios.post(url, newTransaction)
        socket.emit('newTransaction', response.data.data)
        return response.data.data
    }

    // Sockets
    socket.on('newTransaction', (transaction) => {
        let { payment_reference, start_date, end_date, type, sort } = params;
        loadTransactions(currentPage, payment_reference, start_date, end_date, type, sort);
        totalTransactions.value++
        toast.info(`Received ${transaction.value}€ from ${transaction.sender_name ?? transaction.payment_reference}!`)
        vCardsStore.loadVCard()
    })

    socket.on('moneyRequest', (requester, responder, transactionValue) => {
        showCustomToast(requester, responder, transactionValue)
    })

    socket.on('moneyRequestDeclined', (requester, responder, transactionValue) => {
        toast.error(`${responder} declined your request for ${transactionValue}€!`)
    })

    const showCustomToast = (requester, responder, transactionValue) => {
        toast({
            component: CustomToast,
            props: {
                message: `${requester} is requesting ${transactionValue}€ from you!`,
                close: () => toast.clear(),
                requester: requester,
                responder: responder,
                transactionValue: transactionValue
            },
        },
            {
                timeout: 5000,
                hideProgressBar: false,
                type: 'info',
                closeOnClick: false,
                position: 'top-right',
                closeButton: false,
            })
    }

    return { transactions, loadTransactions, totalTransactions, insertTransaction, socket }
})
