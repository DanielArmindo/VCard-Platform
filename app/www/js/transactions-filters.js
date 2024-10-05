document.getElementById("btn-close").addEventListener("click", function () {
    sendParams()
});

document.getElementById("btn-apply").addEventListener("click", function () {
    sendParams()
});

document.getElementById('inputDataInicio').addEventListener('blur', validateDate, false);
document.getElementById('inputDataFim').addEventListener('blur', validateDate, false);

document.getElementById("btn-reset").addEventListener("click", function () {
    document.getElementById('selectSort').value = 'DDESC';
    document.getElementById('selectType').value = '';
    document.getElementById('inputEntidade').value = '';
    document.getElementById('inputDataInicio').value = '';
    document.getElementById('inputDataFim').value = '';
});

document.addEventListener("deviceready", function () {
    var params = new URLSearchParams(window.location.search);
    var sort = params.get('sort') || 'DDESC';
    var type = params.get('type') || '';
    var entity = params.get('entity') || '';
    var startDate = params.get('startDate') || '';
    var endDate = params.get('endDate') || '';

    document.getElementById('selectSort').value = sort;
    document.getElementById('selectType').value = type;
    document.getElementById('inputEntidade').value = entity;
    document.getElementById('inputDataInicio').value = startDate;
    document.getElementById('inputDataFim').value = endDate;
}, false);


function sendParams() {
    if (!validateDate()) {
        return;
    }

    let sort = document.getElementById('selectSort').value;
    let type = document.getElementById('selectType').value;
    let entity = document.getElementById('inputEntidade').value;
    let startDate = document.getElementById('inputDataInicio').value;
    let endDate = document.getElementById('inputDataFim').value;

    window.location.replace(`transactions.html?type=${type}&sort=${sort}&startDate=${startDate}&endDate=${endDate}&entity=${entity}`);
}

function validateDate() {
    var errorMessage = document.getElementById('error-message');

    if (document.getElementById('inputDataInicio').value != '' && document.getElementById('inputDataFim').value != '' &&
        document.getElementById('inputDataInicio').value > document.getElementById('inputDataFim').value) {
        errorMessage.innerHTML = 'O campo da data fim deve ser uma data posterior à data de início.';
        return false;
    }

    errorMessage.innerHTML = '';
    return true;
}