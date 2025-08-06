const searchBtn = document.getElementById("search-btn");
const clearBtn = document.getElementById("clear-btn");
const searchInput = document.getElementById("search-input");
const recipesContainer = document.getElementById("recipes-container");

const modal = document.getElementById("recipe-modal");
const closeModalBtn = document.querySelector(".close-btn");
const recipeTitle = document.getElementById("recipe-title");
const recipeImage = document.getElementById("recipe-image");
const ingredientsList = document.getElementById("ingredients-list");
const recipeInstructions = document.getElementById("recipe-instructions");

searchBtn.addEventListener("click", searchRecipes);
clearBtn.addEventListener("click", clearSearch);
closeModalBtn.addEventListener("click", () => modal.style.display = "none");
window.addEventListener("click", (e) => {
  if (e.target === modal) modal.style.display = "none";
});

function searchRecipes() {
  const query = searchInput.value.trim();
  if (!query) {
    alert("Please enter a search term");
    return;
  }

  fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`)
    .then(res => res.json())
    .then(data => {
      displayRecipes(data.meals);
    })
    .catch(err => {
      console.error("Error fetching recipes:", err);
    });
}

function displayRecipes(meals) {
  recipesContainer.innerHTML = "";

  if (!meals) {
    recipesContainer.innerHTML = "<p>No recipes found.</p>";
    return;
  }

  meals.forEach(meal => {
    const card = document.createElement("div");
    card.className = "recipe-card";
    card.innerHTML = `
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
      <h3>${meal.strMeal}</h3>
    `;

    card.addEventListener("click", () => showRecipeDetails(meal));
    recipesContainer.appendChild(card);
  });
}

function showRecipeDetails(meal) {
  recipeTitle.textContent = meal.strMeal;
  recipeImage.src = meal.strMealThumb;
  recipeInstructions.textContent = meal.strInstructions;

  // List ingredients
  ingredientsList.innerHTML = "";
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ingredient && ingredient.trim()) {
      const li = document.createElement("li");
      li.textContent = `${ingredient} - ${measure}`;
      ingredientsList.appendChild(li);
    }
  }

  modal.style.display = "flex";
}

function clearSearch() {
  searchInput.value = "";
  recipesContainer.innerHTML = "";
}
