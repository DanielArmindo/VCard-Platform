document.getElementById('btnBack').addEventListener('click', function () {
    window.location.replace('contactos.html');
}, false);

document.getElementById('phoneNumber').addEventListener('blur', validatePhoneNumber, false);

document.getElementById('btnCriarEContinuar').addEventListener('click', function () {

    if (!validatePhoneNumber()) {
        return;
    }

    var contact = navigator.contacts.create();
    contact.displayName = document.getElementById('name').value;
    contact.phoneNumbers = [new ContactField('mobile', "+351 " + formatPhoneNumber(document.getElementById('phoneNumber').value), true)];
    contact.save(function () {
        var phoneNumber = encodeURIComponent(contact.phoneNumbers[0].value);
        var contactName = encodeURIComponent(contact.displayName);
        window.location.replace(`sendMoney.html?phone=${phoneNumber}&contactname=${contactName}&showMessage=true`);
        showToastMessage('Contacto criado com sucesso!', color.success, color.light);
    }, function (error) {
        showToastMessage('Erro ao criar contacto!', color.danger, color.light);
    });

}, false);

function formatPhoneNumber(phoneNumber) {
    if (phoneNumber.length !== 9) {
        return phoneNumber;
    }

    const formattedNumber = phoneNumber.slice(0, 3) + " " + phoneNumber.slice(3, 6) + " " + phoneNumber.slice(6);
    return formattedNumber;
}

function validatePhoneNumber() {
    var errorMessage = document.getElementById('error-message');

    if (containNonNumeric(document.getElementById('phoneNumber').value)) {
        errorMessage.innerHTML = 'O número de telemóvel não pode conter caractéres não numéricos.';
        return false;
    }

    if (document.getElementById('phoneNumber').value[0] != '9' && document.getElementById('phoneNumber').value.length > 0) {
        errorMessage.innerHTML = 'O número de telemóvel deve começar por 9.';
        return false;
    }

    if (document.getElementById('phoneNumber').value.length != 9) {
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