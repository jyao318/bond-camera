// script.js

// Select elements
const video = document.getElementById('cameraFeed');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const recordButton = document.getElementById('recordButton');
const downloadLink = document.getElementById('downloadLink');

let mediaRecorder;
let recordedChunks = [];
let currentFacingMode = "user"; // Default to front camera

// Initialize Camera
async function initCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: currentFacingMode }
    });
    video.srcObject = stream;

    // Set up media recorder
    mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
    mediaRecorder.ondataavailable = handleDataAvailable;
    mediaRecorder.onstop = saveRecording;
  } catch (error) {
    console.error("Camera access failed:", error);
  }
}

// Switch Camera
async function switchCamera() {
  currentFacingMode = currentFacingMode === "user" ? "environment" : "user";
  if (video.srcObject) {
    // Stop the current stream
    video.srcObject.getTracks().forEach(track => track.stop());
  }
  initCamera(); // Restart the camera with the new facing mode
}

// Capture Image
function captureImage() {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
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
