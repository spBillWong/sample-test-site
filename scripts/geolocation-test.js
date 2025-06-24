// Geolocation Test JavaScript
let watchId = null;

document.addEventListener('DOMContentLoaded', function() {
    const getLocationBtn = document.getElementById('getLocationBtn');
    const watchLocationBtn = document.getElementById('watchLocationBtn');
    const stopWatchBtn = document.getElementById('stopWatchBtn');
    const status = document.getElementById('status');
    const locationResults = document.getElementById('locationResults');

    // Check if geolocation is supported
    if (!navigator.geolocation) {
        showStatus('Geolocation is not supported by this browser.', 'error');
        getLocationBtn.disabled = true;
        watchLocationBtn.disabled = true;
        return;
    }

    // Get current location once
    getLocationBtn.addEventListener('click', function() {
        showStatus('Requesting location...', 'info');
        getLocationBtn.disabled = true;

        navigator.geolocation.getCurrentPosition(
            showPosition,
            showError,
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    });

    // Watch location changes
    watchLocationBtn.addEventListener('click', function() {
        showStatus('Starting location watch...', 'info');
        watchLocationBtn.disabled = true;
        stopWatchBtn.disabled = false;

        watchId = navigator.geolocation.watchPosition(
            showPosition,
            showError,
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 1000
            }
        );
    });

    // Stop watching location
    stopWatchBtn.addEventListener('click', function() {
        if (watchId !== null) {
            navigator.geolocation.clearWatch(watchId);
            watchId = null;
            showStatus('Location watching stopped.', 'success');
            watchLocationBtn.disabled = false;
            stopWatchBtn.disabled = true;
        }
    });

    function showPosition(position) {
        const coords = position.coords;
        const timestamp = new Date(position.timestamp);

        // Calculate accuracy description
        let accuracyDescription = 'Unknown';
        if (coords.accuracy <= 10) {
            accuracyDescription = 'Very High (≤10m)';
        } else if (coords.accuracy <= 50) {
            accuracyDescription = 'High (≤50m)';
        } else if (coords.accuracy <= 100) {
            accuracyDescription = 'Medium (≤100m)';
        } else {
            accuracyDescription = `Low (~${Math.round(coords.accuracy)}m)`;
        }

        const locationHTML = `
            <div class="location-data">
                <div class="location-item">
                    <strong>📍 Coordinates:</strong>
                    <div class="coordinates">
                        <div>Latitude: <span class="coord-value">${coords.latitude.toFixed(6)}</span></div>
                        <div>Longitude: <span class="coord-value">${coords.longitude.toFixed(6)}</span></div>
                    </div>
                </div>
                
                <div class="location-item">
                    <strong>🎯 Accuracy:</strong>
                    <div class="accuracy-info">
                        <div>±${coords.accuracy.toFixed(1)} meters</div>
                        <div class="accuracy-level">${accuracyDescription}</div>
                    </div>
                </div>

                ${coords.altitude !== null ? `
                <div class="location-item">
                    <strong>⛰️ Altitude:</strong>
                    <div class="altitude-info">
                        <div>${coords.altitude.toFixed(1)} meters</div>
                        ${coords.altitudeAccuracy ? `<div class="accuracy-level">±${coords.altitudeAccuracy.toFixed(1)}m accuracy</div>` : ''}
                    </div>
                </div>` : ''}

                ${coords.heading !== null ? `
                <div class="location-item">
                    <strong>🧭 Heading:</strong>
                    <div>${coords.heading.toFixed(1)}° ${getCompassDirection(coords.heading)}</div>
                </div>` : ''}

                ${coords.speed !== null ? `
                <div class="location-item">
                    <strong>🏃 Speed:</strong>
                    <div>${(coords.speed * 3.6).toFixed(1)} km/h (${coords.speed.toFixed(1)} m/s)</div>
                </div>` : ''}

                <div class="location-item">
                    <strong>⏰ Timestamp:</strong>
                    <div class="timestamp">${timestamp.toLocaleString()}</div>
                </div>

                <div class="location-actions">
                    <button onclick="openInMaps(${coords.latitude}, ${coords.longitude})" class="map-btn">
                        🗺️ View on Maps
                    </button>
                    <button onclick="copyCoordinates(${coords.latitude}, ${coords.longitude})" class="copy-btn">
                        📋 Copy Coordinates
                    </button>
                </div>
            </div>
        `;

        locationResults.innerHTML = locationHTML;
        showStatus('Location retrieved successfully!', 'success');
        getLocationBtn.disabled = false;
    }

    function showError(error) {
        let errorMessage = '';
        
        switch(error.code) {
            case error.PERMISSION_DENIED:
                errorMessage = 'Location access denied by user. Please enable location permissions and try again.';
                break;
            case error.POSITION_UNAVAILABLE:
                errorMessage = 'Location information is unavailable. Please check your device settings.';
                break;
            case error.TIMEOUT:
                errorMessage = 'Location request timed out. Please try again.';
                break;
            default:
                errorMessage = 'An unknown error occurred while retrieving location.';
                break;
        }

        showStatus(errorMessage, 'error');
        getLocationBtn.disabled = false;
        watchLocationBtn.disabled = false;
        stopWatchBtn.disabled = true;

        if (watchId !== null) {
            navigator.geolocation.clearWatch(watchId);
            watchId = null;
        }
    }

    function showStatus(message, type) {
        status.textContent = message;
        status.className = `status-message ${type}`;
        
        // Auto-clear success messages
        if (type === 'success') {
            setTimeout(() => {
                status.textContent = '';
                status.className = 'status-message';
            }, 3000);
        }
    }
});

// Helper functions
function getCompassDirection(heading) {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(heading / 22.5) % 16;
    return directions[index];
}

function openInMaps(lat, lng) {
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        // Try to open in native maps app
        window.open(`geo:${lat},${lng}`, '_blank');
    } else {
        // Open in Google Maps
        window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, '_blank');
    }
}

function copyCoordinates(lat, lng) {
    const coordinates = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(coordinates).then(() => {
            showTemporaryMessage('Coordinates copied to clipboard!');
        }).catch(() => {
            fallbackCopyTextToClipboard(coordinates);
        });
    } else {
        fallbackCopyTextToClipboard(coordinates);
    }
}

function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.position = 'fixed';
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showTemporaryMessage('Coordinates copied to clipboard!');
    } catch (err) {
        showTemporaryMessage('Failed to copy coordinates. Please copy manually: ' + text);
    }
    
    document.body.removeChild(textArea);
}

function showTemporaryMessage(message) {
    const status = document.getElementById('status');
    const originalMessage = status.textContent;
    const originalClass = status.className;
    
    status.textContent = message;
    status.className = 'status-message success';
    
    setTimeout(() => {
        status.textContent = originalMessage;
        status.className = originalClass;
    }, 2000);
} 