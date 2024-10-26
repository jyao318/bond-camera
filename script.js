// Select elements
const video = document.getElementById('cameraFeed');
const gunBarrelOverlay = document.getElementById('gunBarrelOverlay');
const backgroundMusic = document.getElementById('backgroundMusic');

// Create the red overlay element for the wipe effect
const redOverlay = document.createElement('div');
redOverlay.classList.add('red-overlay');
document.body.appendChild(redOverlay);

let stream;
let currentFacingMode = "environment";

// Initialize Camera
async function initCamera() {
  try {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }

    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: currentFacingMode }
    });

    video.srcObject = stream;
    adjustVideoSize(); // Resize immediately after camera loads
  } catch (error) {
    console.error("Camera access failed:", error);
  }
}

// Adjust Video and Overlay Size based on Orientation
function adjustVideoSize() {
  const isLandscape = window.innerWidth > window.innerHeight;

  video.style.width = isLandscape ? `${window.innerWidth}px` : `100vw`;
  video.style.height = isLandscape ? `100vh` : `${window.innerHeight}px`;
  
  gunBarrelOverlay.style.width = video.style.width;
  gunBarrelOverlay.style.height = video.style.height;
  redOverlay.style.width = video.style.width; // Match red overlay with video
  redOverlay.style.height = video.style.height;
}

// Switch Camera
async function switchCamera() {
  currentFacingMode = currentFacingMode === "user" ? "environment" : "user";
  await initCamera(); // Reinitialize with the new facing mode
}

// Play background music with delay and loop control
function playBackgroundMusic() {
  setTimeout(() => {
    backgroundMusic.play();
  }, 5000); // Start music after 5 seconds
  
  backgroundMusic.addEventListener('ended', () => {
    setTimeout(() => {
      backgroundMusic.play();
    }, 15000); // Delay replay by 15 seconds
    
    resetOverlayEffect(); // Clear overlay at the end
  });
  
  // Trigger wipe effect 8 seconds after music starts
  backgroundMusic.addEventListener('play', () => {
    setTimeout(() => {
      startOverlayEffect();
    }, 8000); // Start overlay effect 8 seconds in
  });
}

function startOverlayEffect() {
  redOverlay.style.transform = 'translateY(0)'; // Slide down the red overlay
}

// Reset the overlay effect by moving it back up
function resetOverlayEffect() {
  redOverlay.style.transform = 'translateY(-100%)'; // Move it back up
}

// Start background music and initialize camera on page load
window.onload = () => {
  initCamera();
  playBackgroundMusic();
};

// Adjust video and overlay size on window resize or orientation change
window.addEventListener('resize', adjustVideoSize);
