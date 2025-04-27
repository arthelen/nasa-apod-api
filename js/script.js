// Find our date picker inputs on the page
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');

// Set up the date pickers with:
// - A start date 9 days ago
// - Today as the end date
// - Makes sure you can't pick dates before 1995
setupDateInputs(startInput, endInput);

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
    
    // Show the spinner, hide the placeholder
    spinner.style.display = "block";
    if (placeholder) {
      placeholder.style.display = "none";
    }
  
    const url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&start_date=${start}&end_date=${end}`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();
  
      // After fetch is done, hide spinner
      spinner.style.display = "none";
  
      if (data.error) {
        gallery.innerHTML = `<p>Error: ${data.error.message}</p>`;
        return;
      }
  
      // Clear out previous gallery items (but keep spinner in DOM)
      gallery.querySelectorAll(".gallery-item").forEach((item) => item.remove());
  
      displayImages(data);
    } catch (error) {
      spinner.style.display = "none"; // Hide spinner even if there’s an error
      gallery.innerHTML = `<p>Something went wrong. Please try again later.</p>`;
      console.error("Error fetching NASA data:", error);
    }
  }  

function displayImages(images) {
  images.forEach((image) => {
    if (image.media_type === "image") { // Only show images, not videos
      const item = document.createElement("div");
      item.classList.add("gallery-item");
      item.innerHTML = `
        <img src="${image.url}" alt="${image.title}" />
        <p>${image.title}</p>
      `;
      gallery.appendChild(item);
    }
  });
}
