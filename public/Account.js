/*JS pentru toggle Form*/
const LoginForm = document.getElementById("LoginForm");
const RegForm = document.getElementById("RegForm");
const newPassForm = document.querySelector('#newPassForm');
const Indicator = document.getElementById("Indicator");
const regPass = document.querySelector('#regPass');
const regPassConfirm = document.querySelector('#regPassConfirm');
const newPass = document.querySelector('#newPass');
const newPassConfirm = document.querySelector('#newPassConfirm');
const newPassMessage = document.querySelector('#newPassMessage');
const regFormMessage = document.querySelector('#regFormMessage');
const loginMessage = document.querySelector('#loginMessage');

function register() {
    RegForm.style.transform = "translateX(0px)";
    LoginForm.style.transform = "translateX(0px)";
    Indicator.style.transform = "translateX(100px)";
}
function login() {
    RegForm.style.transform = "translateX(300px)";
    LoginForm.style.transform = "translateX(300px)";
    Indicator.style.transform = "translateX(0px)";
}

RegForm?.addEventListener('submit', e => {
    if (regPass.value !== regPassConfirm.value) {
        e.preventDefault();
        regFormMessage.style.color = 'red';
        regFormMessage.textContent = 'Parolele nu correspund!';
    } else {
        regFormMessage.style.color = 'green';
        regFormMessage.textContent = 'Inregistrare cu succes!';
        setTimeout(() => { }, 1000);
    }
});

newPassForm?.addEventListener('submit', e => {
    if (newPass.value !== newPassConfirm.value) {
        e.preventDefault();
        newPassMessage.style.color = 'red';
        newPassMessage.textContent = 'Parolele nu correspund!';
    } else {
        newPassMessage.style.color = 'green';
        newPassMessage.textContent = 'Parola a fost schimbata cu succes!';
        setTimeout(() => { }, 1000);
    }
});

LoginForm?.addEventListener('submit', e => {
    e.preventDefault();
    fetch('/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: document.querySelector('#loginEmail')?.value,
            password: document.querySelector('#loginPass')?.value,
            rememberMe: document.querySelector('#check')?.checked
        })
    }).then(response => {
        if (response.status === 200) {
            loginMessage.style.color = "green";
            loginMessage.textContent = 'Logat cu succes!';
            setTimeout(() => {
                window.location.href = '/';
            }, 1000);
        } else {
            loginMessage.style.color = 'red';
            loginMessage.textContent = 'Parola gresita!';
        }
    });
});

document.cookie.includes('Authorization') && (window.location.href = '/');