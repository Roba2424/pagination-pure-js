const data = Array.from({ length: 100 }, (_, i) => `Item ${i + 1}`);
const itemsPerPage = 10;

function getTotalPages(data, itemsPerPage) {
    return Math.ceil(data.length / itemsPerPage);
}

function getCurrentPageFromURL() {
    const params = new URLSearchParams(window.location.search);
    const page = parseInt(params.get("page"), 10);
    return !isNaN(page) && page > 0 ? page : 1;
}

function setCurrentPageInURL(page) {
    const params = new URLSearchParams(window.location.search);
    params.set("page", page);
    window.history.replaceState({}, "", `${window.location.pathname}?${params}`);
}

function renderItems(data, container, page, itemsPerPage) {
    container.innerHTML = "";
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedItems = data.slice(start, end);
    paginatedItems.forEach(item => {
        const div = document.createElement("div");
        div.textContent = item;
        container.appendChild(div);
    });
}

function renderPageButtons(totalPages, container, currentPage) {
    container.innerHTML = "";
    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement("button");
        button.textContent = i;
        button.dataset.page = i;
        button.className = "page-btn";
        if (i === currentPage) {
            button.disabled = true;
        }
        container.appendChild(button);
    }
}

function updateButtonStates(totalPages, currentPage) {
    document.getElementById("prev-btn").disabled = currentPage === 1;
    document.getElementById("next-btn").disabled = currentPage === totalPages;
}

function initializeListeners(totalPages) {
    document.getElementById("prev-btn").addEventListener("click", () => {
        const currentPage = getCurrentPageFromURL();
        if (currentPage > 1) {
            setCurrentPageInURL(currentPage - 1);
            updatePagination(totalPages);
        }
    });

    document.getElementById("next-btn").addEventListener("click", () => {
        const currentPage = getCurrentPageFromURL();
        if (currentPage < totalPages) {
            setCurrentPageInURL(currentPage + 1);
            updatePagination(totalPages);
        }
    });

    document.getElementById("page-buttons").addEventListener("click", (event) => {
        if (event.target.classList.contains("page-btn")) {
            const page = parseInt(event.target.dataset.page, 10);
            setCurrentPageInURL(page);
            updatePagination(totalPages);
        }
    });
}

function updatePagination(totalPages) {
    const currentPage = getCurrentPageFromURL();
    renderItems(data, document.getElementById("data-container"), currentPage, itemsPerPage);
    renderPageButtons(totalPages, document.getElementById("page-buttons"), currentPage);
    updateButtonStates(totalPages, currentPage);
}

function initPagination() {
    const totalPages = getTotalPages(data, itemsPerPage);
    updatePagination(totalPages);
    initializeListeners(totalPages);
}

document.addEventListener("DOMContentLoaded", initPagination);