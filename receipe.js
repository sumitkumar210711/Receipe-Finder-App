const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const clearBtn = document.getElementById('clear-btn');
const resultsDiv = document.getElementById('results');
const detailsDiv = document.getElementById('details');

searchBtn.addEventListener('click', () => {
  const query = searchInput.value.trim();
  if (!query) return;
  fetchRecipes(query);
});

clearBtn.addEventListener('click', () => {
  searchInput.value = '';
  resultsDiv.innerHTML = '';
  detailsDiv.innerHTML = '';
  detailsDiv.classList.add('hidden');
});

async function fetchRecipes(query) {
  resultsDiv.innerHTML = '<p>Loading...</p>';
  detailsDiv.innerHTML = '';
  detailsDiv.classList.add('hidden');

  try {
    const res = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(query)}`
    );
    const data = await res.json();
    displayResults(data.meals);
  } catch (err) {
    resultsDiv.innerHTML = '<p>Error fetching recipes.</p>';
  }
}

function displayResults(meals) {
  resultsDiv.innerHTML = '';
  if (!meals) {
    resultsDiv.innerHTML = '<p>No recipes found.</p>';
    return;
  }
  meals.forEach(meal => {
    const card = document.createElement('div');
    card.classList.add('recipe-card');
    card.innerHTML = `
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
      <h3>${meal.strMeal}</h3>
      <p>Cuisine: ${meal.strArea || 'Unknown'}</p>
    `;
    card.addEventListener('click', () => showDetails(meal));
    resultsDiv.appendChild(card);
  });
}

function showDetails(meal) {
  resultsDiv.innerHTML = '';
  detailsDiv.classList.remove('hidden');

  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ing = meal[`strIngredient${i}`];
    const meas = meal[`strMeasure${i}`];
    if (ing && ing.trim()) {
      ingredients.push(`${meas.trim()} ${ing.trim()}`);
    }
  }

  detailsDiv.innerHTML = `
    <button id="back-btn">← Back to results</button>
    <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
    <h2>${meal.strMeal}</h2>
    <h3>Ingredients:</h3>
    <ul>
      ${ingredients.map(item => `<li>${item}</li>`).join('')}
    </ul>
    <h3>Instructions:</h3>
    <p>${meal.strInstructions}</p>
  `;

  document.getElementById('back-btn').addEventListener('click', () => {
    detailsDiv.innerHTML = '';
    detailsDiv.classList.add('hidden');
    // Optionally re-trigger last search
    fetchRecipes(searchInput.value.trim());
  });
}
