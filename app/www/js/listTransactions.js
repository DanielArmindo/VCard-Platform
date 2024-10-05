var TransactionsList = document.getElementById('transaction-list');
var transacoes = document.getElementById('transacoes');
var page = 1
var totalPages = 0
var sort = null
var type = null
var entity = null
var startDate = null
var endDate = null

document.getElementById('prevBtn').addEventListener('click', function () {
    window.location.replace("menu.html");
});

document.getElementById('openFilterMenu').addEventListener('click', function () {
    window.location.replace(`transactions-filters.html?type=${type}&sort=${sort}&startDate=${startDate}&endDate=${endDate}&entity=${entity}`)
});

document.addEventListener("deviceready", function () {

    var params = new URLSearchParams(window.location.search);;
    sort = params.get('sort') || 'DDESC';
    type = params.get('type') || '';
    entity = params.get('entity') || '';
    startDate = params.get('startDate') || '';
    endDate = params.get('endDate') || '';

    getTransactions();
}, false);

var next = document.getElementById("next").addEventListener('click', function () {
    if (page < totalPages) {
        page = page + 1
        getTransactions();
    }
});

document.getElementById("previous").addEventListener('click', function () {
    if (page > 1) {
        page = page - 1;
        getTransactions();
    }
});

async function getTransactions() {
    var response = { data: null, msg: "" };

    response = await getListTransactions(page, type, sort, startDate, endDate, entity);


    if (response.msg != 'OK') {
        return;
    }

    totalPages = response.data.meta.last_page
    document.getElementById("numero-transacoes").innerHTML = response.data.meta.total + " resultados";
    document.getElementById("num-pagina").innerText = response.data.meta.current_page + '/' + response.data.meta.last_page;
    document.getElementById("paginate").classList.remove("d-none");
    showTransactions(response.data.data);
}

function showTransactions(transacoes) {
    TransactionsList.innerHTML = '';
    transacoes.forEach(function (transacao) {
        var transactionsItem = document.createElement('div');
        transactionsItem.id = 'entidade-transacao';
        transactionsItem.classList.add('m-3', 'p-3', 'parent-div', 'align-items-center', 'position-relative');
        transactionsItem.style.backgroundColor = '#333333';
        transactionsItem.style.borderRadius = '10px';
        if (transacao.type == "C") {
            transactionsItem.style.borderLeft = '10px solid #198754';
        }
        else {
            transactionsItem.style.borderLeft = '10px solid #c63442';
        }

        var divInfo = document.createElement('div');
        divInfo.classList.add('d-flex', 'justify-content-between', 'align-items-start', 'w-100', 'inner-div');

        var divInfo2 = document.createElement('div');
        divInfo2.classList.add('d-flex', 'justify-content-between', 'align-items-start', 'w-100', 'inner-div');

        var divInfo3 = document.createElement('div');
        divInfo3.classList.add('d-flex', 'justify-content-between', 'align-items-start', 'w-100', 'inner-div');

        var nome = document.createElement('span')
        nome.id = 'entidade-transacao';
        nome.classList.add('text-white', 'custom-text-font');

        if (transacao.payment_name == null && transacao.type == "C") {
            nome.innerText = "De: " + transacao.payment_reference
        } else if (transacao.payment_name != null && transacao.type == "C") {
            nome.innerText = transacao.payment_name <= 20 ? "De: " + transacao.payment_name : "De: " + transacao.payment_name.substring(0, 25) + "...";
        } else if (transacao.payment_name == null && transacao.type != "C") {
            nome.innerText = "Para: " + transacao.payment_reference
        } else if (transacao.payment_name != null && transacao.type != "C") {
            nome.innerText = transacao.payment_name.lenght <= 20 ? "Para: " + transacao.payment_name : "Para: " + transacao.payment_name.substring(0, 25) + "...";
        }

        var valor = document.createElement('span')
        valor.id = 'valor-transacao';
        if (transacao.type == "C") {
            valor.classList.add('text-success', 'custom-text-font');
            valor.innerText = "+" + transacao.value + " €";
        }
        else {
            valor.classList.add('text-danger', 'custom-text-font');
            valor.innerText = "-" + transacao.value + " €";
        }

        var data = document.createElement('span')
        data.id = 'data-transacao';
        data.classList.add('text-light', 'custom-text-font');
        data.innerText = transacao.date

        var saldo = document.createElement('span')
        saldo.id = 'saldo-transacao';
        saldo.classList.add('text-light', 'custom-text-font');
        saldo.innerText = "Saldo: " + transacao.new_balance + " €";

        transactionsItem.appendChild(divInfo)
        transactionsItem.appendChild(divInfo2)
        transactionsItem.appendChild(divInfo3)

        divInfo.appendChild(nome)
        divInfo2.appendChild(saldo)
        divInfo2.appendChild(valor)
        divInfo3.appendChild(data)

        TransactionsList.appendChild(transactionsItem);
    });
}