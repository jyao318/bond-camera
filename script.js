// script.js

// Select elements
const video = document.getElementById('cameraFeed');
const overlay = document.getElementById('gunBarrelOverlay');
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

// Initialize the camera on page load
window.onload = initCamera;

// Adjust video and overlay size on window resize or orientation change
window.addEventListener('resize', adjustVideoSize);
