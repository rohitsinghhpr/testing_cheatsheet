function homePageShortCut() {
    const homeLink = document.querySelector('.home-link a');
    if (!homeLink) {
        return;
    }
    document.addEventListener('keydown', (event) => {
        // Check if Left Arrow (ArrowLeft) is pressed
        if (event.key === 'ArrowLeft') {
            document.addEventListener('keydown', (innerEvent) => {
                // Check if Enter key is pressed
                if (innerEvent.key === 'Enter') {
                    innerEvent.preventDefault();
                    homeLink.click();
                }
            }, { once: true });
        }
    });
}

// Right Sidebar 
function initRightSideBarNavigation() {
    const rightSidebar = document.querySelector('.main_navbar');
    if (!rightSidebar || !rightSidebar.querySelectorAll('.main_navbar a, .main_navbar button').length) {
        return;
    }

    const columns = Array.from(rightSidebar.querySelectorAll('.col-3'));
    const elements = Array.from(rightSidebar.querySelectorAll('.main_navbar a, .main_navbar button'));
    let currentIndex = 0;

    // Load the last active index from localStorage
    const savedIndex = localStorage.getItem('lastActiveButtonIndex');
    if (savedIndex !== null && !isNaN(savedIndex) && elements[savedIndex]) {
        currentIndex = parseInt(savedIndex, 10);
    }

    function updateButtonClass(index) {
        elements.forEach((el, i) => {
            // Remove any existing classes for styling
            el.classList.remove('btn-danger', 'btn-success', 'btn-dark');

            // Add default classes based on element type
            if (el.tagName === 'A') {
                el.classList.add('btn', 'btn-dark'); // Default for links
            } else if (el.tagName === 'BUTTON') {
                el.classList.add('btn', 'btn-success'); // Default for buttons
            }

            // Add 'btn-danger' to highlight the active element
            if (i === index) {
                el.classList.remove('btn-dark', 'btn-success'); // Remove any default classes
                el.classList.add('btn-danger'); // Highlight the active element
            }
        });

        // Save the active index to localStorage
        localStorage.setItem('lastActiveButtonIndex', index);
    }

    function focusOnColumn(columnIndex) {
        if (columnIndex < 0 || columnIndex >= columns.length) {
            return;
        }

        const columnElements = Array.from(columns[columnIndex].querySelectorAll('a, button'));
        if (columnElements.length > 0) {
            currentIndex = elements.indexOf(columnElements[0]); // Update the currentIndex to the first element in the column
            columnElements[0].focus();
            updateButtonClass(currentIndex);
        }
    }

    // Initialize with the last active element
    elements[currentIndex].focus();
    updateButtonClass(currentIndex);

    document.addEventListener('keydown', function (event) {
        // Prevent default behavior for arrow keys to avoid conflicts
        if (["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight"].includes(event.key)) {
            event.preventDefault();
        }

        if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
            currentIndex = (currentIndex + 1) % elements.length;
            elements[currentIndex].focus();
            updateButtonClass(currentIndex);
        }

        if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
            currentIndex = (currentIndex - 1 + elements.length) % elements.length;
            elements[currentIndex].focus();
            updateButtonClass(currentIndex);
        }

        // Handle Alt + number shortcuts for column navigation
        if (event.altKey) {
            const columnShortcut = parseInt(event.key, 10) - 1; // Convert to zero-based index
            if (!isNaN(columnShortcut)) {
                focusOnColumn(columnShortcut);
            }
        }
    });
}

// Details navigation with arrow keys
function initDetailsNavigation() {
    // Check if the <div class="details-container"> exists in the DOM
    const detailsContainer = document.querySelector('.details-container');

    // Exit if detailsContainer or details elements are not present
    if (!detailsContainer || !detailsContainer.querySelectorAll('details').length) {
        return;
    }

    const detailsElements = detailsContainer.querySelectorAll('details');
    let currentIndex = 0;

    // Set initial focus on the first details element's summary
    detailsElements[currentIndex].querySelector('summary').focus();

    function updateFocus(index) {
        if (index >= 0 && index < detailsElements.length) {
            currentIndex = index;
            detailsElements[currentIndex].querySelector('summary').focus();
        }
    }

    function isAnyDetailsOpen() {
        return Array.from(detailsElements).some(details => details.open);
    }

    function toggleActiveClass(currentDetails, isOpen) {
        // Remove active class from all details
        detailsElements.forEach(details => details.classList.remove('active'));

        // Add active class only to the currently opened details if open
        if (isOpen) {
            currentDetails.classList.add('active');
        }
    }

    document.addEventListener('keydown', (e) => {
        // Only handle arrow keys for focus movement if no details is open
        if (!isAnyDetailsOpen()) {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                updateFocus((currentIndex + 1) % detailsElements.length);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                updateFocus((currentIndex - 1 + detailsElements.length) % detailsElements.length);
            }
        }

        // Handle Enter key to toggle details open/close
        if (e.key === 'Enter') {
            e.preventDefault();
            const currentDetails = detailsElements[currentIndex];

            // Toggle the current details element
            const isOpen = !currentDetails.open;
            detailsElements.forEach((details) => {
                details.open = false; // Close all details
                details.classList.remove('active'); // Remove active class
            });
            currentDetails.open = isOpen;  // Toggle the current details
            toggleActiveClass(currentDetails, isOpen); // Add/remove active class
        }
    });
}

// Offcanvas navigation for focus management and arrow keys
function initOffcanvasNavigation() {
    const offcanvasElements = document.querySelectorAll('.offcanvas.offcanvas-end');
    if (!offcanvasElements.length) {
        return;
    }

    offcanvasElements.forEach(offcanvas => {
        const links = offcanvas.querySelectorAll('a');
        const buttons = offcanvas.querySelectorAll('button');
        const elements = [...links, ...buttons];

        if (elements.length === 0) return;

        let currentIndex = 0;

        function updateActiveClass() {
            elements.forEach(el => el.classList.remove('active'));
            elements[currentIndex].classList.add('active');
        }

        function handleKeyDown(event) {
            // Stop key event from propagating to parent handlers (like right sidebar)
            event.stopPropagation();

            if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
                event.preventDefault();
                currentIndex = (currentIndex + 1) % elements.length;
                elements[currentIndex].focus();
                updateActiveClass();
            }

            if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
                event.preventDefault();
                currentIndex = (currentIndex - 1 + elements.length) % elements.length;
                elements[currentIndex].focus();
                updateActiveClass();
            }

            if (event.key === 'Enter') {
                event.preventDefault();
                elements[currentIndex].click();
            }
        }

        offcanvas.addEventListener('keydown', handleKeyDown);

        offcanvas.addEventListener('shown.bs.offcanvas', () => {
            setTimeout(() => {
                elements[0].focus();  // Ensure focus on the first element
                updateActiveClass();
            }, 100); // Delay for proper visibility
        });
    });
}

// Offcanvas last open canvas
function initializeOffcanvasMemory() {
    const offcanvasButtons = document.querySelectorAll('[data-bs-toggle="offcanvas"]');
    const linkButtons = document.querySelectorAll('a.btn-dark');

    // Attach click event to offcanvas buttons
    offcanvasButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.getAttribute('data-bs-target').substring(1);
            sessionStorage.setItem('lastOpenedOffcanvas', targetId);
        });
    });

    // Clear session storage on link button click
    linkButtons.forEach(link => {
        link.addEventListener('click', () => {
            sessionStorage.removeItem('lastOpenedOffcanvas');
        });
    });

    // Restore the last opened offcanvas
    const lastOpenedOffcanvasId = sessionStorage.getItem('lastOpenedOffcanvas');
    if (lastOpenedOffcanvasId) {
        const offcanvasElement = document.getElementById(lastOpenedOffcanvasId);
        if (offcanvasElement) {
            const bootstrapOffcanvas = new bootstrap.Offcanvas(offcanvasElement);
            bootstrapOffcanvas.show();
        }
    }
}

// Run the function after DOM content is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    homePageShortCut();
    initRightSideBarNavigation();
    initDetailsNavigation();
    initOffcanvasNavigation();
    // initializeOffcanvasMemory();
});
