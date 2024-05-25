"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const API_KEY = "live_XaefBb4SdWCq0KB9wcSbP634bZV1cu79qQQrzDcAbTzRXvamrXoZYOvvyk0qCGCN";
const quantityInput = document.querySelector("#dog-quantity");
const fetchButton = document.querySelector("#fetch-button");
const clearButton = document.querySelector("#clear-button");
const gallery = document.querySelector("#gallery");
const prevButton = document.querySelector("#prev-button");
const nextButton = document.querySelector("#next-button");
const currentPageParagraph = document.querySelector("#current-page");
const modalContainer = document.querySelector("#modal-container");
const modalImg = document.querySelector("#modal-img");
const modalMessage = document.querySelector("#modal-message");
const buttonModal = document.querySelector("#button-modal");
let images = [];
let currentPage = 1;
let lastPage = 1;
const renderLoading = () => {
    for (let i = 0; i < 10; i++) {
        const div = document.createElement("div");
        div.classList.add("skeleton");
        div.classList.add("bg-neutral-500");
        div.id = `skeleton-${i}`;
        const loading = document.createElement("img");
        loading.classList.add("loading");
        loading.src = "./assets/images/simple-loading.svg";
        loading.classList.add("animate-spin");
        div.appendChild(loading);
        gallery.appendChild(div);
    }
};
const removeLoading = () => {
    for (let i = 0; i < 10; i++) {
        const loadingDiv = document.querySelector(`#skeleton-${i}`);
        loadingDiv.remove();
    }
};
const validateInput = () => {
    const quantityValue = Number(quantityInput.value);
    if (quantityValue < 1 || quantityValue > 100) {
        openModal("message");
        return false;
    }
    return true;
};
const fetchDogs = () => __awaiter(void 0, void 0, void 0, function* () {
    const quantity = quantityInput.value;
    if (!validateInput()) {
        return;
    }
    fetchButton.disabled = true;
    clearButton.disabled = true;
    nextButton.disabled = true;
    prevButton.disabled = true;
    quantityInput.value = "";
    gallery.innerHTML = "";
    currentPage = 1;
    renderLoading();
    try {
        const res = yield fetch(`https://api.thedogapi.com/v1/images/search?limit=${quantity}`, {
            method: "GET",
            headers: {
                "x-api-key": API_KEY,
            },
        });
        if (!res.ok) {
            throw new Error("Error when making the request: " + res.status);
        }
        const data = yield res.json();
        images = data;
        lastPage = Math.ceil(images.length / 10);
        removeLoading();
        displayPage(1);
    }
    catch (error) {
        if (error instanceof Error) {
            console.log(error);
            console.error("Error fetching dogs:", error.message);
        }
        else {
            console.error("Error fetching dogs:", error.toString());
        }
    }
    finally {
        fetchButton.disabled = false;
        clearButton.disabled = false;
        togglePagination();
    }
});
const displayPage = (page) => {
    gallery.innerHTML = "";
    const firstImg = (page - 1) * 10;
    const lastImg = page * 10;
    for (let i = firstImg; i < lastImg; i++) {
        const dogImg = images[i];
        if (dogImg) {
            const img = document.createElement("img");
            img.classList.add("cursor-pointer");
            img.src = dogImg.url;
            img.alt = "Dog";
            img.addEventListener("click", function (e) {
                openModal("image");
                modalImg.src = img.src;
            });
            gallery.appendChild(img);
        }
        else {
            const div = document.createElement("div");
            div.classList.add("skeleton");
            div.classList.add("bg-neutral-500");
            gallery.appendChild(div);
        }
    }
    currentPageParagraph.innerHTML = `${currentPage} - ${lastPage}`;
};
const clearGalery = () => {
    gallery.innerHTML = "";
    quantityInput.value = "";
    for (let i = 0; i < 10; i++) {
        const div = document.createElement("div");
        div.classList.add("skeleton");
        div.classList.add("bg-neutral-500");
        gallery.appendChild(div);
    }
    images = [];
    currentPage = 1;
    lastPage = 1;
    togglePagination();
    currentPageParagraph.innerHTML = `${currentPage} - ${lastPage}`;
};
const changePage = (button) => {
    prevButton.disabled = true;
    nextButton.disabled = true;
    const buttonId = button.id;
    if (buttonId === "next-button" && currentPage !== lastPage) {
        currentPage++;
        displayPage(currentPage);
    }
    if (buttonId === "prev-button" && currentPage !== 1) {
        currentPage--;
        displayPage(currentPage);
    }
    currentPageParagraph.innerHTML = `${currentPage} - ${lastPage}`;
    togglePagination();
};
const togglePagination = () => {
    currentPage !== 1 ? (prevButton.disabled = false) : (prevButton.disabled = true);
    currentPage !== lastPage ? (nextButton.disabled = false) : (nextButton.disabled = true);
};
const closeModal = () => {
    modalContainer.classList.add("hidden");
    modalContainer.classList.remove("flex");
    modalImg.classList.add("hidden");
    modalImg.classList.remove("flex");
    modalMessage.classList.add("hidden");
    modalMessage.classList.remove("flex");
};
const openModal = (content) => {
    modalContainer.classList.remove("hidden");
    modalContainer.classList.add("flex");
    if (content === "image") {
        modalImg.classList.remove("hidden");
        modalImg.classList.add("flex");
    }
    else {
        modalMessage.classList.remove("hidden");
        modalMessage.classList.add("flex");
    }
};
fetchButton.addEventListener("click", fetchDogs);
clearButton.addEventListener("click", clearGalery);
nextButton.addEventListener("click", function (e) {
    changePage(this);
});
prevButton.addEventListener("click", function (e) {
    changePage(this);
});
buttonModal.addEventListener("click", function (e) {
    e.stopPropagation();
    closeModal();
});
modalContainer.addEventListener("click", function (e) {
    e.stopPropagation();
    if (e.target === modalContainer) {
        closeModal();
    }
});
clearGalery();
togglePagination();
