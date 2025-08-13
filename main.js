document.addEventListener('DOMContentLoaded', function () {
    const bookSubmit = document.getElementById('bookSubmit');
    const inputBookForm = document.getElementById('inputBook');
    const searchSubmit = document.getElementById('searchSubmit');

    const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
    const completeBookshelfList = document.getElementById('completeBookshelfList');

    const books = JSON.parse(localStorage.getItem('books')) || [];

    const RENDER_EVENT = 'render-books';

    function saveBooks() {
        localStorage.setItem('books', JSON.stringify(books));
    }

    function generateBookElement(book) {
        const bookElement = document.createElement('article');
        bookElement.classList.add('book_item');

        const bookTitle = document.createElement('h3');
        bookTitle.innerText = book.title;
        const bookAuthor = document.createElement('p');
        bookAuthor.innerText = `Penulis: ${book.author}`;
        const bookYear = document.createElement('p');
        bookYear.innerText = `Tahun: ${book.year}`;

        const actionContainer = document.createElement('div');
        actionContainer.classList.add('action');

        const toggleReadButton = document.createElement('button');
        toggleReadButton.classList.add('green');
        toggleReadButton.innerText = book.isComplete ? 'Belum selesai dibaca' : 'Selesai dibaca';
        toggleReadButton.addEventListener('click', function () {
            book.isComplete = !book.isComplete;
            saveBooks();
            renderBooks();
        });

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('red');
        deleteButton.innerText = 'Hapus buku';
        deleteButton.addEventListener('click', function () {
            const index = books.indexOf(book);
            books.splice(index, 1);
            saveBooks();
            renderBooks();
        });

        actionContainer.appendChild(toggleReadButton);
        actionContainer.appendChild(deleteButton);

        bookElement.appendChild(bookTitle);
        bookElement.appendChild(bookAuthor);
        bookElement.appendChild(bookYear);
        bookElement.appendChild(actionContainer);

        return bookElement;
    }

    function renderBooks(filteredBooks = books) {
        incompleteBookshelfList.innerHTML = '';
        completeBookshelfList.innerHTML = '';

        filteredBooks.forEach(book => {
            const bookElement = generateBookElement(book);
            if (book.isComplete) {
                completeBookshelfList.appendChild(bookElement);
            } else {
                incompleteBookshelfList.appendChild(bookElement);
            }
        });
    }

    inputBookForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const bookTitle = document.getElementById('inputBookTitle').value;
        const bookAuthor = document.getElementById('inputBookAuthor').value;
        const bookYear = document.getElementById('inputBookYear').value;
        const bookIsComplete = document.getElementById('inputBookIsComplete').checked;

        const newBook = {
            id: +new Date(),
            title: bookTitle,
            author: bookAuthor,
            year: parseInt(bookYear),
            isComplete: bookIsComplete
        };

        books.push(newBook);
        saveBooks();
        renderBooks();
        inputBookForm.reset();
    });

    searchSubmit.addEventListener('click', function (event) {
        event.preventDefault();

        const searchBookTitle = document.getElementById('searchBookTitle').value.toLowerCase();

        if (searchBookTitle === '') {
            renderBooks();
        } else {
            const filteredBooks = books.filter(function (book) {
                return book.title.toLowerCase().includes(searchBookTitle);
            });

            renderBooks(filteredBooks);
        }
    });

    document.addEventListener(RENDER_EVENT, (event) => {
        const { searchQuery } = event.detail;
        renderBooks(searchQuery);
    });

    renderBooks();
});
