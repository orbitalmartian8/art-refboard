// JS file
const canvas = new fabric.Canvas('canvas', { backgroundColor: 'white' });
// Add an image to the canvas
function addImage(url) {
  fabric.Image.fromURL(url, (img) => {
    canvas.add(img);
  });
}

// Get the file input element and add an event listener to it
const fileInput = document.getElementById('file-input');
fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = (event) => {
    addImage(event.target.result);
  };
  reader.readAsDataURL(file);
});
// Move and resize images on the canvas
let isDragging = false;
let lastX, lastY;

canvas.on('mouse:down', (event) => {
  isDragging = true;
  const pointer = canvas.getPointer(event.e);
  lastX = pointer.x;
  lastY = pointer.y;
});

canvas.on('mouse:move', (event) => {
  if (!isDragging) return;
  const pointer = canvas.getPointer(event.e);
  const activeObj = canvas.getActiveObject();
  if (activeObj) {
    // Move the object
    activeObj.left += pointer.x - lastX;
    activeObj.top += pointer.y - lastY;
    activeObj.setCoords();
  }
  lastX = pointer.x;
  lastY = pointer.y;
});

canvas.on('mouse:up', (event) => {
  isDragging = false;
});
// Save the canvas as an image
const saveBtn = document.getElementById('save');
saveBtn.addEventListener('click', () => {
  const dataURL = canvas.toDataURL({ format: 'png' });
  const link = document.createElement('a');
  link.download = 'board.png';
  link.href = dataURL;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});
