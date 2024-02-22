<script setup>
import { ref, computed, inject } from "vue";
import { useToast } from "vue-toastification"

const axios = inject("axios")
const toast = useToast()

const props = defineProps({
    transactions: {
        type: Array,
        default: () => [],
    },
})

const emit = defineEmits(["edit"])

const editClick = (transaction) => {
    emit("edit", transaction)
}

</script>

<template>
    <table class="table">
        <thead>
            <tr>
                <th class="align-middle">Category</th>
                <th class="align-middle">Payment Reference</th>
                <th class="align-middle">Payment Type</th>
                <th class="align-middle">Type</th>
                <th class="align-middle">Value</th>
                <th class="align-middle">Old Balance</th>
                <th class="align-middle">New Balance</th>
                <th class="align-middle">Date</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="transaction in transactions" :key="transaction.id">
                <td class="align-middle">{{ transaction.category_name || '-- No Category --' }}</td>
                <td class="align-middle">{{ transaction.payment_reference }}</td>
                <td class="align-middle">{{ transaction.payment_type }}</td>
                <td class="align-middle">{{ transaction.type }}</td>
                <td class="align-middle">{{ (transaction.type == 'C' ? '+' : '-') + transaction.value + '€' }}</td>
                <td class="align-middle">{{ transaction.old_balance + '€' }}</td>
                <td class="align-middle">{{ transaction.new_balance + '€' }}</td>
                <td class="align-middle">{{ transaction.date }}</td>
                <td>
                    <div class="d-flex justify-content-end">
                        <button class="btn btn-xs btn-light" @click="editClick(transaction)">
                            <i class="bi bi-xs bi-pencil"></i>
                        </button>
                    </div>
                </td>
            </tr>
        </tbody>
    </table>
</template>

<style scoped>
button {
    margin-left: 3px;
    margin-right: 3px;
}
</style>