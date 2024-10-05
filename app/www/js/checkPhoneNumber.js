var btn = document.getElementById('btn');
var inputPhoneNumber = document.getElementById('phoneNumber');
var params = new URLSearchParams(window.location.search);


document.addEventListener('DOMContentLoaded', function () {
    var showDeletedMessage = params.get('showDeletedMessage');

    if (showDeletedMessage == 'true')
        showToastMessage('Conta eliminada com sucesso!', color.info, color.light);
    
     fillPhoneNumberField();
});
btn.addEventListener('click', checkPhoneNumber, false);
inputPhoneNumber.addEventListener('blur', validatePhoneNumber, false);


function fillPhoneNumberField() {
    var phoneNumber = localStorage.getItem('phoneNumber');
    if (phoneNumber !== null) {
        document.getElementById('phoneNumber').value = phoneNumber;
    }
}

async function checkPhoneNumber() {
    if (!validatePhoneNumber()) {
        return;
    }

    /* Verifica se o número de telemóvel existe na base de dados, se existir, 
    então vai para a página de login senão vai para a página de criação da conta */
    if (await isPhoneNumberAssociated(inputPhoneNumber.value)) {
        window.location.href = 'access.html';
    } else {
        window.location.href = 'create.html';
    }
    

    localStorage.setItem('phoneNumber', document.getElementById('phoneNumber').value);
}


function validatePhoneNumber() {
    var errorMessage = document.getElementById('error-message');

    if (containNonNumeric(inputPhoneNumber.value)) {
        errorMessage.innerHTML = 'O número de telemóvel não pode conter caractéres não numéricos.';
        return false;
    }

    if (inputPhoneNumber.value[0] != '9' && inputPhoneNumber.value.length > 0) {
        errorMessage.innerHTML = 'O número de telemóvel deve começar por 9.';
        return false;
    }

    if (inputPhoneNumber.value.length != 9) {
        errorMessage.innerHTML = 'O número de telemóvel tem de ter 9 dígitos.';
        return false;
    }

    errorMessage.innerHTML = '';
    return true;
}

function containNonNumeric(inputString) {
    const nonNumericRegex = /[^0-9]/;
    return nonNumericRegex.test(inputString);
}

function showToastMessage(msg, bgColor, textColor){
    Toastify({
        text: msg,
        duration: 4000,
        position: "center",
        style: {
            color: textColor,
            background: bgColor,
            boxShadow: "0 0 10px " + bgColor,
        }
   }).showToast();
}

var color = {
    success: '#28a745', 
    danger: '#dc3545', 
    primary: '#007bff', 
    info: '#17a2b8',
    secondary: '#6c757d',
    warning: '#ffc107',
    light: '#f8f9fa',
    dark: '#343a40'
};