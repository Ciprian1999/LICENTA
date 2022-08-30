document.querySelector('#payForm')?.addEventListener('submit', e => {
    e.preventDefault();
    fetch('/users/receipts', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            receipt: localStorage.getItem('cart')
        })
    }).then(response => {
        if (response.status === 200) {
            localStorage.removeItem('cart');
            alert('Multumim pentru cumparaturi!');
            window.location.href = '/';
        } else {
            alert('S-a intamplat o eroare!');
        }
    });
});

fetch('/users/data')
    .then(response => response.json())
    .then(data => {
        for (const key of Object.keys(data.address)) {
            document.querySelector(`#${key}`).value = data.address[key];
        }
        for (const key of Object.keys(data.card)) {
            document.querySelector(`#${key}`).value = data.card[key];
        }
    });