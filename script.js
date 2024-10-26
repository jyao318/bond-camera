// script.js

// Select elements
const video = document.getElementById('cameraFeed');
const gunBarrelOverlay = document.getElementById('gunBarrelOverlay');
const backgroundMusic = document.getElementById('backgroundMusic');
const playButton = document.getElementById('playButton');
const muteButton = document.getElementById('muteButton');

// Create the red overlay element for the wipe effect
const redOverlay = document.createElement('div');
redOverlay.classList.add('red-overlay');
document.body.appendChild(redOverlay);

let stream;
let currentFacingMode = "environment";
let musicPlaying = false;
let musicMuted = false;
let musicTimeout;

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
  if (!musicPlaying) {
    backgroundMusic.play();
    musicPlaying = true; // Update state to indicate music is playing
    playButton.innerText = "Playing..."; // Change button text to Playing
    clearTimeout(musicTimeout); // Clear previous timeout if exists

    // Trigger wipe effect 8 seconds after music starts
    musicTimeout = setTimeout(() => {
      startOverlayEffect();
    }, 8000); // Start overlay effect 8 seconds in

    backgroundMusic.addEventListener('ended', () => {
      musicPlaying = false; // Update state when music ends
      resetOverlayEffect(); // Clear overlay at the end
      playButton.innerText = "Play"; // Reset button text to Play
    });
  }
}

// Mute/Unmute the background music
function toggleMute() {
  musicMuted = !musicMuted; // Toggle mute state
  backgroundMusic.muted = musicMuted; // Set mute state on audio element

  if (musicMuted) {
    muteButton.innerText = "Unmute"; // Change button text to Unmute
  } else {
    muteButton.innerText = "Mute"; // Change button text back to Mute
  }
}

// Start overlay effect
function startOverlayEffect() {
  redOverlay.style.transform = 'translateY(0)'; // Slide down the red overlay
}

// Reset the overlay effect by moving it back up
function resetOverlayEffect() {
  redOverlay.style.transform = 'translateY(-100%)'; // Move it back up
}

// Start camera on page load
window.onload = () => {
  // Do not call initCamera here to avoid pop-up issue in Safari
};

// Adjust video and overlay size on window resize or orientation change
window.addEventListener('resize', adjustVideoSize);
