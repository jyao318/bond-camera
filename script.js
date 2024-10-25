// script.js

// Select elements
const video = document.getElementById('cameraFeed');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Access the front camera and display the live feed
async function initCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "user" } // Defaults to the front camera
    });
    video.srcObject = stream;
  } catch (error) {
    console.error("Camera access failed:", error);
  }
}

// Capture the image with the video feed
function captureImage() {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  // Reveal captured image on canvas
  canvas.hidden = false;
}

// Initialize the camera on page load
window.onload = initCamera;
