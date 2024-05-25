const API_KEY = "live_XaefBb4SdWCq0KB9wcSbP634bZV1cu79qQQrzDcAbTzRXvamrXoZYOvvyk0qCGCN";
const quantityInput = document.querySelector("#dog-quantity") as HTMLInputElement;
const fetchButton = document.querySelector("#fetch-button") as HTMLButtonElement;
const clearButton = document.querySelector("#clear-button") as HTMLButtonElement;
const gallery = document.querySelector("#gallery") as HTMLDivElement;
const prevButton = document.querySelector("#prev-button") as HTMLButtonElement;
const nextButton = document.querySelector("#next-button") as HTMLButtonElement;
const currentPageParagraph = document.querySelector("#current-page") as HTMLParagraphElement;
const modalContainer = document.querySelector("#modal-container") as HTMLDivElement;
const modalImg = document.querySelector("#modal-img") as HTMLImageElement;
const modalMessage = document.querySelector("#modal-message") as HTMLDivElement;
const buttonModal = document.querySelector("#button-modal") as HTMLButtonElement;

interface DogImage {
    id: string;
    url: string;
    width: number;
    height: number;
}

let images: DogImage[] = [];
let currentPage = 1;
let lastPage = 1;

const renderLoading = (): void => {
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

const removeLoading = (): void => {
    for (let i = 0; i < 10; i++) {
        const loadingDiv = document.querySelector(`#skeleton-${i}`) as HTMLDivElement;
        loadingDiv.remove();
    }
};

const validateInput = (): boolean => {
    const quantityValue = Number(quantityInput.value);

    if (quantityValue < 1 || quantityValue > 100) {
        openModal("message");
        return false;
    }

    return true;
};

const fetchDogs = async (): Promise<void> => {
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
        const res: Response = await fetch(`https://api.thedogapi.com/v1/images/search?limit=${quantity}`, {
            method: "GET",
            headers: {
                "x-api-key": API_KEY,
            },
        });
        if (!res.ok) {
            throw new Error("Error when making the request: " + res.status);
        }
        const data = await res.json();
        images = data as Array<DogImage>;
        lastPage = Math.ceil(images.length / 10);
        removeLoading();
        displayPage(1);
    } catch (error: any) {
        if (error instanceof Error) {
            console.log(error);
            console.error("Error fetching dogs:", error.message);
        } else {
            console.error("Error fetching dogs:", error.toString());
        }
    } finally {
        fetchButton.disabled = false;
        clearButton.disabled = false;
        togglePagination();
    }
};

const displayPage = (page: number): void => {
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
            img.addEventListener("click", function (e: MouseEvent) {
                openModal("image");
                modalImg.src = img.src;
            });
            gallery.appendChild(img);
        } else {
            const div = document.createElement("div");
            div.classList.add("skeleton");
            div.classList.add("bg-neutral-500");
            gallery.appendChild(div);
        }
    }
    currentPageParagraph.innerHTML = `${currentPage} - ${lastPage}`;
};

const clearGalery = (): void => {
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

const changePage = (button: HTMLButtonElement) => {
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

const togglePagination = (): void => {
    currentPage !== 1 ? (prevButton.disabled = false) : (prevButton.disabled = true);
    currentPage !== lastPage ? (nextButton.disabled = false) : (nextButton.disabled = true);
};

const closeModal = (): void => {
    modalContainer.classList.add("hidden");
    modalContainer.classList.remove("flex");
    modalImg.classList.add("hidden");
    modalImg.classList.remove("flex");
    modalMessage.classList.add("hidden");
    modalMessage.classList.remove("flex");
};

const openModal = (content: string): void => {
    modalContainer.classList.remove("hidden");
    modalContainer.classList.add("flex");

    if (content === "image") {
        modalImg.classList.remove("hidden");
        modalImg.classList.add("flex");
    } else {
        modalMessage.classList.remove("hidden");
        modalMessage.classList.add("flex");
    }
};

fetchButton.addEventListener("click", fetchDogs);

clearButton.addEventListener("click", clearGalery);

nextButton.addEventListener("click", function (e: MouseEvent) {
    changePage(this);
});

prevButton.addEventListener("click", function (e: MouseEvent) {
    changePage(this);
});

buttonModal.addEventListener("click", function (e: MouseEvent) {
    e.stopPropagation();
    closeModal();
});

modalContainer.addEventListener("click", function (e: MouseEvent) {
    e.stopPropagation();
    if (e.target === modalContainer) {
        closeModal();
    }
});

clearGalery();
togglePagination();
