// Define the canvas element and context
const canvas = document.getElementById("board");
const context = canvas.getContext("2d");

// Initialize the variables for image dragging
let isDragging = false;
let selectedImage = null;
let previousX = null;
let previousY = null;

// Initialize the images array
const images = [];

// Define the function for adding images
function addImage(event) {
  // Get the file input element and the file object
  const input = event.target;
  const file = input.files[0];

  // Create a new image object and set the source to the file object
  const image = new Image();
  image.src = URL.createObjectURL(file);

  // Push the image object to the images array
  images.push(image);

  // Call the drawImages function to draw the images on the canvas
  drawImages();
}

// Define the function for drawing images on the canvas
function drawImages() {
  // Clear the canvas
  context.clearRect(0, 0, canvas.width, canvas.height);

  // Loop through the images array and draw each image on the canvas
  images.forEach(function (image) {
    // Get the image dimensions and position
    const width = image.width;
    const height = image.height;
    const x = image.x || canvas.width / 2 - width / 2;
    const y = image.y || canvas.height / 2 - height / 2;

    // Draw the image on the canvas
    context.drawImage(image, x, y, width, height);
  });
}

// Define the function for selecting an image
function selectImage(event) {
  // Get the mouse coordinates
  const x = event.clientX - canvas.offsetLeft;
  const y = event.clientY - canvas.offsetTop;

  // Loop through the images array and check if the mouse coordinates are within an image
  images.forEach(function (image) {
    // Get the image dimensions and position
    const width = image.width;
    const height = image.height;
    const imageX = image.x || canvas.width / 2 - width / 2;
    const imageY = image.y || canvas.height / 2 - height / 2;

    // Check if the mouse coordinates are within the image
    if (x >= imageX && x <= imageX + width && y >= imageY && y <= imageY + height) {
      // Set the selectedImage variable to the image object
      selectedImage = image;

      // Set the isDragging variable to true
      isDragging = true;

      // Set the previousX and previousY variables to the current mouse coordinates
      previousX = x;
      previousY = y;
    }
  });
}

// Define the function for moving an image
function moveImage(event) {
  // Check if an image is being dragged
  if (isDragging) {
    // Get the current mouse coordinates
    const x = event.clientX - canvas.offsetLeft;
    const y = event.clientY - canvas.offsetTop;

    // Calculate the difference in mouse coordinates
    const dx = x - previousX;
    const dy = y - previousY;

    // Update the image position
    selectedImage.x = (selectedImage.x || canvas.width / 2 - selectedImage.width / 2) + dx;
    selectedImage.y = (selectedImage.y || canvas.height / 2 - selectedImage.height / 2) + dy;

    // Call the drawImages function to redraw the images on the canvas
    drawImages();

    // Set the previousX and previousY variables to the current mouse coordinates
    previousX = x;
   
