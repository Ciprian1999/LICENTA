/*Adauga produse in cos*/
const rightArrow = document.querySelector('#rightArrow');
const leftArrow = document.querySelector('#leftArrow');

function addToCartClicked(event) {
    const button = event.target;
    const shopItem = button.parentElement.parentElement;
    const title = shopItem.getElementsByClassName('product-name')[0].innerText;
    const price = shopItem.getElementsByTagName('h6')[0].innerText;
    const cart = localStorage.getItem('cart') ?? '';
    cart.includes((title + '~' + price).toLowerCase())
        ? alert('Produsul este deja in cos!')
        : localStorage.setItem('cart', ((cart && cart + ';') + title + '~' + price + '~' + '1').toLowerCase());
    calculateCartItems();
}

fetch(`/products/data?skip=${new URLSearchParams(document.location.search).get('skip')}`,)
    .then(response => response.json())
    .then(data => {
        for (let i of data) {
            //Create Card
            let card = document.createElement("div");
            //Card should have category and should stay hidden initially
            card.classList.add("card", i.category, "hide");
            //image div
            let imgContainer = document.createElement("div");
            imgContainer.classList.add("image-container");
            //img tag
            let image = document.createElement("img");
            let link = document.createElement("a");
            link.setAttribute("href", `/produse/${i.name}`);
            image.setAttribute("src", `images/${i.name}/${i.name}-poza main.png`);
            link.appendChild(image);
            imgContainer.appendChild(link);
            card.appendChild(imgContainer);
            //container
            let container = document.createElement("div");
            container.classList.add("container");
            //product name
            let name = document.createElement("h5");
            name.classList.add("product-name");
            name.innerText = i.name.toUpperCase();
            container.appendChild(name);
            //price
            let price = document.createElement("h6");
            price.innerText = i.price + " lei";
            container.appendChild(price);
            card.appendChild(container);
            //button
            let btn = document.createElement("buttonprod");
            btn.innerText = "Adaugă in coș";
            container.appendChild(btn);
            btn.onclick = addToCartClicked;

            document.querySelector("#products").appendChild(card);
        }
        filterProduct("Toate");

        const params = new URLSearchParams(document.location.search);

        if (data.length === 9) {
            rightArrow.style.cursor = "pointer";
            rightArrow.style.opacity = '100%';

            rightArrow?.addEventListener('click', e => {
                if (params.has('skip')) {
                    let skip = params.get('skip');
                    skip = skip == 0 ? 9 : skip * 2;
                    window.location.href = `/products?skip=${skip}`;
                } else {
                    window.location.href = `/products?skip=9`;
                }
            });
        }
        if (+params.get('skip') > 0) {
            leftArrow.style.cursor = "pointer";
            leftArrow.style.opacity = '100%';

            leftArrow?.addEventListener('click', e => {
                if (params.has('skip')) {
                    let skip = params.get('skip');
                    skip = skip == 0 ? 0 : skip - 9;
                    window.location.href = `/products?skip=${skip}`;
                } else {
                    window.location.href = `/products?skip=9`;
                }
            });
        }
    });


function calculateCartItems() {
    document.getElementById('cartIcon').textContent = localStorage.getItem('cart') ? localStorage.getItem('cart').split(';').length : 0;
};

//parameter passed from button (Parameter same as category)
function filterProduct(value) {
    //Button class code
    let buttons = document.querySelectorAll(".button-value");
    buttons.forEach((button) => {
        //check if value equals innerText
        if (value.toUpperCase() == button.innerText.toUpperCase()) {
            button.classList.add("active");
        } else {
            button.classList.remove("active");
        }
    });

    //select all cards
    let elements = document.querySelectorAll(".card");
    //loop through all cards
    elements.forEach((element) => {
        //display all cards on 'all' button click
        if (value == "Toate") {
            element.classList.remove("hide");
        } else {
            //Check if element contains category class
            if (element.classList.contains(value.toUpperCase())) {
                //display element based on category
                element.classList.remove("hide");
            } else {
                //hide other elements
                element.classList.add("hide");
            }
        }
    });
}

//Search button click
document.getElementById("search").addEventListener("click", () => {
    //initializations
    let searchInput = document.getElementById("search-input").value;
    let elements = document.querySelectorAll(".product-name");
    let cards = document.querySelectorAll(".card");

    //loop through all elements
    elements.forEach((element, produse) => {
        //check if text includes the search value
        if (element.innerText.includes(searchInput.toUpperCase())) {
            //display matching card
            cards[produse].classList.remove("hide");
        } else {
            //hide others
            cards[produse].classList.add("hide");
        }
    });
});

//Initially display all products
window.onload = () => {
    filterProduct("Toate");
    calculateCartItems();
};
