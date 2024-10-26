// Select elements
const video = document.getElementById('cameraFeed');
const gunBarrelOverlay = document.getElementById('gunBarrelOverlay');
const backgroundMusic = document.getElementById('backgroundMusic');
const recordButton = document.getElementById('recordButton');
const muteButton = document.getElementById('muteButton');
const playButton = document.getElementById('playButton');

const redOverlay = document.createElement('div');
redOverlay.classList.add('red-overlay');
document.body.appendChild(redOverlay);

let stream;
let currentFacingMode = "environment";
let musicPlaying = false; // Track music playing state
let isMuted = false; // Track mute state
let musicTimeout;

// Initialize Camera
async function initCamera() {
  try {
    // Stop any existing stream
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }

    // Request user media for the camera
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: currentFacingMode }
    });

    video.srcObject = stream; // Set the video source to the stream
    adjustVideoSize(); // Resize immediately after camera loads
  } catch (error) {
    console.error("Camera access failed:", error);
    alert("Please allow camera access.");
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
  if (!musicPlaying && !isMuted) {
    backgroundMusic.play();
    musicPlaying = true; // Update state to indicate music is playing
    playButton.textContent = "Pause"; // Change button text to indicate action

    // Trigger wipe effect 8 seconds after music starts
    musicTimeout = setTimeout(() => {
      startOverlayEffect();
    }, 8000); // Start overlay effect 8 seconds in

    backgroundMusic.addEventListener('ended', () => {
      musicPlaying = false; // Update state when music ends
      resetOverlayEffect(); // Clear overlay at the end
      playButton.textContent = "Play"; // Reset button text
    });
  } else {
    backgroundMusic.pause(); // Pause if already playing
    musicPlaying = false; // Update state
    playButton.textContent = "Play"; // Reset button text
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

// Toggle mute/unmute functionality
function toggleMute() {
  isMuted = !isMuted;
  backgroundMusic.volume = isMuted ? 0 : 1; // Set volume to 0 to mute, 1 to unmute
  muteButton.textContent = isMuted ? "Unmute" : "Mute"; // Change button text based on state
}

// Start recording and play music
function toggleRecording() {
  // Logic for starting/stopping recording goes here
  playBackgroundMusic(); // Play music when starting the recording
}

// Adjust video and overlay size on window resize or orientation change
window.addEventListener('resize', adjustVideoSize);
