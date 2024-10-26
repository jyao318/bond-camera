// script.js

// Select elements
const video = document.getElementById('cameraFeed');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const overlay = document.getElementById('gunBarrelOverlay');
const recordButton = document.getElementById('recordButton');
const downloadLink = document.getElementById('downloadLink');

let mediaRecorder;
let recordedChunks = [];
let currentFacingMode = "environment"; // Default to back camera
let stream; // To hold the video stream

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

    // Set up media recorder
    mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
    mediaRecorder.ondataavailable = handleDataAvailable;
    mediaRecorder.onstop = saveRecording;

    // Ensure video fills screen on load
    adjustVideoSize();
  } catch (error) {
    console.error("Camera access failed:", error);
  }
}

// Adjust Video Size on Orientation Change
function adjustVideoSize() {
  video.style.width = `${window.innerWidth}px`;
  video.style.height = `${window.innerHeight}px`;
  overlay.style.width = `${window.innerWidth}px`;
  overlay.style.height = `${window.innerHeight}px`;
}

// Switch Camera
async function switchCamera() {
  currentFacingMode = currentFacingMode === "user" ? "environment" : "user";
  await initCamera();
}

// Capture Image Including Overlay
function captureImage() {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(overlay, 0, 0, canvas.width, canvas.height); // Draw overlay on canvas
  canvas.hidden = false;
}

// Toggle Recording
function toggleRecording() {
  if (mediaRecorder.state === 'inactive') {
    mediaRecorder.start();
    recordButton.textContent = 'Stop Recording';
  } else {
    mediaRecorder.stop();
    recordButton.textContent = 'Start Recording';
  }
}

// Handle Data from MediaRecorder
function handleDataAvailable(event) {
  if (event.data.size > 0) {
    recordedChunks.push(event.data);
  }
}

// Save Recording
function saveRecording() {
  const blob = new Blob(recordedChunks, { type: 'video/webm' });
  const url = URL.createObjectURL(blob);

  downloadLink.href = url;
  downloadLink.download = 'recording.webm';
  downloadLink.style.display = 'block';
  downloadLink.textContent = 'Download Video';
  recordedChunks = [];
}

// Initialize the camera on page load
window.onload = initCamera;

// Adjust video size whenever the window is resized or orientation changes
window.addEventListener('resize', adjustVideoSize);
