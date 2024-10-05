const baseUrl = 'http://server_url/api'

async function isPhoneNumberAssociated(phoneNumber, retrieveData = false) {
    const url = `${baseUrl}/vcards/verify-phone-numbers?phone_numbers=${phoneNumber}`;
    const options = { method: "GET", responseType: 'json' };

    try {
        const response = await new Promise((resolve, reject) => {
            cordova.plugin.http.sendRequest(url, options, resolve, reject);
        });

        if (retrieveData)
            return { data: response.data, msg: "OK" };
        else
            return response.data.phone_numbers.length > 0 ? true : false;

    } catch (error) {
        return false
    }
}

async function loginVCard(password, phoneNumber) {
    const url = `${baseUrl}/auth/login`;
    const options = {
        method: "POST",
        responseType: 'json',
        data: {
            username: phoneNumber,
            password: password
        },
    };

    try {
        const response = await new Promise((resolve, reject) => {
            cordova.plugin.http.sendRequest(url, options, resolve, reject);
        });
        localStorage.setItem('access_token', response.data.access_token);
        return true;
    } catch (error) {
        return false;
    }
}

async function getUser() {
    const url = `${baseUrl}/users/me`;
    const options = {
        method: "GET",
        responseType: 'json',
        headers: {
            Authorization:
                "Bearer " + localStorage.getItem("access_token"),
            "Content-Type": "application/json",
        },
    }

    try {
        const response = await new Promise((resolve, reject) => {
            cordova.plugin.http.sendRequest(url, options, resolve, reject)
        });
        return { data: response.data.data, msg: "OK" };
    } catch (error) {
        return { data: null, msg: "ERROR" };
    }
}

async function createVCard(phoneNumber, password, pin, email, username) {
    const url = `${baseUrl}/vcards`;
    const options = {
        method: "POST",
        data: {
            name: "pending",
            password: password,
            confirmation_code: pin,
            email: "pending@email.com",
            phone_number: phoneNumber,
        }
    };

    try {
        const response = await new Promise((resolve, reject) => {
            cordova.plugin.http.sendRequest(url, options, resolve, reject);
        });

        if (await loginVCard(password, phoneNumber))
            return true;

    } catch (error) {
        return false;
    }
}

async function getVCard() {
    const phoneNumber = window.localStorage.getItem("phoneNumber");
    const url = `${baseUrl}/vcards/${phoneNumber}`;
    const options = {
        method: "GET",
        responseType: 'json',
        headers: {
            Authorization:
                "Bearer " + localStorage.getItem("access_token"),
            "Content-Type": "application/json",
        },
    };

    try {
        const response = await new Promise((resolve, reject) => {
            cordova.plugin.http.sendRequest(url, options, resolve, reject);
        });
        return { data: response.data, msg: "OK" };
    } catch (error) {
        return { data: null, msg: "ERROR" };
    }
}

async function getLastTransaction() {
    const phoneNumber = window.localStorage.getItem("phoneNumber");
    const url = `${baseUrl}/vcards/${phoneNumber}/transactions/last`;
    const options = {
        method: "GET",
        responseType: 'json',
        headers: {
            Authorization:
                "Bearer " + localStorage.getItem("access_token"),
            "Content-Type": "application/json",
        },
    };

    try {
        const response = await new Promise((resolve, reject) => {
            cordova.plugin.http.sendRequest(url, options, resolve, reject);
        });
        return { data: response.data, msg: "OK" };
    } catch (error) {
        return { data: null, msg: error };
    }
}

async function getListTransactions(page = 1, type, sort, startDate, endDate, entity) {

    const phoneNumber = window.localStorage.getItem("phoneNumber");
    const url = `${baseUrl}/vcards/${phoneNumber}/transactions?page=${page}&type=${type}&sort=${sort}&start_date=${startDate}&end_date=${endDate}&payment_reference=${entity}`;
    const options = {
        method: "GET",
        responseType: 'json',
        headers: {
            Authorization:
                "Bearer " + localStorage.getItem("access_token"),
            "Content-Type": "application/json",
        },
    };

    console.log(url);

    try {
        const response = await new Promise((resolve, reject) => {
            cordova.plugin.http.sendRequest(url, options, resolve, reject);
        });
        console.log(response);
        console.log(response.data);
        return { data: response.data, msg: "OK" };
    } catch (error) {
        console.log(error);
        return { data: null, msg: error };
    }
}

async function trasaction(type, receiver, value, confirmation_code, description) {
    const url = `${baseUrl}/transactions/debit`;
    const options = {
        method: "POST",
        responseType: 'json',
        data: {
            payment_type: type,
            payment_reference: receiver,
            value: value,
            confirmation_code: confirmation_code,
            description: description
        },
        headers: {
            Authorization:
                "Bearer " + localStorage.getItem("access_token"),
        },
    };

    try {
        const response = await new Promise((resolve, reject) => {
            cordova.plugin.http.sendRequest(url, options, resolve, reject);
        });
        if (response.data == 401 || response.data == 404) {
            return { data: null, status: response.data };
        }
        return { data: response.data, msg: "OK" };
    } catch (error) {
        let msgError = JSON.parse(error.error).message;
        let msgStatus = error.status;
        return { data: null, msg: msgError, status: msgStatus };
    }
}

async function getSavingsInPiggyBank() {
    const phoneNumber = window.localStorage.getItem("phoneNumber");
    const url = `${baseUrl}/vcards/${phoneNumber}/piggybank`;
    const options = {
        method: "GET",
        responseType: 'json',
        headers: {
            Authorization:
                "Bearer " + localStorage.getItem("access_token"),
            "Content-Type": "application/json",
        },
    };

    try {
        const response = await new Promise((resolve, reject) => {
            cordova.plugin.http.sendRequest(url, options, resolve, reject);
        });
        return { data: response.data, msg: "OK" };
    } catch (error) {
        return { data: null, msg: error };
    }
}

async function updateSavingsInPiggyBank(value, type) {
    const phoneNumber = window.localStorage.getItem("phoneNumber");
    var url = `${baseUrl}/vcards/${phoneNumber}/piggybank`;

    if (type == "debit") {
        url += "/debit";
    } else if (type == "credit") {
        url += "/credit";
    }

    const options = {
        method: 'PATCH',
        responseType: 'json',
        data: {
            value: value
        },
        headers: {
            Authorization:
                "Bearer " + localStorage.getItem("access_token")
        },
    };

    try {
        const response = await new Promise((resolve, reject) => {
            cordova.plugin.http.sendRequest(url, options, resolve, reject);
        });
        return { data: response.data, msg: "OK" };
    } catch (error) {
        let msgError = JSON.parse(error.error).message;
        let msgStatus = error.status;
        return { data: null, msg: msgError || null, status: msgStatus };
    }
}

async function getPiggyBankSpareChangeStatus() {
    const phoneNumber = window.localStorage.getItem("phoneNumber");
    const url = `${baseUrl}/vcards/${phoneNumber}/piggybank`;
    const options = {
        method: "GET",
        responseType: 'json',
        headers: {
            Authorization:
                "Bearer " + localStorage.getItem("access_token"),
            "Content-Type": "application/json",
        },
    };

    try {
        const response = await new Promise((resolve, reject) => {
            cordova.plugin.http.sendRequest(url, options, resolve, reject);
        });
        return { data: response.data, msg: "OK" };
    } catch (error) {
        return { data: null, msg: error };
    }
}

async function updatePiggyBankSpareChangeStatus(value) {
    const phoneNumber = window.localStorage.getItem("phoneNumber");
    var url = `${baseUrl}/vcards/${phoneNumber}/piggybank/sparechange`;
    const options = {
        method: 'PATCH',
        responseType: 'json',
        data: {
            spare_change: value
        },
        headers: {
            Authorization:
                "Bearer " + localStorage.getItem("access_token"),
            "Content-Type": "application/json",
        },
    };

    try {
        const response = await new Promise((resolve, reject) => {
            cordova.plugin.http.sendRequest(url, options, resolve, reject);
        });
        return { data: response.data, msg: response.data.message, status: response.status };
    } catch (error) {
        let msgError = JSON.parse(error.error).message;
        let msgStatus = error.status;
        return { data: null, msg: msgError || null, status: msgStatus };
    }
}

async function logout() {
    const url = `${baseUrl}/logout`;
    const options = {
        method: "POST",
        responseType: 'json',
        data: {},
        headers: {
            Authorization:
                "Bearer " + localStorage.getItem("access_token"),
            "Content-Type": "application/json",
        },
    };

    try {
        const response = await new Promise((resolve, reject) => {
            cordova.plugin.http.sendRequest(url, options, resolve, reject);
        });
        window.localStorage.clear();
        return { data: response.data, msg: "OK" };
    } catch (error) {
        return { data: null, msg: error };
    }
}

async function deleteVcard(password, confirmation_code) {
    const phoneNumber = localStorage.getItem("phoneNumber");
    const url = `${baseUrl}/vcards/${phoneNumber}/delete`;

    const options = {
        method: "POST",
        responseType: "json",
        data: {
            password: password,
            confirmation_code: confirmation_code
        },
        headers: {
            Authorization: "Bearer " + localStorage.getItem("access_token")
        },
    }

    try {
        const response = await new Promise((resolve, reject) => {
            cordova.plugin.http.sendRequest(url, options, resolve, reject)
        });
        return { data: response.data, msg: response.message, status: response.status };
    } catch (error) {
        let msgError = JSON.parse(error.error).message;
        let msgStatus = error.status;
        return { data: null, msg: msgError || null, status: msgStatus };
    }
}

async function getNameVcard(phoneNumber) {
    const url = `${baseUrl}/vcards/${phoneNumber}/name`;
    const options = {
        method: "GET",
        responseType: 'json',
        headers: {
            Authorization:
                "Bearer " + localStorage.getItem("access_token"),
            "Content-Type": "application/json",
        },
    };
    try {
        const response = await new Promise((resolve, reject) => {
            cordova.plugin.http.sendRequest(url, options, resolve, reject);
        });
        return { data: response.data, msg: "OK", status: response.status };
    } catch (error) {
        return { data: null, msg: error, status: error.status };
    }
}