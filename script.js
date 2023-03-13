const board = document.querySelector('#board');
const addButton = document.querySelector('#add-button');
const uploadInput = document.querySelector('#upload-input');
const uploadButton = document.querySelector('#upload-button');
const saveButton = document.querySelector('#save-button');
const deleteButton = document.querySelector('#delete-button');
const imageUrl = document.querySelector('#image-url');

let images = [];
let selectedContainer = null;
let initialX = null;
let initialY = null;
let currentX = null;
let currentY = null;

addButton.addEventListener('click', () => {
  const url = imageUrl.value.trim();
  if (url) {
    images.push({ url, x: 0, y: 0, width: 100, height: 100 });
    renderImages();
    imageUrl.value = '';
  }
});

uploadButton.addEventListener('click', () => {
  uploadInput.click();
});

uploadInput.addEventListener('change', () => {
  const file = uploadInput.files[0];
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => {
    images.push({ url: reader.result, x: 0, y: 0, width: 100, height: 100 });
    renderImages();
    uploadInput.value = '';
  };
});

saveButton.addEventListener('click', () => {
  localStorage.setItem('referenceBoard', JSON.stringify(images));
  alert('Board saved!');
});

deleteButton.addEventListener('click', () => {
  if (confirm('Are you sure you want to delete the board?')) {
    images = [];
    renderImages();
    localStorage.removeItem('referenceBoard');
  }
});

function renderImages() {
  board.innerHTML = '';
  images.forEach((image, index) => {
    const container = document.createElement('div');
    container.classList.add('image-container');
    container.dataset.index = index;
    container.style.top = `${image.y}px`;
    container.style.left = `${image.x}px`;
    container.style.width = `${image.width}px`;
    container.style.height = `${image.height}px`;

    const img = document.createElement('img');
    img.src = image.url;

    const deleteButton = document.createElement('button');
    deleteButton.addEventListener('click', () => {
      images.splice(index, 1);
      renderImages();
    });
    deleteButton.textContent = 'Delete';

    const resizeHandle = document.createElement('div');
    resizeHandle.classList.add('resize-handle');
    resizeHandle.addEventListener('mousedown', (e) => {
      e.stopPropagation();
      selectedContainer = container;
      initialX = e.clientX;
      initialY = e.clientY;
      currentX = selectedContainer.offsetWidth - initialX;
      currentY = selectedContainer.offsetHeight - initialY;
    });

    container.appendChild(img);
    container.appendChild(deleteButton);
    container.appendChild(resizeHandle);
    board.appendChild(container);
  });

  makeImagesDraggable();
  makeImagesResizable();
}

function makeImagesDraggable() {
  const containers = document.querySelectorAll('.image-container');
  containers.forEach((container) => {
    container.draggable = true;
    container.addEventListener('mousedown', e => {
      if (e.target.tagName !== 'BUTTON') {
        if (container.classList.contains('selected')) {
          container.classList.remove('selected');
          selectedContainer = null;
        } else {
          container.classList.add('selected');
          selectedContainer = container;
          initialX = e.clientX - board.offsetLeft - container.offsetLeft;
          initialY = e.clientY - board.offsetTop - container.offsetTop;
        }
      }
    });

    container.addEventListener('mouseup', () => {
      selectedContainer = null;
      container.classList.remove('selected');
    });
  });

board.addEventListener('mousemove', (e) => {
  if (selectedContainer) {
    e.preventDefault();
    currentX = e.clientX - board.offsetLeft - initialX;
    currentY = e.clientY - board.offsetTop - initialY;
    selectedContainer.style.left = `${currentX}px`;
    selectedContainer.style.top = `${currentY}px`;

    images[selectedContainer.dataset.index].x = currentX;
    images[selectedContainer.dataset.index].y = currentY;
  }
});

board.addEventListener('click', (e) => {
  const target = e.target;
  if (target.matches('.image-container')) {
    if (!selectedContainer) {
      selectedContainer = target;
      selectedContainer.classList.add('selected');
    } else {
      selectedContainer.classList.remove('selected');
      selectedContainer = null;
    }
  } else {
    if (selectedContainer) {
      selectedContainer.classList.remove('selected');
      selectedContainer.style.top = `${currentY}px`;
      selectedContainer.style.left = `${currentX}px`;
      selectedContainer = null;
    }
  }
});

function makeImagesResizable() {
  const containers = document.querySelectorAll('.image-container');
  containers.forEach((container) => {
    const resizeHandle = container.querySelector('.resize-handle');
    resizeHandle.addEventListener('mousemove', (e) => {
      if (selectedContainer) {
        e.preventDefault();
        let newWidth = e.clientX - board.offsetLeft - selectedContainer.offsetLeft + currentX;
        let newHeight = e.clientY - board.offsetTop - selectedContainer.offsetTop + currentY;
        if (newWidth < 50) {
          newWidth = 50;
        }
        if (newHeight < 50) {
          newHeight = 50;
        }

        selectedContainer.style.width = `${newWidth}px`;
        selectedContainer.style.height = `${newHeight}px`;

        images[selectedContainer.dataset.index].width = newWidth;
        images[selectedContainer.dataset.index].height = newHeight;
      }
    });
  });
}

const savedBoard = localStorage.getItem('referenceBoard');
if (savedBoard) {
  images = JSON.parse(savedBoard);
  renderImages();
}

