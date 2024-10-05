const elForm = document.querySelector('.js-form');
const elNameInput = document.querySelector('.js-name-input');
const elSurnameInput = document.querySelector('.js-surname-input');
const elEmailInput = document.querySelector('.js-email-input');
const elPasswordInput = document.querySelector('.js-password-input');

let getUser = window.localStorage.getItem('usersData') ? JSON.parse(window.localStorage.getItem('usersData')) : [];


const handleDataBase = (data) => {
    const userExists = getUser.some((item) => item.email === data[0].email && item.password === data[0].password);
    
    if (userExists) {
        alert('Bunday user mavjud');
    } else {
        getUser.push(data[0]); 
        window.localStorage.setItem('usersData', JSON.stringify(getUser));
        alert("User muvaffaqiyatli qo'shildi!");
        window.location.href = '/'
    }
};

const handleValidate = (name, surname, email, password) => {
    try {
        let validateName = name.value.trim();
        let validateSurname = surname.value.trim();
        let validateEmail = email.value.trim();
        let validatePassword = password.value.trim();

        if (!(validateName && validateSurname && validateEmail && validatePassword)) {
            console.error("Binal malumotni to'g'irla, xato");
            return alert('Make sure all inputs are filled !!');
        }

        const database = [
            {
                name: validateName,
                surname: validateSurname,
                email: validateEmail,
                password: validatePassword,
                userAgent: {
                    appCodeName: "Mozilla",
                    appName: "Netscape",
                    appVersion: "5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
                },
            },
        ];

        handleDataBase(database);

    } catch (error) {
        throw new Error(error.message);
    }
};


elForm.addEventListener('submit', (evt) => {
    evt.preventDefault();
    handleValidate(elNameInput, elSurnameInput, elEmailInput, elPasswordInput);
});



