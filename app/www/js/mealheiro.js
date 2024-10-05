var mealheiroInput = document.getElementById('mealheiroInput');

mealheiroInput.addEventListener('blur', validateMoneyInput, false);

document.getElementById("prevBtn").addEventListener("click", function(){
    window.location.replace("menu.html");
});

document.getElementById("reforcarMealheiroBtn").addEventListener("click", function(){
    if(validateMoneyInput())
        updateSavings("credit");
});

document.getElementById("retirarMealheiroBtn").addEventListener("click", function(){
    if(validateMoneyInput())
        updateSavings("debit");
});


document.addEventListener("deviceready", function(){
    var params = new URLSearchParams(window.location.search);
    var showMessage = params.get('showMessage');
    var msg = params.get('msg');
    
    if(showMessage){
        if(msg != "null"){
            if(msg == "Mealheiro atualizado com sucesso!"){
                showToastMessage(msg, color.success, color.light);
            }  
            else{
                showToastMessage(msg, color.danger, color.light);
            }      
        }
        else{
            showToastMessage("Erro ao atualizar mealheiro!", color.danger, color.light);
        }          
    }

    getVCardInformation();
    getSavings();
}, false);


async function getVCardInformation() {
    var response = { data: null, msg: "" };
    
    response = await getVCard();

    if (response.msg == 'OK') 
        document.getElementById("saldo").innerHTML = Number(response.data.data.balance).toFixed(2) + " €";
    else 
        document.getElementById("saldo").innerHTML = "0.00 €";
}

async function getSavings(){
    var response = { data: null, msg: "" };
    
    response = await getSavingsInPiggyBank();

    if (response.msg == 'OK') 
        document.getElementById("mealheiro").innerHTML = Number(response.data.Mealheiro.balance).toFixed(2) + " €";
    else 
        document.getElementById("mealheiro").innerHTML = "0.00 €";

}

async function updateSavings(type){
    var response = { data: null, msg: "" };
    var value = mealheiroInput.value;

    response = await updateSavingsInPiggyBank(value, type);

    var msg = "";
    if (response.msg == 'OK') 
        msg = "Mealheiro atualizado com sucesso!";
    else 
        msg = response.msg;
    
    window.location.replace(`mealheiro.html?showMessage=true&msg=${msg}`);
}

function validateMoneyInput() {
    var errorMessage = document.getElementById('error-message');
    var moneyInput = document.getElementById('mealheiroInput');

    if (containNonNumeric(moneyInput.value)) {
        errorMessage.innerHTML = 'O valor inserido não é numérico.';
        return false;
    }

    if (moneyInput.value <= 0 || moneyInput.value == '') {
        errorMessage.innerHTML = 'O valor deve ser um número maior que 0.';
        return false;
    }
    errorMessage.innerHTML = '';
    return true;
}

function containNonNumeric(inputString) {
    const nonNumericRegex = /^\d+(\.\d{0,2})?$/;
    return !nonNumericRegex.test(inputString);
}

function adjustWidth(input) {
    if (input.value.length > 7) {
        input.value = input.value.slice(0, 7);
        return;
    }

    if (containNonNumeric(input.value)) {
        input.value = input.value.slice(0, input.value.length - 1);
        return;
    }

    input.style.width = input.value.length + "ch";
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