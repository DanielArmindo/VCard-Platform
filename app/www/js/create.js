var btnNext = document.getElementById('btnNext');
var btnBack = document.getElementById('btnBack');
var inputPassword = document.getElementById('password');
var inputPin = document.getElementById('pin');

document.addEventListener('DOMContentLoaded', function () { });
btnNext.addEventListener('click', create, false);
btnBack.addEventListener('click', back, false);
inputPassword.addEventListener('blur', validatePassword, false);
inputPin.addEventListener('blur', validatePin, false);

async function create() {
    if (!validatePassword() || !validatePin()) {
        return;
    }

    // Get the user's phone number from localStorage
    var phoneNumber = localStorage.getItem('phoneNumber');

    if (await createVCard(phoneNumber, inputPassword.value, inputPin.value)) {
        window.localStorage.setItem("loggedIn", "true");
        window.location.href = 'menu.html';
    } else {
        showToastMessage('Não foi possível criar uma conta VCard com o número de telefone introduzido.', color.danger, color.light);
    }
}

function back() {
    // TODO
    window.location.href = 'checkPhoneNumber.html';
}

function validatePassword() {
    var errorMessage = document.getElementById('password-error-message');
    if (inputPassword.value.length < 8) {
        errorMessage.innerHTML = 'A password deve ter pelo menos 8 caracteres.';
        return false;
    }
    errorMessage.innerHTML = '&nbsp;'; //Manter o espaço para não desalinhar
    return true;
}

function validatePin() {
    var errorMessage = document.getElementById('pin-error-message');
    if (inputPin.value.length != 3) {
        errorMessage.innerHTML = 'O pin deve ter 3 dígitos.';
        return false;
    }

    if (containNonNumeric(inputPin.value)) {
        errorMessage.innerHTML = 'O pin deve conter apenas números.';
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