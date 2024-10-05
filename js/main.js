books = books.map((item, idx) => {
    item["id"] = idx + 1;
    return item;
});

books = books.slice(0, 50);

const elList = document.querySelector('.js-list');
const elForm = document.querySelector('.js-Form');
const elTemplate = document.querySelector('.js-books-template').content;
const elCountriesSelect = document.querySelector('.js-country-select');
let elMinYear = document.querySelector('.js-min-year');
let elMaxYear = document.querySelector('.js-max-year');
let elSearchBooks = document.querySelector('.js-search-books');
let elSortSelect = document.querySelector('.js-sort-select');
let bookmarkCount = document.querySelector('.js-bookmark-count');
let elAlert = document.querySelector('.js-alert-box') ;
let bookmarkTemp = document.querySelector('.js-bookmark-template').content ;
let bookmarkRenderItem = document.querySelector('.bookmarkRender') ;


let bookmarkBooks = window.localStorage.getItem('bookmarkBook') ? JSON.parse(window.localStorage.getItem('bookmarkBook')) : [];
let user = window.localStorage.getItem('usersData') ? JSON.parse(window.localStorage.getItem('usersData')) : [] ;

function handleUser(user){
    if(user.length !== 0){
        
    }else{
        return window.location.href = '/register/register.html'
    };
}
handleUser(user)

const handleRenderBooks = (arr, regex = '') => {
    const docFragment = document.createDocumentFragment();
    elList.innerHTML = '';
    if (arr.length) {
        arr.forEach((book) => {
            let clone = elTemplate.cloneNode(true);
            if (regex && regex.source !== '(?:)') {
                let bookTitle = clone.querySelector('.js-book-name');
                if (book.title.split(' ').length > 1) {
                    let bookTitles = book.title.split(' ').slice(0, 1).join(' ').concat('. . .');
                    bookTitle.innerHTML = bookTitles.replaceAll(regex, (match) => {
                        return `<mark class='elementBook'>${match}</mark>`
                    })
                } else {
                    let titleBook = book.title.split(' ').slice(0, 1).join(' ').concat('. . .');
                    bookTitle.innerHTML = titleBook.replaceAll(regex, (match) => {
                        return `<mark class='elementBook'>${match}</mark>`;
                    })
                };

                clone.querySelector('.js-book-author').innerHTML = book.author.replaceAll(regex, (match) => {
                    return `<mark class='elementBook'>${match}</mark>`
                });
            } else {
                let bookTitle = clone.querySelector('.js-book-name');
                if (book.title.split(' ').length > 1) { bookTitle.textContent = book.title.split(' ').slice(0, 1).join(' ').concat('. . .') } else { bookTitle.textContent = book.title };
                clone.querySelector('.js-book-author').textContent = book.author;
            }
            clone.querySelector('.js-book-image').src = book.imageLink;
            clone.querySelector('.js-book-year').textContent = book.year;
            clone.querySelector('.js-book-pages').textContent = book.pages;
            clone.querySelector('.js-book-wiki').href = book.link;
            clone.querySelector('.js-book-country').textContent = book.country.split('/').join(', ');
            let bookId = clone.querySelector('.bookBookmark');
            bookId.dataset.id = book.id;

            if (bookmarkBooks.some((item) => item.id == book.id)) {
                bookId.classList.add('text-warning');
            } else {
                bookId.classList.remove('text-warning');
            }

            let bookLanguage = clone.querySelector('.js-book-language');
            if (book.language.split(' ').length > 1) { bookLanguage.textContent = book.language.split(' ').slice(0, 1).join(' ').concat('. . .') } else { bookLanguage.textContent = book.language };

            docFragment.append(clone);

            
        });

        elList.append(docFragment);
    } else {
        alert('books not defined')
        elMinYear.value = '';
        elMaxYear.value = '';
        handleRenderBooks(books);
    }
}

handleRenderBooks(books);


const handleFilterCountry = (book) => {
    let store = [];
    for (const bookCountry of book) {
        let countrys = bookCountry.country;
        if (!(store.includes(countrys))) {
            store.push(countrys);
        };
    }
    handleRenderOption(store);
}
handleFilterCountry(books);

function handleRenderOption(arr) {
    arr.forEach((countries) => {
        let newOption = document.createElement('option');
        newOption.value = countries;
        newOption.textContent = countries;
        elCountriesSelect.append(newOption);
    })
}

const handleSearchBooks = (regex, searchVal, sortedBooks) => {
    let filterBooks;
    let result = sortedBooks.filter((book) => {
        filterBooks = (searchVal == '' || book.title.split(' ').slice(0, 1).join(' ').concat('. . .').match(regex) || book.author.match(regex)) &&
            (elMinYear.value == '' || book.year > Number(elMinYear.value)) &&
            (elMaxYear.value == '' || book.year < Number(elMaxYear.value)) &&
            (elCountriesSelect.value == 'all' || book.country.includes(elCountriesSelect.value));

        return filterBooks;
    })
    return result;
}

let sortedBooksObj = {
    ['a-z']: function (a, b) {
        let bookCode = a.title.toLowerCase().charCodeAt(0);
        let bookCharCode = b.title.toLowerCase().charCodeAt(0);
        if (bookCode > bookCharCode) { return 1 } else { return -1 };
    },
    ['z-a']: function (a, b) {
        let bookCode = a.title.toLowerCase().charCodeAt(0);
        let bookCharCode = b.title.toLowerCase().charCodeAt(0);
        if (bookCode < bookCharCode) { return 1 } else { return -1 };
    },
    ['old-year']: function (a, b) {
        let bookCodeYear = new Date(a.year);
        let bookCharCodeYear = new Date(b.year);
        if (bookCodeYear > bookCharCodeYear) { return 1 } else { return -1 };
    },
    ['new-year']: function (a, b) {
        let bookCodeYear = new Date(a.year);
        let bookCharCodeYear = new Date(b.year);
        if (bookCodeYear < bookCharCodeYear) { return 1 } else { return -1 };
    },
};

function handleBookmarkDisplay() {
    if (bookmarkBooks.length === 0) {
        bookmarkCount.classList.add('d-none');
        handleRenderBookmark(bookmarkBooks)
    } else {
        bookmarkCount.classList.remove('d-none');
        bookmarkCount.textContent = bookmarkBooks.length;
        handleRenderBookmark(bookmarkBooks)
    }
}


function handleRenderBookmark(bookmarks){
    bookmarkRenderItem.innerHTML = '';
    if(bookmarks.length){
        
        let bookmarkDocFragment = document.createDocumentFragment() ;
        bookmarks.forEach((book) => {
            let bookmarkClone = bookmarkTemp.cloneNode(true) ;
            bookmarkClone.querySelector('.js-bookmark-img').src = book.imageLink ;
            let bookmarkTitle = bookmarkClone.querySelector('.js-bookmark-title') ;
            if (book.title.split(' ').length > 2) { bookmarkTitle.textContent = book.title.split(' ').slice(0, 2).join(' ').concat('. . .') } else { bookmarkTitle.textContent = book.title };
            bookmarkTemp.querySelector('.js-bookmark-link').href = book.link ;

           bookmarkDocFragment.append(bookmarkClone) ;
        });
        bookmarkRenderItem.append(bookmarkDocFragment) ;
    }
};
handleRenderBookmark(bookmarkBooks)

elList.addEventListener('click', (evt) => {
    if (evt.target.matches('.bookBookmark')) {
        let bookId = evt.target.dataset.id;
        let bookAdId = books.find((book) => book.id == bookId);
        
        if (!(bookmarkBooks.some((item) => item.id == bookId))) {
            bookmarkBooks.push(bookAdId);
            window.localStorage.setItem('bookmarkBook', JSON.stringify(bookmarkBooks));
            evt.target.classList.add('text-warning');
        } else {
            bookmarkBooks = bookmarkBooks.filter((item) => item.id != bookId);
            handleRenderBookmark(bookmarkBooks)
            window.localStorage.setItem('bookmarkBook', JSON.stringify(bookmarkBooks));
            evt.target.classList.remove('text-warning');
        }

        handleBookmarkDisplay();
    }
});

handleBookmarkDisplay();


elForm.addEventListener('submit', (evt) => {
    evt.preventDefault();
    let searchBooks = elSearchBooks.value.trim();
    let regex = new RegExp(searchBooks, 'gi');
    let sortedBooks = books;
    if (elSortSelect.value) {
        sortedBooks = books.sort(sortedBooksObj[elSortSelect.value])
    }
    let resultSearchBooks = handleSearchBooks(regex, searchBooks, sortedBooks);

    handleRenderBooks(resultSearchBooks, regex);
    let confirmPanel;
    if (elSearchBooks.value.trim() == 'login') { confirmPanel = confirm("Xurmatli Og'abek siz Login qilishni xoxlaysizmi ??"); window.location.reload() };
    if (confirmPanel == true) { window.location.href = '/login/login.html' } else { console.log('kirma kuyasan') };
});  











