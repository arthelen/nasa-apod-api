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
  "Space is completely silent — no air, no sound!",
  "Earth is the only planet not named after a god."
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
    
    // show the spinner, hide the placeholder
    spinner.style.display = "flex";
    spinner.classList.remove("fade-out");
    spinner.classList.add("fade-in");

    const factElement = document.getElementById("space-fact");
    const randomFact = spaceFacts[Math.floor(Math.random() * spaceFacts.length)];
    factElement.textContent = randomFact;

    if (placeholder) {
      placeholder.style.display = "none";
    }
  
    const url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&start_date=${start}&end_date=${end}`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();

      spinner.classList.remove("fade-in");
      spinner.classList.add("fade-out");

      setTimeout(() => {
        spinner.style.display = "none";
      }, 500); // Wait until fade-out is finished
  
      // after fetch is done, hide spinner
      spinner.style.display = "none";
  
      if (data.error) {
        gallery.innerHTML = `<p>Error: ${data.error.message}</p>`;
        return;
      }
  
      // clear out previous gallery items (but keep spinner in DOM)
      gallery.querySelectorAll(".gallery-item").forEach((item) => item.remove());
  
      displayImages(data);
    } catch (error) {
      spinner.style.display = "none"; // hide spinner even if there’s an error
      gallery.innerHTML = `<p>Something went wrong. Please try again later.</p>`;
      console.error("Error fetching NASA data:", error);
    }
  }  

function displayImages(images) {
  images.forEach((image) => {
    if (image.media_type === "image") { // only show images, not videos
      const item = document.createElement("div");
      const modalDate = document.getElementById("modalDate");
      item.classList.add("gallery-item");
      item.innerHTML = `
        <img src="${image.url}" alt="${image.title}" />
        <h2>${formatDate(image.date)}</h2>
        <h1>${image.title}</h1>
      `;

      item.addEventListener("click", () => {
        openModal(image);
      });

      gallery.appendChild(item);
    }
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
  // const modalLink = document.getElementById("modalLink");

  modalImg.src = image.url;
  modalTitle.textContent = image.title;
  modalDate.textContent = `${formatDate(image.date)}`;
  modalDescription.textContent = image.explanation;

  modalCopyright.textContent = image.copyright 
    ? `Photo by: ${image.copyright}`
    : "";

  // modalLink.href = `https://apod.nasa.gov/apod/ap${image.date.replaceAll("-", "")}.html`;

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