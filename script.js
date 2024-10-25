// script.js

// Select elements
const video = document.getElementById('cameraFeed');
const canvas = document.getElementById('canvas');
const recordButton = document.getElementById('recordButton');
const downloadLink = document.getElementById('downloadLink');
const ctx = canvas.getContext('2d');

// Variables for MediaRecorder
let mediaRecorder;
let recordedChunks = [];

// Initialize Camera and Use Front Camera by Default
async function initCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "user" }
    });
    video.srcObject = stream;
    mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });

    mediaRecorder.ondataavailable = handleDataAvailable;
    mediaRecorder.onstop = saveRecording;
  } catch (error) {
    console.error("Camera access failed:", error);
  }
}

// Capture Image Snapshot
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

// Handle Recorded Data
function handleDataAvailable(event) {
  if (event.data.size > 0) {
    recordedChunks.push(event.data);
  }
}

// Save Recording as Video File
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
