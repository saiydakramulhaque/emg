'use strict';

document.addEventListener('DOMContentLoaded', () => {
    const cardsContainer = document.getElementById('cards-container');
    const loveCountEl = document.getElementById('love-count');
    const coinCountEl = document.getElementById('coin-count');
    const copyCountEl = document.getElementById('copy-count');
    const historyListEl = document.getElementById('history-list');
    const clearHistoryBtn = document.getElementById('clear-history-btn');

    let loveCount = 0;
    let coinCount = 100;
    let copyCount = 0;

    const services = [
        { name: 'National Emergency Number', name_en: 'National Emergency', number: '999', category: 'All', icon: 'fa-solid fa-house-chimney-medical' },
        { name: 'Police Helpline Number', name_en: 'Police', number: '999', category: 'Police', icon: 'fa-solid fa-building-shield' },
        { name: 'Fire Service Number', name_en: 'Fire Service', number: '999', category: 'Fire', icon: 'fa-solid fa-fire' },
        { name: 'Ambulance Service', name_en: 'Ambulance', number: '1994-999999', category: 'Health', icon: 'fa-solid fa-truck-medical' },
        { name: 'Women & Child Helpline', name_en: 'Women & Child Help', number: '109', category: 'Help', icon: 'fa-solid fa-person-dress' },
        { name: 'Anti-Corruption Helpline', name_en: 'Anti-Corruption', number: '106', category: 'Govt.', icon: 'fa-solid fa-handcuffs' },
        { name: 'Electricity Helpline', name_en: 'Electricity Outage', number: '16216', category: 'Electricity', icon: 'fa-solid fa-bolt' },
        { name: 'Brac Helpline', name_en: 'Brac', number: '16445', category: 'NGO', icon: 'fa-solid fa-hands-holding-child' },
        { name: 'Bangladesh Railway Helpline', name_en: 'Bangladesh Railway', number: '163', category: 'Travel', icon: 'fa-solid fa-train' },
    ];

    const displayCards = () => {
        cardsContainer.innerHTML = '';
        services.forEach(service => {
            const cardHTML = `
                <div class="bg-white text-gray-800 p-6 rounded-2xl border border-gray-200 flex flex-col shadow-sm transition-shadow hover:shadow-lg">
                    <div class="flex justify-between items-start mb-4">
                        <div class="bg-gray-100 p-3 rounded-lg">
                            <i class="${service.icon} text-2xl text-[#10B981]"></i>
                        </div>
                        <button class="love-btn"><i class="fa-regular fa-heart text-gray-400 text-xl"></i></button>
                    </div>

                    <div class="flex-grow">
                        <h3 class="font-bold text-lg">${service.name}</h3>
                        <p class="text-sm text-gray-500">${service.name_en}</p>
                        <h2 class="text-3xl font-bold my-4">${service.number}</h2>
                    </div>

                    <div class="border-t pt-4 mt-auto flex justify-between items-center">
                        <div class="badge badge-outline text-gray-600">${service.category}</div>
                        <div class="flex gap-2">
                            <button class="copy-btn btn btn-sm bg-gray-200 border-none font-normal" data-number="${service.number}">
                                <i class="fa-regular fa-copy"></i> Copy
                            </button>
                            <button class="call-btn btn btn-sm bg-[#10B981] text-white border-none font-normal" data-number="${service.number}" data-name="${service.name}">
                                <i class="fa-solid fa-phone"></i> Call
                            </button>
                        </div>
                    </div>
                </div>`;
            cardsContainer.insertAdjacentHTML('beforeend', cardHTML);
        });
    };

    const addToHistory = (serviceName, serviceNumber) => {
        const callTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const historyItemHTML = `
            <div class="flex justify-between items-center">
                <div>
                    <p class="font-semibold">${serviceName}</p>
                    <p class="text-sm text-gray-500">${serviceNumber}</p>
                </div>
                <p class="font-semibold text-gray-600">${callTime}</p>
            </div>`;
        historyListEl.insertAdjacentHTML('beforeend', historyItemHTML);
    };

    cardsContainer.addEventListener('click', (e) => {
        const button = e.target.closest('button');
        if (!button) return;

        if (button.classList.contains('love-btn')) {
            loveCount++;
            loveCountEl.textContent = loveCount;
            const icon = button.querySelector('i');
            icon.classList.toggle('fa-regular');
            icon.classList.toggle('fa-solid');
            icon.classList.toggle('text-red-500');
        }

        if (button.classList.contains('copy-btn')) {
            const numberToCopy = button.dataset.number;
            navigator.clipboard.writeText(numberToCopy).then(() => {
                alert(`Copied "${numberToCopy}" to clipboard!`);
                copyCount++;
                copyCountEl.textContent = copyCount;
            }).catch(err => console.error('Failed to copy: ', err));
        }

        if (button.classList.contains('call-btn')) {
            if (coinCount < 20) {
                alert("Sorry, you don't have enough coins to make a call!");
                return;
            }
            coinCount -= 20;
            coinCountEl.textContent = coinCount;
            const serviceName = button.dataset.name;
            const serviceNumber = button.dataset.number;
            alert(`Calling ${serviceName} at ${serviceNumber}...`);
            addToHistory(serviceName, serviceNumber);
        }
    });

    clearHistoryBtn.addEventListener('click', () => {
        historyListEl.innerHTML = '';
        alert('Call history has been cleared.');
    });

    displayCards();
});