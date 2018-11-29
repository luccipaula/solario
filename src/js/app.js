// CSS import
import '../sass/main.scss';

// JS imports
import { getSunAlt } from './models/SunAlt';
import { displaySunAlt } from './views/sunAltView';
import { displayDate, displayForecast } from './views/timeView';
import { displayFact } from './views/factsView';
import { elements } from './views/base';

async function init() {
    const user = {};
    const today = new Date();

    startSpinner();
    
    if ('geolocation' in navigator) {
        const pos = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition((position) => {
              resolve(position);
            },
            noPosition); // Error function
        });

        // Set position and altitude
        setCoords(user, pos); 
        user.sunAlt = getSunAlt(today, user.lat, user.long);

        // Results card
        displayDate(user);
        displaySunAlt(user.sunAlt);
 
        // Forecast card
        if (clicks > 1) {
            setTimeout(function() {
                displayForecast(user.lat, user.long);
            }, 250);
        } else {
            displayForecast(user.lat, user.long);
        }

        // Facts card
        if (clicks > 1) {
            setTimeout(function() {
                displayFact(user.sunAlt);
            }, 500);
        } else {
            displayFact(user.sunAlt); 
        }
        
        
        stopSpinner();
        flipCards();
        
    }
};

// Error handling when geolocation is rejected
function noPosition() {
    elements.resultsCard.innerHTML = `
        <h4 class="heading-4" id="date">Oopsies!</h4>
        <p class="data__card--result">Could not retrieve your position.<br><br> Please enable geolocation in your browser or on your mobile device so I can help you! :)</p>
    `; 
    elements.resultsCard.style.display = 'block';
    stopSpinner();
}

// Set user's latitude and longitude
function setCoords(obj, position) {
    obj.lat = position.coords.latitude; // -12 36 
    obj.long = position.coords.longitude; // 130 140
}

// Displays loading animation while fetching data
function startSpinner() {
    elements.sunText.style.transform = 'translate(-50%, 190%)';
    elements.sunText.style.MozTransform = 'translate(-50%, 195%)';
    elements.sunText.style.fontSize = '1.4rem';
    elements.sunText.innerHTML = 'Loading'; 

    elements.sun.style.animation = 'rotation 10s linear infinite';
}

// Stops loading animation
function stopSpinner() {
    elements.sun.style.animation = '';

    elements.sunText.style.transform = 'translate(-50%, 185%)';
    elements.sunText.style.MozTransform = 'translate(-50%, 165%)';
    elements.sunText.style.fontSize = '';
    elements.sunText.innerHTML = 'Tap';
}

// Counts button clicks to determine refresh method
let clicks = 0; 
function countClicks() {
    clicks += 1
    return clicks;
}

// Flip cards on refresh
let rotation = 0;
function flipCards() {
    rotation -= 720;
    const cards = document.querySelectorAll('.data__card');
    
    cards.forEach(card => {
        card.style.transform = `perspective(600px) rotateX(${rotation}deg)`;
    });
}

// Event listeners
elements.btn.addEventListener('click', countClicks);
elements.btn.addEventListener('click', init);