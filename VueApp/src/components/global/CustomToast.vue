<script setup>
import { ref } from 'vue';
import { useTransactionsStore } from '../../stores/transactions.js'
import { useToast } from 'vue-toastification'
import FieldErrorMessage from '../global/FieldErrorMessage.vue'

const props = defineProps({
    message: {
        type: String,
        default: '',
    },
    close: {
        type: Function,
        default: () => { },
    },
    requester: {
        type: Number,
        required: true,
    },
    responder: {
        type: String,
        required: true,
    },
    transactionValue: {
        type: Number,
        required: true,
    },
});
const errors = ref(null);

const showInputConfirmationCode = ref(false);
const showButtonAccept = ref(true);
const showButtonDeny = ref(true);
const showButtonCancel = ref(false);
const showButtonConfirm = ref(false);

const newTransaction = () => {
    return {
        id: null,
        vcard: props.responder,
        type: 'D',
        payment_type: 'VCARD',
        payment_reference: props.requester,
        value: props.transactionValue,
        description: null,
        confirmation_code: '',
        category_id: null,
    }
}

const transaction = ref(newTransaction())
const transactionStore = useTransactionsStore();
const toast = useToast();

const accept = () => {
    showInputConfirmationCode.value = true;
    showButtonAccept.value = false;
    showButtonDeny.value = false;
    showButtonCancel.value = true;
    showButtonConfirm.value = true;
};

const deny = () => {
    props.close();
    transactionStore.socket.emit('moneyRequestDeclined', props.requester, props.responder, transaction.value.value);
};

const confirm = async () => {
    try {
        if (!validateConfirmationCode()) {
            return;
        }
        transaction.value = await transactionStore.insertTransaction(transaction.value);
        props.close();
        toast.success(`Transaction with value ${transaction.value.value}€ to ${transaction.value.payment_reference} was created!`)
    } catch (error) {
        props.close();
        if (error.response && error.response.status == 422) {
            errors.value = error.response.data.errors
            toast.error('Transaction was not created due to validation errors!')
        } else {
            errors.value = {}
            toast.error(error.response.data.message || 'Transaction was not created due to unknown server error!')
        }
        transactionStore.socket.emit('moneyRequestDeclined', props.requester, props.responder, transaction.value.value);
    }
};

const cancel = () => {
    showInputConfirmationCode.value = false;
    showButtonAccept.value = true;
    showButtonDeny.value = true;
    showButtonCancel.value = false;
    showButtonConfirm.value = false;
};

const validateConfirmationCode = () => {
    if (!transaction.value.confirmation_code) {
        errors.value = { confirmation_code: ['Confirmation Code is required'] };
        return false;
    }
    if (transaction.value.confirmation_code.length != 3) {
        errors.value = { confirmation_code: ['Confirmation Code must have 3 digits'] };
        return false;
    }
    errors.value = null;
    return true;
};
</script>

<template>
    <div class="d-flex flex-column text-light">

        <form class="needs-validation" novalidate @submit.prevent="save">
            <span>{{ message }}</span>
            <div class="mb-3" v-if="showInputConfirmationCode">
                <label for="inputConfirmationCode" class="form-label">Confirmation Code</label>
                <input type="password" class="form-control" :class="{ 'is-invalid': errors ? errors['confirmation_code'] : false }" @blur="validateConfirmationCode" v-model="transaction.confirmation_code" id="inputConfirmationCode" placeholder="Confirmation Code" />
                <field-error-message :errors="errors" fieldName="confirmation_code"></field-error-message>
            </div>
            <div class="d-flex justify-content-between mt-2">
                <button v-if="showButtonDeny" class="btn btn-sm btn-light text-danger" @click="deny">Rejeitar</button>
                <button v-if="showButtonAccept" class="btn btn-sm btn-light text-success" @click="accept">Aceitar</button>
                <button v-if="showButtonCancel" class="btn btn-sm btn-light text-secondary text-center" @click="cancel">Cancelar</button>
                <button v-if="showButtonConfirm" class="btn btn-sm btn-light text-success" @click="confirm">Confirmar</button>
            </div>
        </form>
    </div>
</template>
