const countrySearchInput = document.getElementById("input-search");
const suggestionsDropdown = document.getElementById("suggestions");

let countriesList = [];

// Fetch the country list once when the page loads and store it in countriesList
async function fetchCountries() {
    try {
        const response = await fetch('/listings/countries'); // Fetch the country list from the backend
        countriesList = await response.json(); // Store it in countriesList
    } catch (error) {
        console.error("Error fetching country list:", error);
    }
}

// Call the function to fetch countries when the page loads
fetchCountries();

// Event listener for the search input
countrySearchInput.addEventListener("input", () => {
    const searchTerm = countrySearchInput.value.trim().toLowerCase(); // Get the search input and convert to lowercase
    
    // Clear the suggestions list before adding new ones
    suggestionsDropdown.innerHTML = "";

    // If the search term is not empty, filter the countries list
    if (searchTerm !== '') {
        const filteredCountries = countriesList.filter(country =>
            country.toLowerCase().includes(searchTerm) // Case-insensitive match
        );

        // Display the filtered countries in the suggestions list
        filteredCountries.forEach(country => {
            const suggestion = document.createElement("div");
            suggestion.textContent = country;
            suggestion.addEventListener("click", () => {
              countrySearchInput.value = country; // Set input value
              suggestionsDropdown.innerHTML = ""; // Clear suggestions
            });
            suggestionsDropdown.appendChild(suggestion);
        });
    }
});

document.addEventListener("click", (event) => {
    if (
      !countrySearchInput.contains(event.target) && // Click is not on the search input
      !suggestionsDropdown.contains(event.target) // Click is not on the dropdown
    ) {
      suggestionsDropdown.style.display = "none"; // Hide dropdown
    }
  });
  countrySearchInput.addEventListener("input", () => {
    suggestionsDropdown.style.display = "block"; // Show dropdown
  });
  
  // Optional: Handle focus to show dropdown when the input is clicked
  countrySearchInput.addEventListener("focus", () => {
    suggestionsDropdown.style.display = "block"; // Show dropdown
  });