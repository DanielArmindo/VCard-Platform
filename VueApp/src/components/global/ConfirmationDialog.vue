<script setup>
import { ref } from 'vue'

const props = defineProps({
    cancelBtn: {
        type: String,
        default: "Cancel",
    },
    confirmationBtn: {
        type: String,
        default: "Confirm",
    },
    title: {
        type: String,
        default: "Confirmation",
    },
    msg: {
        type: String,
        default: "",
    },
    deleteOperation: {
        type: Boolean,
        default: false,
    },
    showInputPassword: {
        type: Boolean,
        default: false,
    },
    showInputConfirmationCode: {
        type: Boolean,
        default: false,
    },
    errors: {
    type: Object,
    required: false,
  },
})

const emit = defineEmits(["show", "hide", "confirmed"])

const hiddenButtonToShowDialog = ref(null)
const hiddenButtonToHideDialog = ref(null)

const inputPassword = ref('')
const inputConfirmationCode = ref('')

const show = () => {
    // Show the modal:
    inputPassword.value = ''
    inputConfirmationCode.value = ''
    hiddenButtonToShowDialog.value.click()
    emit("show")
}
const hide = () => {
    // Hide the modal:
    hiddenButtonToHideDialog.value.click()
    emit("hide")
}
const clickConfirm = () => {
    hide()
    if (props.showInputPassword && props.showInputConfirmationCode) {
        emit("confirmed", inputPassword.value, inputConfirmationCode.value)
    }else if (props.showInputConfirmationCode){
        emit("confirmed", inputConfirmationCode.value)
    } 
    else {
        emit("confirmed")
    }
}

// Properties/Methods that are exposed to the outside when
// the public instance of the component is retrieved via template refs
defineExpose({ show, hide })
</script>


<template>
    <!-- Button trigger to Show modal - HIDDEN -->
    <button ref="hiddenButtonToShowDialog" type="button" class="d-none" data-bs-toggle="modal"
        data-bs-target="#confirmationModalId"></button>

    <!-- Modal -->
    <div class="modal fade" id="confirmationModalId" tabindex="-1" aria-labelledby="confirmationModalLabel"
        aria-hidden="true">
        <div class="modal-dialog">
            <!-- Button trigger to Hide modal - HIDDEN -->
            <button ref="hiddenButtonToHideDialog" type="button" class="d-none" data-bs-dismiss="modal"></button>

            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="confirmationModalLabel">{{ title }}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="d-flex flex-column modal-body">
                    <span class="mb-4">{{ msg }}</span>
                    <div class="mb-3" v-if="showInputPassword">
                        <label for="inputPassword" class="form-label">Password</label>
                        <input type="password" class="form-control" :class="{ 'is-invalid': errors ? errors['password'] : false }" id="inputPassword" placeholder="Password" v-model="inputPassword"/>
                        <field-error-message :errors="errors" fieldName="password"></field-error-message>
                    </div>
                    <div class="mb-3" v-if="showInputConfirmationCode">
                        <label for="inputConfirmationCode" class="form-label">Confirmation Code</label>
                        <input type="password" class="form-control" :class="{ 'is-invalid': errors ? errors['confirmation_code'] : false }" id="inputConfirmationCode" placeholder="Confirmation Code" v-model="inputConfirmationCode"/>
                        <field-error-message :errors="errors" fieldName="confirmation_code"></field-error-message>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                        {{ cancelBtn }}
                    </button>
                    <button type="button" class="btn btn-primary" :class="{ 'btn-danger': deleteOperation }" @click="clickConfirm">
                        {{ confirmationBtn }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>