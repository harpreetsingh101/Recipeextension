document.getElementById('add-ingredient').addEventListener('click', () => {
  const ingredientInput = document.getElementById('ingredient');
  const quantityInput = document.getElementById('quantity');

  const ingredient = ingredientInput.value.trim();
  const quantity = quantityInput.value.trim();

  if (ingredient && quantity) {
      const ingredientList = document.getElementById('ingredient-list');
      const newRow = document.createElement('tr');
      
      newRow.innerHTML = `
          <td>${ingredient}</td>
          <td>${quantity}</td>
      `;

      ingredientList.appendChild(newRow);

      ingredientInput.value = '';
      quantityInput.value = '';
  }
});

document.getElementById('ingredient-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const rows = document.querySelectorAll('#ingredient-list tr');
  const ingredients = [];

  rows.forEach(row => {
    const cols = row.querySelectorAll('td');
    const ingredient = cols[0]?.innerText;
    if (ingredient) ingredients.push(ingredient);
  });

  if (ingredients.length === 0) {
    alert("Please add at least one ingredient.");
    return;
  }

  const apiKey = '017f9f788c944890ba7fbea4c8906351';
  const query = ingredients.join(',');
  const url = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${encodeURIComponent(query)}&number=3&apiKey=${apiKey}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    const resultDiv = document.getElementById('recipe-result');
    resultDiv.innerHTML = '<h3>Recipes:</h3>';
    
    if (data.length === 0) {
      resultDiv.innerHTML += '<p>No recipes found.</p>';
      return;
    }

    data.forEach(recipe => {
      resultDiv.innerHTML += `
        <div style="margin-bottom: 10px;">
          <strong>${recipe.title}</strong><br>
          <img src="${recipe.image}" width="100"><br>
          <a href="https://spoonacular.com/recipes/${recipe.title.replace(/ /g, "-")}-${recipe.id}" target="_blank">View Recipe</a>
        </div>
      `;
    });
  } catch (error) {
    console.error('Error fetching recipes:', error);
    document.getElementById('recipe-result').innerHTML = '<p>Error fetching recipes. Check console for details.</p>';
  }
});

