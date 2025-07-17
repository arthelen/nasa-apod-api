// Find our date picker inputs on the page
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');

// Set up the date pickers with:
// - A start date 9 days ago
// - Today as the end date
// - Makes sure you can't pick dates before 1995
setupDateInputs(startInput, endInput);

const spaceFacts = [
  "The Hubble Space Telescope travels at about 5 miles per second!",
  "A day on Venus is longer than a year on Venus.",
  "Saturn could float in water because it's mostly gas!",
  "It takes about 8 minutes for light from the Sun to reach Earth.",
  "The footprints on the Moon will likely stay there for millions of years.",
  "The ISS orbits Earth about every 90 minutes!",
  "There are more stars in the universe than grains of sand on Earth!",
  "A spoonful of a neutron star would weigh about 6 billion tons!",
  "Space is completely silent — no air, no sound!"
];

const apiKey = "yR15B4EE3NbiRYfahYe2wQSyIIpyG8DgwKgfpmqF"; // NASA API key
const gallery = document.getElementById("gallery");
const button = document.querySelector("button");

button.addEventListener("click", () => {
  const startDate = startInput.value;
  const endDate = endInput.value;
  
  fetchImages(startDate, endDate);
});

async function fetchImages(start, end) {
  const spinner = document.getElementById("spinner");
  const placeholder = document.querySelector(".placeholder");
  const funFactContainer = document.getElementById("fun-fact-container");
  const funFactElement = document.getElementById("fun-fact");
  const loadingMessage = document.getElementById("loading-message");

  // Show the spinner and update the loading message
  spinner.style.display = "flex";
  spinner.classList.remove("fade-out");
  spinner.classList.add("fade-in");
  loadingMessage.textContent = "Loading...";

  // Hide the placeholder and fun fact container while loading
  if (placeholder) placeholder.style.display = "none";
  funFactContainer.classList.remove("fade-in");
  funFactContainer.classList.add("fade-out");

  // Select a random fun fact
  const randomFact = spaceFacts[Math.floor(Math.random() * spaceFacts.length)];
  funFactElement.textContent = randomFact;

  const url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&start_date=${start}&end_date=${end}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();

    spinner.classList.remove("fade-in");
    spinner.classList.add("fade-out");

    setTimeout(() => {
      spinner.style.display = "none";
    }, 500);

    if (data.error) {
      gallery.innerHTML = `<p>Error: ${data.error.message}</p>`;
      return;
    }

    // Filter the data to ensure it matches the exact date range
    const filteredData = data.filter(item => item.date >= start && item.date <= end);

    // Clear out previous gallery items
    gallery.querySelectorAll(".gallery-item").forEach((item) => item.remove());

    // Display the fun fact container with fade-in animation
    funFactContainer.style.display = "block";
    funFactContainer.classList.remove("fade-out");
    funFactContainer.classList.add("fade-in");

    displayImages(filteredData);
  } catch (error) {
    spinner.style.display = "none";
    gallery.innerHTML = `<p>Something went wrong. Please try again later.</p>`;
    console.error("Error fetching NASA data:", error);
  }
}  

function displayImages(images) {
  images.forEach((image) => {
    const item = document.createElement("div");
    item.classList.add("gallery-item");

    if (image.media_type === "image") {
      item.innerHTML = `
        <img src="${image.url}" alt="${image.title}" />
        <h2>${formatDate(image.date)}</h2>
        <h1>${image.title}</h1>
      `;
    } else if (image.media_type === "video") {
      // Use thumbnail if available, otherwise show a placeholder
      if (image.thumbnail_url) {
        item.innerHTML = `
          <img src="${image.thumbnail_url}" alt="${image.title}" />
          <h2>${formatDate(image.date)}</h2>
          <h1>${image.title}</h1>
          <p>Video</p>
        `;
      } else {
        item.innerHTML = `
          <div style="width:100%;height:200px;display:flex;align-items:center;justify-content:center;background:#000;">
            <iframe src="${image.url}" frameborder="0" allowfullscreen style="width:100%;height:100%;"></iframe>
          </div>
          <h2>${formatDate(image.date)}</h2>
          <h1>${image.title}</h1>
          <p>Video</p>
        `;
      }
    } else {
      // Skip unknown media types
      return;
    }

    item.addEventListener("click", () => {
      openModal(image);
    });

    gallery.appendChild(item);
  });
}

function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}
  
function openModal(image) {
  const modal = document.getElementById("imageModal");
  const modalImg = document.getElementById("modalImage");
  const modalTitle = document.getElementById("modalTitle");
  const modalDate = document.getElementById("modalDate");
  const modalDescription = document.getElementById("modalDescription");
  const modalCopyright = document.getElementById("modalCopyright");

  // Clear previous modal content
  modalImg.style.display = "none";
  const prevVideo = document.getElementById("modalVideo");
  if (prevVideo) prevVideo.remove();

  modalTitle.textContent = image.title;
  modalDate.textContent = formatDate(image.date);
  modalDescription.textContent = image.explanation;
  modalCopyright.textContent = image.copyright 
    ? `Photo by: ${image.copyright}`
    : "";

  if (image.media_type === "image") {
    modalImg.src = image.url;
    modalImg.style.display = "block";
  } else if (image.media_type === "video") {
    // Hide image, show video
    modalImg.src = "";
    modalImg.style.display = "none";

    // Use thumbnail if available, otherwise embed video
    let videoElem;
    if (image.thumbnail_url) {
      videoElem = document.createElement("img");
      videoElem.id = "modalVideo";
      videoElem.src = image.thumbnail_url;
      videoElem.alt = image.title;
      videoElem.style.width = "100%";
      videoElem.style.maxHeight = "400px";
      videoElem.style.borderRadius = "7px";
    } else {
      videoElem = document.createElement("iframe");
      videoElem.id = "modalVideo";
      videoElem.src = image.url;
      videoElem.frameBorder = "0";
      videoElem.allowFullscreen = true;
      videoElem.style.width = "100%";
      videoElem.style.height = "400px";
      videoElem.style.borderRadius = "7px";
    }
    modalImg.parentNode.insertBefore(videoElem, modalTitle);
  }

  modal.style.display = "flex";
  modal.classList.remove("fade-out");
  modal.classList.add("fade-in");
}

// close the modal when X is clicked
document.querySelector(".close").addEventListener("click", () => {
  modal.classList.remove("fade-in");
  modal.classList.add("fade-out");

  setTimeout(() => {
    modal.style.display = "none";
  }, 500); // Wait for fade-out animation
});

// close modal when clicking outside the modal content
window.addEventListener("click", (e) => {
  const modal = document.getElementById("imageModal");
  if (e.target === modal) {
    modal.style.display = "none";
  }
});