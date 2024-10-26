// script.js

// Select elements
const video = document.getElementById('cameraFeed');
const overlay = document.getElementById('gunBarrelOverlay');
const backgroundMusic = document.getElementById('backgroundMusic');
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

// Adjust Video Size based on Orientation
function adjustVideoSize() {
  // Detect orientation: landscape vs. portrait
  const isLandscape = window.innerWidth > window.innerHeight;

  video.style.width = isLandscape ? `${window.innerWidth}px` : `100vw`;
  video.style.height = isLandscape ? `100vh` : `${window.innerHeight}px`;
  
  overlay.style.width = video.style.width; // Match overlay with video
  overlay.style.height = video.style.height;
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
  }, 5000); // Initial 5-second delay
  
  backgroundMusic.addEventListener('ended', () => {
    setTimeout(() => {
      backgroundMusic.play();
    }, 15000); // 15-second delay after each playback ends
  });
}

// Start background music loop when the page loads
window.onload = () => {
  initCamera();
  playBackgroundMusic();
};

// Adjust video and overlay size on window resize or orientation change
window.addEventListener('resize', adjustVideoSize);
