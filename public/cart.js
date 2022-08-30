function removeItemFromCart(e) {
    const itemDiv = e.parentElement.parentElement;
    const product = itemDiv.getElementsByTagName('span')[0].textContent + '~' + itemDiv.getElementsByTagName('span')[1].textContent + '~' + itemDiv.getElementsByTagName('input')[0].value;
    const cart = localStorage.getItem('cart')?.replace(product, '') ?? '';
    localStorage.setItem('cart', cart.replace(/^;|;$/, '').replace(';;', ';'));
    itemDiv.remove();
    calculateTotal();
};

function calculateTotal() {
    const totalPriceSpan = document.getElementsByClassName('cart-total-price');
    const total = localStorage.getItem('cart')
        ? localStorage.getItem('cart').split(';').reduce((result, current) => {
            const [_, price, quantity] = current.split('~');
            return result + parseFloat(price.replace('.', '').replace(',', '.').replace(' lei', '')) * +quantity;
        }, 0)
        : 0;
    totalPriceSpan[0].textContent = Math.round(total * 100) / 100 + ' lei';
    total
        ? document.getElementById('buyBtn').disabled = false
        : document.getElementById('buyBtn').disabled = true;
    document.getElementById('cartIcon').textContent = localStorage.getItem('cart') ? localStorage.getItem('cart').split(';').length : 0;
};

function setQuantity(e) {
    const itemDiv = e.parentElement.parentElement;
    const product = itemDiv.getElementsByTagName('span')[0].textContent + '~' + itemDiv.getElementsByTagName('span')[1].textContent;
    const products = localStorage.getItem('cart')?.split(';');
    products[products.findIndex(item => item.includes(product))] = product + `~${e.value}`;
    localStorage.setItem('cart', products.join(';'));
    calculateTotal();
}


(() => {
    const cart = localStorage.getItem('cart');
    const products = cart && cart?.split(';');
    const productDiv = document.getElementsByClassName('cart-items');
    for (const product of products) {
        const [name, price, quantity] = product.split('~');
        const html = `
        <div class="cart-row">
            <div class="cart-item cart-column">
                <img class="cart-item-image" src="images/${name}/${name}-poza main.png" width="100" height="100">
                <span class="cart-item-title" style="text-transform: uppercase;">${name}</span>
            </div>
            <span class="cart-price cart-column">${price}</span>
            <div class="cart-quantity cart-column">
                <input class="cart-quantity-input" type="number" min=1 max=10 onchange="setQuantity(this)" value="${quantity}">
                <button class="btn btn-danger" type="button" onclick="removeItemFromCart(this)">ELIMINĂ</button>
            </div>
        </div>
        `;
        productDiv[0].insertAdjacentHTML('beforebegin', html);
    }
    calculateTotal();
})();
