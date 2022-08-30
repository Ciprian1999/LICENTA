/* JS pentru galeria de produse*/
const ProductImg = document.getElementById("ProductImg");
const SmallImg = document.getElementsByClassName("small-img");
const price = document.querySelector('#price')?.textContent?.replace(' lei', '');
const quantity = document.querySelector('#quantity');
const prodName = document.querySelector('#name')?.textContent;
SmallImg[0].onclick = function () {
    ProductImg.src = SmallImg[0].src;
};
SmallImg[1].onclick = function () {
    ProductImg.src = SmallImg[1].src;
};
SmallImg[2].onclick = function () {
    ProductImg.src = SmallImg[2].src;
};

SmallImg[3].onclick = function () {
    ProductImg.src = SmallImg[3].src;
};

/*Adauga produse in cos*/
function addToCartClicked(event) {
    const cart = localStorage.getItem('cart') ?? '';
    cart.includes(prodName + '~' + price)
        ? alert('Produsul este deja in cos!')
        : localStorage.setItem('cart', ((cart && cart + ';') + prodName + '~' + price + ' lei' + '~' + quantity.value).toLowerCase());
    calculateCartItems();
}

function calculateCartItems() {
    document.getElementById('cartIcon').textContent = localStorage.getItem('cart') ? localStorage.getItem('cart').split(';').length : 0;
};

window.onload = () => {
    calculateCartItems();
};