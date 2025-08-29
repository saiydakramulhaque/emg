// =================================================================
// DOM Element Selection
// =================================================================
const cardsContainer = document.getElementById('cards-container');
const loveCountSpan = document.getElementById('love-count');
const coinCountSpan = document.getElementById('coin-count');
const copyCountSpan = document.getElementById('copy-count');
const historyList = document.getElementById('history-list');
// Robustly select the clear button, assuming it's the only one in that section
const clearHistoryButton = document.querySelector('.h-fit .flex button');

// =================================================================
// State Management
// =================================================================
// Use a Set to track liked items to prevent duplicate counts
const likedItems = new Set();

// =================================================================
// Data Fetching and Display
// =================================================================

/**
 * Fetches service data from an external JSON file.
 * Assumes a 'data.json' file exists in the same directory.
 */
const loadServicesData = async () => {
    try {
        // Fetch the data from the local JSON file
        const response = await fetch('data.json');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        // Once data is fetched, display it
        displayServices(data);
    } catch (error) {
        console.error("Could not fetch or process service data:", error);
        cardsContainer.innerHTML = `<p class="text-red-500">Failed to load services. Please try again later.</p>`;
    }
};

/**
 * Renders the service cards dynamically into the DOM.
 * @param {Array<Object>} services - An array of service objects.
 */
const displayServices = (services) => {
    // Clear any static or previously loaded cards
    cardsContainer.innerHTML = '';

    services.forEach(service => {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'bg-white text-gray-800 p-6 rounded-2xl border border-gray-200 flex flex-col';

        cardDiv.innerHTML = `
            <div class="flex justify-between items-start mb-4">
                <div class="flex items-center gap-4">
                    <div class="${service.icon_bg_color} p-3 rounded-lg">
                        <i class="${service.icon_class} text-2xl ${service.icon_color}"></i>
                    </div>
                </div>
                <button data-id="${service.id}" class="like-btn">
                    <i class="fa-regular fa-heart text-gray-400 text-xl"></i>
                </button>
            </div>
            
            <div class="flex-grow">
                <h3 class="font-bold text-lg">${service.name}</h3>
                <p class="text-sm text-gray-500">${service.description}</p>
                <h2 class="text-3xl font-bold my-2 number-to-copy">${service.number}</h2>
                <p class="bg-[#f2f2f2] w-fit px-4 py-2 flex justify-center items-center rounded-2xl text-sm">${service.category}</p>
            </div>

            <div class="flex justify-between items-center border-t pt-4 mt-4">
                <div class="flex gap-2">
                    <button class="btn btn-sm bg-gray-200 border-none copy-btn">
                        <i class="fa-solid fa-copy"></i> Copy
                    </button>
                    <button class="btn btn-sm bg-green-600 text-white border-none call-btn">
                        <i class="fa-solid fa-phone"></i> Call
                    </button>
                </div>
            </div>
        `;
        cardsContainer.appendChild(cardDiv);
    });
};

// =================================================================
// Event Handler Functions
// =================================================================

/**
 * Handles the 'like' button click to update the heart icon and count.
 * @param {HTMLElement} button - The like button that was clicked.
 */
const handleLikeClick = (button) => {
    const heartIcon = button.querySelector('i');
    const cardId = button.dataset.id;
    let currentLoveCount = parseInt(loveCountSpan.innerText);

    // Toggle icon style
    heartIcon.classList.toggle('fa-regular');
    heartIcon.classList.toggle('fa-solid');
    heartIcon.classList.toggle('text-gray-400');
    heartIcon.classList.toggle('text-red-500');

    // Update count based on whether the item is already liked
    if (likedItems.has(cardId)) {
        likedItems.delete(cardId); // Unlike
        loveCountSpan.innerText = currentLoveCount - 1;
    } else {
        likedItems.add(cardId); // Like
        loveCountSpan.innerText = currentLoveCount + 1;
    }
};

/**
 * Handles the 'copy' button click to copy the number and update counts.
 * @param {HTMLElement} button - The copy button that was clicked.
 */
const handleCopyClick = (button) => {
    let currentCopyCount = parseInt(copyCountSpan.innerText);
    let currentCoinCount = parseInt(coinCountSpan.innerText);

    if (currentCopyCount > 0) {
        // Update counts as per the requirement
        copyCountSpan.innerText = currentCopyCount - 1;
        coinCountSpan.innerText = currentCoinCount + 10;

        // Find the number in the card and copy to clipboard
        const card = button.closest('.flex.flex-col');
        const numberToCopy = card.querySelector('.number-to-copy').innerText;
        
        navigator.clipboard.writeText(numberToCopy)
            .then(() => alert(`'${numberToCopy}' has been copied to your clipboard!`))
            .catch(err => console.error('Failed to copy text: ', err));
    } else {
        alert("You have no copies left! Earn more to copy again.");
    }
};

/**
 * Handles the 'call' button click to add an entry to the call history.
 * @param {HTMLElement} button - The call button that was clicked.
 */
const handleCallClick = (button) => {
    const card = button.closest('.flex.flex-col');
    const serviceName = card.querySelector('h3').innerText;
    const serviceNumber = card.querySelector('.number-to-copy').innerText;
    const currentTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    const historyItemDiv = document.createElement('div');
    historyItemDiv.className = 'flex justify-between items-center';
    historyItemDiv.innerHTML = `
        <div>
            <p class="font-semibold">${serviceName}</p>
            <p class="text-sm text-gray-500">${serviceNumber}</p>
        </div>
        <p class="font-semibold text-gray-600">${currentTime}</p>
    `;
    // Add the new call to the top of the history list
    historyList.prepend(historyItemDiv);
};

// =================================================================
// Event Listeners
// =================================================================

// Use event delegation on the cards container for dynamically added buttons
cardsContainer.addEventListener('click', (event) => {
    const target = event.target;
    
    // Check if a like, copy, or call button (or their icons) was clicked
    const likeButton = target.closest('.like-btn');
    const copyButton = target.closest('.copy-btn');
    const callButton = target.closest('.call-btn');

    if (likeButton) {
        handleLikeClick(likeButton);
    } else if (copyButton) {
        handleCopyClick(copyButton);
    } else if (callButton) {
        handleCallClick(callButton);
    }
});

// Add event listener for the 'Clear History' button
clearHistoryButton.addEventListener('click', () => {
    historyList.innerHTML = '';
});

// =================================================================
// Initial Application Load
// =================================================================
document.addEventListener('DOMContentLoaded', loadServicesData);