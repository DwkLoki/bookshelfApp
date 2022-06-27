const books = [];
// const SAVED_EVENT = "saved-book";
const BOOKS_LOCAL_STORAGE = "BOOKSHELF_APP";

document.addEventListener("DOMContentLoaded", function() {
    const inputBookForm = document.getElementById("inputBook");

    inputBookForm.addEventListener("submit", function(event) {
        event.preventDefault();
        addBook();
        // console.log(books);
        // inisialisasi element completed and uncompleted bookshelf list
        const inCompleteBookshelfList = document.getElementById("incompleteBookshelfList");
        const completeBookshelfList = document.getElementById("completeBookshelfList");

        // memastikan element completed and uncompleted bookshelf list kosong, agar
        // tidak terjadi data duplikat saat data books dilooping
        inCompleteBookshelfList.innerHTML = "";
        completeBookshelfList.innerHTML = "";
        
        // looping semua data pada array books
        for(let bookItem of books){
            // console.log(bookItem);
            const newBookElement = generateBookElement(bookItem);
            if (bookItem.isCompleted === true) {
                completeBookshelfList.append(newBookElement);
            } else {
                inCompleteBookshelfList.append(newBookElement);
            }  
        }

        document.getElementById("inputBookTitle").value = null;
        document.getElementById("inputBookAuthor").value = null;
        document.getElementById("inputBookYear").value = null;
        document.getElementById("inputBookIsComplete").checked = false;
    });

    if(isStorageExist()){
        loadDataFromStorage();
    }
});

function addBook() {
    const bookId = +new Date();

    const bookTitle = document.getElementById("inputBookTitle").value;
    const bookAuthor = document.getElementById("inputBookAuthor").value;
    const bookYear = document.getElementById("inputBookYear").value;
    const bookIsComplete = document.getElementById("inputBookIsComplete").checked;

    const bookObject = generateBookObject(bookId, bookTitle, bookAuthor, bookYear, bookIsComplete);

    books.push(bookObject);
    saveData();
}

function generateBookObject(id, title, author, year, isCompleted) {
    return {
        id,
        title,
        author,
        year,
        isCompleted
    }
}

function generateBookElement(bookObject) {
    const bookTitleElement = document.createElement("h4");
    bookTitleElement.innerText = bookObject.title;

    const bookAuthorElement = document.createElement("p");
    bookAuthorElement.innerText = bookObject.author;

    const bookYearElement = document.createElement("p");
    bookYearElement.innerText = bookObject.year;

    const bookItemDesc = document.createElement("div");
    bookItemDesc.classList.add("book-item-desc");
    bookItemDesc.append(bookTitleElement, bookAuthorElement, bookYearElement);

    const completeBtn = document.createElement("button");
    completeBtn.classList.add("complete-btn", "green");
    completeBtn.innerText = "Selesai";
    completeBtn.addEventListener("click", function () {
        addBookToCompleted(bookObject.id);
    });

    const inCompleteBtn = document.createElement("button");
    inCompleteBtn.classList.add("incomplete-btn", "green");
    inCompleteBtn.innerText = "Belum";
    inCompleteBtn.addEventListener("click", function () {
        undoBookFromCompleted(bookObject.id);
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-btn", "red");
    deleteBtn.innerText = "Hapus";
    deleteBtn.addEventListener("click", function () {
        removeBookFromBookList(bookObject.id);
    });

    const bookItemAction = document.createElement("div");
    bookItemAction.classList.add("book-item-action");
    if (bookObject.isCompleted === true) {
        bookItemAction.append(inCompleteBtn, deleteBtn); 
    } else {
        bookItemAction.append(completeBtn, deleteBtn);
    }

    const bookItemContainer = document.createElement("article");
    bookItemContainer.classList.add("book-item");
    bookItemContainer.append(bookItemDesc, bookItemAction);

    // bookItemContainer.setAttribute("id", `book-${bookObject.id}`);
 
    return bookItemContainer;
}

function addBookToCompleted(bookId) {
    const bookTarget = findBook(bookId);
    if(bookTarget == null) return;
    
    bookTarget.isCompleted = true;

    const inCompleteBookshelfList = document.getElementById("incompleteBookshelfList");
    const completeBookshelfList = document.getElementById("completeBookshelfList");
    inCompleteBookshelfList.innerHTML = "";
    completeBookshelfList.innerHTML = "";

    for(bookItem of books){
        const bookElement = generateBookElement(bookItem);
        if (bookItem.isCompleted === true) {
            completeBookshelfList.append(bookElement);
        } else {
            inCompleteBookshelfList.append(bookElement);
        }  
    }

    saveData();
}

function removeBookFromBookList(bookId) {
    const bookTarget = findBookIndex(bookId);

    if(bookTarget === -1){
        return;
    } 

    books.splice(bookTarget, 1);

    const inCompleteBookshelfList = document.getElementById("incompleteBookshelfList");
    const completeBookshelfList = document.getElementById("completeBookshelfList");
    inCompleteBookshelfList.innerHTML = "";
    completeBookshelfList.innerHTML = "";
    
    for(let bookItem of books){
        const bookElement = generateBookElement(bookItem);
        if (bookItem.isCompleted === true) {
            completeBookshelfList.append(bookElement);
        } else {
            inCompleteBookshelfList.append(bookElement);
        }  
    }
    
    saveData();
    // alert("Yakin ingin menghapus buku?");
}

function undoBookFromCompleted(bookId){
    const bookTarget = findBook(bookId);

    if(bookTarget == null){
        return;
    }

    bookTarget.isCompleted = false;

    const inCompleteBookshelfList = document.getElementById("incompleteBookshelfList");
    const completeBookshelfList = document.getElementById("completeBookshelfList");
    inCompleteBookshelfList.innerHTML = "";
    completeBookshelfList.innerHTML = "";
    
    for(bookItem of books){
        const bookElement = generateBookElement(bookItem);
        if (bookItem.isCompleted === true) {
            completeBookshelfList.append(bookElement);
        } else {
            inCompleteBookshelfList.append(bookElement);
        }  
    }
    
    saveData();
}

function findBookIndex(bookId) {
    for(let index in books){
        if(books[index].id === bookId){
            return index
        }
    }
    return -1
}

function findBook(bookId){
    for(bookItem of books){
        if(bookItem.id === bookId){
            return bookItem
        }
    }
    return null
}

// implementasi web storage
function saveData() {
    if(isStorageExist()){
        const parsed = JSON.stringify(books);
        localStorage.setItem(BOOKS_LOCAL_STORAGE, parsed);
        // document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

function isStorageExist() {
    if(typeof(Storage) === undefined){
        alert("Browser kamu tidak mendukung local storage");
        return false
    }
    return true;
}

// document.addEventListener(SAVED_EVENT, function() {
//     console.log(localStorage.getItem(STORAGE_KEY));
// });

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(BOOKS_LOCAL_STORAGE);
    
    let data = JSON.parse(serializedData);
    
    if(data !== null){
        for(let book of data){
            books.push(book);
        }
    }

    const inCompleteBookshelfList = document.getElementById("incompleteBookshelfList");
    const completeBookshelfList = document.getElementById("completeBookshelfList");
    inCompleteBookshelfList.innerHTML = "";
    completeBookshelfList.innerHTML = "";
    
    for(let bookItem of books){
        const bookElement = generateBookElement(bookItem);
        if (bookItem.isCompleted === true) {
            completeBookshelfList.append(bookElement);
        } else {
            inCompleteBookshelfList.append(bookElement);
        }  
    }
}


// fitur search book
const searchBookInput = document.getElementById("searchBookInput");
searchBook.addEventListener("input", e => {
    const value = e.target.value.toLowerCase()

    const inCompleteBookshelfList = document.getElementById("incompleteBookshelfList");
    const completeBookshelfList = document.getElementById("completeBookshelfList");
    inCompleteBookshelfList.innerHTML = "";
    completeBookshelfList.innerHTML = "";
    
    books.forEach(book => {
        const isVisible = book.title.toLowerCase().includes(value) || book.author.toLowerCase().includes(value) || book.year.toLowerCase().includes(value);
        const newBookElement = generateBookElement(book);
        newBookElement.classList.toggle("hide", !isVisible);
        // console.log(newBookElement);

        if (book.isCompleted === true) {
            completeBookshelfList.append(newBookElement);
        } else {
            inCompleteBookshelfList.append(newBookElement);
        }  
    })
});