const elForm = document.querySelector('.js-form');
const elEmailInput = document.querySelector('.js-email-input');
const elPasswordInput = document.querySelector('.js-password-input');


let getUsers = window.localStorage.getItem('usersData') ? JSON.parse(window.localStorage.getItem('usersData')) : [];


const handleDataBase = (email, password, usersData) => {
    const user = usersData.find((item) => item.email === email && item.password === password);

    if (user) {
        
        alert(`Xush kelibsiz, ${user.name}!`);
        window.location.href = '/'; 
    } else {
        alert("Foydalanuvchi topilmadi, iltimos, ro'yxatdan o'ting!");
    }
};


const handleValidate = (email, password) => {
    try {
        let validateEmail = email.value.trim();
        let validatePassword = password.value.trim();


        if (!(validateEmail && validatePassword)) {
            console.error("Malumotni to'g'irla, xato");
            return alert("Iltimos, barcha maydonlarni to'ldiring!");
        }

        
        handleDataBase(validateEmail, validatePassword, getUsers);

    } catch (error) {
        throw new Error(error.message);
    }
};


elForm.addEventListener('submit', (evt) => {
    evt.preventDefault();
    handleValidate(elEmailInput, elPasswordInput);
});



