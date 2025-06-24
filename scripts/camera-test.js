// Camera Test JavaScript
let stream = null;
let photoCount = 0;

document.addEventListener('DOMContentLoaded', function() {
    const startCameraBtn = document.getElementById('startCameraBtn');
    const takePictureBtn = document.getElementById('takePictureBtn');
    const stopCameraBtn = document.getElementById('stopCameraBtn');
    const videoElement = document.getElementById('videoElement');
    const videoPlaceholder = document.getElementById('videoPlaceholder');
    const cameraStatus = document.getElementById('cameraStatus');
    const photoGallery = document.getElementById('photoGallery');

    // Check if camera is supported
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        showStatus('Camera access is not supported by this browser.', 'error');
        startCameraBtn.disabled = true;
        return;
    }

    // Start camera
    startCameraBtn.addEventListener('click', async function() {
        showStatus('Requesting camera access...', 'info');
        startCameraBtn.disabled = true;

        try {
            const constraints = {
                video: {
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    facingMode: 'user' // Front camera by default
                },
                audio: false
            };

            stream = await navigator.mediaDevices.getUserMedia(constraints);
            
            videoElement.srcObject = stream;
            videoElement.style.display = 'block';
            videoPlaceholder.style.display = 'none';
            
            takePictureBtn.disabled = false;
            stopCameraBtn.disabled = false;
            
            showStatus('Camera started successfully!', 'success');

            // Get camera info
            const videoTrack = stream.getVideoTracks()[0];
            const settings = videoTrack.getSettings();
            showCameraInfo(settings);

        } catch (error) {
            handleCameraError(error);
            startCameraBtn.disabled = false;
        }
    });

    // Take picture
    takePictureBtn.addEventListener('click', function() {
        if (stream) {
            capturePhoto();
        }
    });

    // Stop camera
    stopCameraBtn.addEventListener('click', function() {
        stopCamera();
    });

    function capturePhoto() {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        
        // Set canvas dimensions to match video
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;
        
        // Draw the video frame to canvas
        context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
        
        // Convert to blob and create photo
        canvas.toBlob(function(blob) {
            const photoUrl = URL.createObjectURL(blob);
            const timestamp = new Date().toLocaleString();
            photoCount++;
            
            addPhotoToGallery(photoUrl, timestamp, photoCount, blob);
            showStatus(`Photo ${photoCount} captured!`, 'success');
        }, 'image/jpeg', 0.9);
    }

    function addPhotoToGallery(photoUrl, timestamp, count, blob) {
        // Remove "no photos" message if it exists
        const noPhotos = photoGallery.querySelector('.no-photos');
        if (noPhotos) {
            noPhotos.remove();
        }

        const photoContainer = document.createElement('div');
        photoContainer.className = 'photo-item';
        
        photoContainer.innerHTML = `
            <div class="photo-wrapper">
                <img src="${photoUrl}" alt="Captured photo ${count}" class="captured-photo">
                <div class="photo-overlay">
                    <div class="photo-actions">
                        <button onclick="downloadPhoto('${photoUrl}', 'photo-${count}.jpg')" class="photo-btn download-btn">
                            💾 Download
                        </button>
                        <button onclick="viewPhotoFullsize('${photoUrl}')" class="photo-btn view-btn">
                            🔍 View
                        </button>
                        <button onclick="removePhoto(this)" class="photo-btn delete-btn">
                            🗑️ Delete
                        </button>
                    </div>
                </div>
            </div>
            <div class="photo-info">
                <div class="photo-timestamp">📅 ${timestamp}</div>
                <div class="photo-size">📏 ${videoElement.videoWidth} × ${videoElement.videoHeight}</div>
            </div>
        `;
        
        photoGallery.appendChild(photoContainer);
        
        // Add animation
        setTimeout(() => {
            photoContainer.style.opacity = '1';
            photoContainer.style.transform = 'translateY(0)';
        }, 100);
    }

    function stopCamera() {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            stream = null;
        }
        
        videoElement.style.display = 'none';
        videoPlaceholder.style.display = 'flex';
        videoElement.srcObject = null;
        
        startCameraBtn.disabled = false;
        takePictureBtn.disabled = true;
        stopCameraBtn.disabled = true;
        
        showStatus('Camera stopped.', 'info');
    }

    function handleCameraError(error) {
        let errorMessage = '';
        
        switch(error.name) {
            case 'NotAllowedError':
                errorMessage = 'Camera access denied. Please allow camera permissions and try again.';
                break;
            case 'NotFoundError':
                errorMessage = 'No camera found on this device.';
                break;
            case 'NotSupportedError':
                errorMessage = 'Camera access is not supported by this browser.';
                break;
            case 'NotReadableError':
                errorMessage = 'Camera is already in use by another application.';
                break;
            case 'OverconstrainedError':
                errorMessage = 'Camera constraints could not be satisfied.';
                break;
            default:
                errorMessage = `Camera error: ${error.message}`;
                break;
        }
        
        showStatus(errorMessage, 'error');
    }

    function showCameraInfo(settings) {
        const infoText = `📹 Camera: ${settings.width}×${settings.height} @ ${settings.frameRate || 'auto'}fps`;
        showStatus(infoText, 'info');
    }

    function showStatus(message, type) {
        cameraStatus.textContent = message;
        cameraStatus.className = `status-message ${type}`;
        
        // Auto-clear success messages
        if (type === 'success') {
            setTimeout(() => {
                cameraStatus.textContent = '';
                cameraStatus.className = 'status-message';
            }, 3000);
        }
    }

    // Clean up on page unload
    window.addEventListener('beforeunload', function() {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
    });
});

// Global functions for photo actions
function downloadPhoto(photoUrl, filename) {
    const link = document.createElement('a');
    link.href = photoUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function viewPhotoFullsize(photoUrl) {
    const modal = document.createElement('div');
    modal.className = 'photo-modal';
    modal.innerHTML = `
        <div class="photo-modal-content">
            <span class="photo-modal-close" onclick="this.parentElement.parentElement.remove()">&times;</span>
            <img src="${photoUrl}" alt="Full size photo" class="photo-modal-img">
        </div>
    `;
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    document.body.appendChild(modal);
}

function removePhoto(button) {
    const photoItem = button.closest('.photo-item');
    const photoUrl = photoItem.querySelector('.captured-photo').src;
    
    // Revoke the object URL to free memory
    URL.revokeObjectURL(photoUrl);
    
    // Remove with animation
    photoItem.style.opacity = '0';
    photoItem.style.transform = 'translateY(-20px)';
    
    setTimeout(() => {
        photoItem.remove();
        
        // Show "no photos" message if gallery is empty
        const photoGallery = document.getElementById('photoGallery');
        if (photoGallery.children.length === 0) {
            photoGallery.innerHTML = '<p class="no-photos">No photos captured yet. Start the camera and take a picture!</p>';
        }
    }, 300);
} 