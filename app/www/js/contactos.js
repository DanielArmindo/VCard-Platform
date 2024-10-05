//response.data.phone_numbers

document.addEventListener("deviceready", function () {
    var fields = ['displayName', 'phoneNumbers', 'photos'];
    var contactsList = document.getElementById('contacts-list');

    navigator.contacts.find(fields, function (contacts) {
        var filteredContacts = contacts.filter(function (contact) {
            if (contact.phoneNumbers && contact.phoneNumbers.length > 0) {
                var phoneNumber = contact.phoneNumbers[0].value.replace('+351', '').replace(/\s/g, '');
                return (
                    phoneNumber.length == 9 && phoneNumber.startsWith('9')
                );
            }
            return false;
        });

        if (filteredContacts.length == 0) {
            document.getElementById('no-contacts-message').classList.remove("d-none");
            return;
        }

        document.getElementById('no-contacts-message').classList.add("d-none");
        isPhoneNumberAssociated(filteredContacts.map(contact => contact.phoneNumbers[0].value.replace('+351', '').replace(/\s/g, '')), true).then(function (result) {
            let associatedPhoneNumbers = result.data.phone_numbers;

            document.getElementById('number-of-vcard-contacts').innerHTML = associatedPhoneNumbers.length;

            filteredContacts.forEach(function (contact) {
                var contactItem = document.createElement('li');
                contactItem.classList.add('list-group-item', 'border-0', 'd-flex', 'justify-content-between', 'align-items-center', 'p-0', 'mb-3', 'bg-transparent', 'text-white');

                var divPhoto = document.createElement('div');
                divPhoto.classList.add('rounded-circle', 'float-start', 'bg-secondary', 'text-center', 'align-items-center');
                divPhoto.style.fontSize = '25px';
                divPhoto.style.width = '40px';
                divPhoto.style.height = '40px';
                divPhoto.style.marginRight = '5px';

                var spanFirstLetter = document.createElement('span');

                if (contact.displayName) {
                    spanFirstLetter.innerText = contact.displayName.charAt(0).toUpperCase();
                } else {
                    spanFirstLetter.innerText = 'S';
                }

                var divInfo = document.createElement('div');
                divInfo.classList.add('ms-3', 'me-auto', 'text-start');

                var divName = document.createElement('div');
                divName.classList.add('fw-bold');
                divName.innerText = contact.displayName || 'Sem nome';

                var divPhone = document.createElement('div');
                divPhone.classList.add('text-secondary', 'custom-text-font');
                divPhone.innerText = formatNumber(contact.phoneNumbers[0].value);

                divPhoto.appendChild(spanFirstLetter);

                divInfo.appendChild(divName);
                divInfo.appendChild(divPhone);

                contactItem.appendChild(divPhoto);
                contactItem.appendChild(divInfo);

                if (associatedPhoneNumbers.includes(contact.phoneNumbers[0].value.replace('+351', '').replace(/\s/g, ''))) {
                    let divAssociated = document.createElement('div');
                    divAssociated.classList.add('text-primary');
                    divAssociated.innerText = 'VCARD';
                    contactItem.appendChild(divAssociated);
                }

                contactsList.appendChild(contactItem);
            });
        }, function (error) { });

        contactsList.addEventListener('click', function (event) {
            if (!event.target.closest('li')) return;
            var phoneNumber = encodeURIComponent(event.target.closest('li').querySelectorAll('div')[3].innerText);
            var contactName = encodeURIComponent(event.target.closest('li').querySelectorAll('div')[2].innerText);
            window.location.replace(`sendMoney.html?phone=${phoneNumber}&contactname=${contactName}`);
        });

    });
}, false);


function formatNumber(number) {
    number = number.replace(/\s/g, '');
    number = number.slice(-9);
    number = "+351 " + number.slice(0, 3) + " " + number.slice(3, 6) + " " + number.slice(6);
    return number;
}


document.getElementById('btn-novo-contacto').addEventListener('click', function () {
    window.location.replace('newcontact.html');
}, false);

document.getElementById('btn-enviar-contacto').addEventListener('click', function () {
    window.location.replace('sendMoneyPhoneNumber.html');
}, false);



document.getElementById('prevBtn').addEventListener('click', function () {
    window.location.replace('menu.html');
}, false);