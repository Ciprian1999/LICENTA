const rightArrow = document.querySelector('#rightArrow');
const leftArrow = document.querySelector('#leftArrow');

let receipts = '';
let index = 0;

fetch('/users/receipts', {
    method: 'GET',
}).then(response => response.json())
    .then(data => {
        receipts = data;
        if (receipts.length > 0) {
            displayReceipt(receipts[0]);
            if (receipts.length > 1) {
                rightArrow.style.cursor = "pointer";
                rightArrow.style.opacity = '100%';
            }
        }
    });

function displayReceipt(receipt) {
    const products = receipt && receipt?.split(';');
    const productDiv = document.getElementsByClassName('cart-items');
    productDiv[0].innerHTML = "";
    const totalPriceSpan = document.getElementsByClassName('cart-total-price');
    totalPriceSpan[0].textContent = '';
    let total = 0;
    for (const product of products) {
        const [name, price, quantity] = product.split('~');
        total += (price.replace(' lei', '') * quantity);
        const html = `
        <div class="cart-row">
            <div class="cart-item cart-column">
                <img class="cart-item-image" src="images/${name}/${name}-poza main.png" width="100" height="100">
                <span class="cart-item-title" style="text-transform: uppercase;">${name}</span>
            </div>
            <span class="cart-price cart-column">${price}</span>
            <div class="cart-quantity cart-column">
                <span class="cart-quantity-input">${quantity}</span>
            </div>
        </div>
        `;
        totalPriceSpan[0].textContent = Math.round(total * 100) / 100 + ' lei';
        productDiv[0].innerHTML += html;
    }
}

rightArrow?.addEventListener('click', _ => {
    if (receipts.length !== (index + 1)) {
        displayReceipt(receipts[++index]);
        leftArrow.style.opacity = '100%';
        leftArrow.style.cursor = 'pointer';
        if (receipts.length === (index + 1)) {
            rightArrow.style.opacity = '10%';
            rightArrow.style.cursor = '';
        }
    }
});

leftArrow?.addEventListener('click', _ => {
    if ((index - 1) >= 0) {
        displayReceipt(receipts[--index]);
        rightArrow.style.opacity = '100%';
        rightArrow.style.cursor = 'pointer';
        if (index === 0) {
            leftArrow.style.opacity = '10%';
            leftArrow.style.cursor = '';
        }
    }
});