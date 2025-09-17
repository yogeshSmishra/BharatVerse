// --- DATA ---
const monuments = [
    { 
        id: 'hampi-chariot', 
        name: 'Hampi Stone Chariot', 
        location: 'Hampi, Karnataka', 
        cardImage: 'Assets/Images/Hampi_card.jpg', 
        modelSrc: 'Assets/3d_Models/HampiChariot.glb', 
        posterSrc: 'Assets/Images/Hampi_card.jpg', 
        description: "An iconic stone chariot in the Vittala Temple complex, representing the vehicle of the Hindu god Vishnu. A testament to the exceptional craftsmanship of the Vijayanagara Empire.", 
        hotspots:
        [
            { 
                position: "-1.176m 0.048m 0.040m", 
                normal: "0.961m -0.136m 0.241m", 
                text: "<strong>The Elephants</strong><br>Originally drawn by horses, these were replaced by two large stone elephants during restoration." 
            }, 
            { 
                position: "-1.158m 0.050m -0.048m", 
                normal: "0.996m -0.083m 0.016m", 
                text: "<strong>The Chariot Wheels</strong><br>The wheels are intricately carved from single pieces of stone and were once capable of rotating." 
            }
        ] 
    },
    { 
        id: 'ellora-caves',
        name: 'Ellora Caves', 
        location: 'Aurangabad, Maharashtra', 
        cardImage: 'Assets/Images/Ellora_caves_card.jpg', 
        modelSrc: 'Assets/3d_Models/ElloraScaled.glb', 
        posterSrc: 'Assets/Images/Ellora_caves_card.jpg',
        description: "A UNESCO World Heritage site featuring an enormous monolithic rock-cut temple complex, showcasing a fusion of Hindu, Buddhist, and Jain monuments and religious harmony.", 
        hotspots: [] 
    },
    { 
        id: 'somaskanda-sculpture', 
        name: 'Somaskanda Sculpture', 
        location: 'South India (Chola Period)', 
        cardImage: 'Assets/Images/Somaskanda_card.jpg', 
        modelSrc: 'Assets/3d_Models/Somaskanda.glb', 
        posterSrc: 'Assets/Images/Somaskanda_card.jpg', 
        description: "A divine family portrait in Hindu art, depicting Shiva with his consort Parvati and their child Skanda. This representation, prominent during the Chola dynasty, symbolizes marital bliss.", hotspots: [] 
    }
];

// --- DOM ELEMENTS ---
const mainHeader = document.getElementById('main-header');
const selectionScreen = document.getElementById('selection-screen');
const viewerScreen = document.getElementById('viewer-screen');
const monumentGrid = document.getElementById('monument-grid');
const modelViewer = document.getElementById('heritage-viewer');
const backButton = document.getElementById('back-button');
const viewerTitle = document.getElementById('viewer-title');
const viewerDescription = document.getElementById('viewer-description');
const hotspotPrompt = document.getElementById('hotspot-prompt');

// --- FUNCTIONS ---
function showViewer(monumentId) {
    const monument = monuments.find(m => m.id === monumentId);
    if (!monument) return;

    viewerTitle.textContent = monument.name;
    viewerDescription.textContent = monument.description;
    modelViewer.src = monument.modelSrc;
    modelViewer.poster = monument.posterSrc;

    const existingHotspots = modelViewer.querySelectorAll('.hotspot');
    existingHotspots.forEach(hotspot => hotspot.remove());

    if (monument.hotspots && monument.hotspots.length > 0) {
        hotspotPrompt.classList.remove('hide');
        monument.hotspots.forEach((spot, index) => {
            const hotspot = document.createElement('button');
            hotspot.className = 'hotspot';
            hotspot.slot = `hotspot-${index}`;
            hotspot.dataset.position = spot.position;
            hotspot.dataset.normal = spot.normal;
            const annotation = document.createElement('div');
            annotation.className = 'annotation';
            annotation.innerHTML = spot.text;
            hotspot.appendChild(annotation);
            modelViewer.appendChild(hotspot);
        });
    } else {
        hotspotPrompt.classList.add('hide');
    }
    
    setupHotspotInteraction();
    mainHeader.classList.add('header-clickable');
    selectionScreen.classList.add('hide');
    viewerScreen.classList.remove('hide');
    window.scrollTo(0, 0);
}

function showSelectionScreen() {
    mainHeader.classList.remove('header-clickable');
    selectionScreen.classList.remove('hide');
    viewerScreen.classList.add('hide');
}

function setupHotspotInteraction() {
    const hotspots = modelViewer.querySelectorAll('.hotspot');
    hotspots.forEach(hotspot => {
        hotspot.addEventListener('click', () => {
            const annotation = hotspot.querySelector('.annotation');
            if (!annotation) return;
            const isVisible = annotation.classList.contains('visible');
            modelViewer.querySelectorAll('.annotation').forEach(a => a.classList.remove('visible'));
            if (!isVisible) {
                annotation.classList.add('visible');
            }
        });
    });
}

// --- INITIALIZATION ---
monuments.forEach(monument => {
    const card = document.createElement('div');
    card.className = 'bg-white rounded-2xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-all duration-300 ease-in-out hover:shadow-2xl';
    card.innerHTML = `
        <div class="relative">
            <img class="h-64 w-full object-cover" src="${monument.cardImage}" alt="${monument.name}">
            <div class="absolute inset-0 bg-black bg-opacity-20"></div>
        </div>
        <div class="p-6">
            <h3 class="text-2xl font-bold text-gray-900">${monument.name}</h3>
            <p class="mt-1 text-sm text-gray-500">${monument.location}</p>
            <button data-id="${monument.id}" class="explore-btn mt-5 w-full bg-[#2a3a8a] text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-900 transition-colors duration-300">Explore in AR</button>
        </div>
    `;
    monumentGrid.appendChild(card);
});

document.querySelectorAll('.explore-btn').forEach(button => {
    button.addEventListener('click', () => showViewer(button.dataset.id));
});
backButton.addEventListener('click', showSelectionScreen);
mainHeader.addEventListener('click', () => {
    if (!viewerScreen.classList.contains('hide')) {
        showSelectionScreen();
    }
});
// Logic for the video splash screen
window.addEventListener('load', () => {
    const splashScreen = document.getElementById('splash-screen');
    const splashVideo = document.getElementById('splash-video');
    const mainContainer = document.getElementById('main-container');

    const showMainContent = () => {
        // Start fading out the splash screen
        splashScreen.classList.add('fade-out');

        // After the fade-out is complete, hide it and show the main content
        splashScreen.addEventListener('transitionend', () => {
            splashScreen.style.display = 'none';
            mainContainer.classList.remove('hide');
        }, { once: true }); // Use 'once' to ensure the event listener is removed after firing
    };

    // Check if the video element exists
    if (splashVideo) {
        // Show content when video ends
        splashVideo.addEventListener('ended', showMainContent);

        // Fallback: If video fails to load, show content immediately
        splashVideo.addEventListener('error', showMainContent);
    } else {
        // If there's no video element, just show the content
        showMainContent();
    }
});