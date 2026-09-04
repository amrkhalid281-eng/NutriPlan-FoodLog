import { showMealDetails } from "../main.js";

// =========== Loading Spinner Design ============
/*
<div class="flex items-center justify-center py-12">
    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
</div>
*/

// =========== Empty State Design ============
/*
<div class="flex flex-col items-center justify-center py-12 text-center">
    <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <i class="fa-solid fa-search text-gray-400 text-2xl"></i>
    </div>
    <p class="text-gray-500 text-lg">No recipes found</p>
    <p class="text-gray-400 text-sm mt-2">Try searching for something else</p>
</div>
*/

/* ================================================= 
---  DOM
==================================================== */
const categoryList = document.getElementById("category-list");
const searchInput = document.getElementById("search-input");


// ======>> Search

let searchTimer;
searchInput.addEventListener("input", () => {
    clearTimeout(searchTimer);

    searchTimer = setTimeout(async () => {
        const searchValue = searchInput.value.trim();

        if (searchValue === "") {
            displayRecipes(dataRecipes);
            return;
        }

        const [nameRes, areaRes] = await Promise.all([
            fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchValue}`),
            fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${searchValue}`)
        ]);

        const nameData = await nameRes.json();
        const areaData = await areaRes.json();

        const nameResults = nameData.meals || [];
        const areaResults = areaData.meals || [];

        const combinedMap = new Map();
        nameResults.forEach(meal => combinedMap.set(meal.idMeal, meal));
        areaResults.forEach(meal => {
            if (!combinedMap.has(meal.idMeal)) combinedMap.set(meal.idMeal, meal);
        });

        const combinedResults = Array.from(combinedMap.values());

        displayRecipes(combinedResults);
    }, 500);
});




// ====== > Recipe Areas

export async function strArea() {
    const res = await fetch("https://www.themealdb.com/api/json/v1/1/list.php?a=list")
    const data = await res.json();
    displayCategoryArea(data)
    handleCategoryClick();
}

function displayCategoryArea(data) {
    let cartoona = "";

    for (let i = 0; i < 10; i++) {
        cartoona += `
            <button
                class="category-btn px-4 py-2 bg-gray-100 text-gray-700 rounded-full font-medium text-sm whitespace-nowrap hover:bg-gray-200 transition-all"
            >
                ${data.meals[i].strArea}
            </button>
        `
    }

    categoryList.innerHTML += cartoona;
}

function handleCategoryClick() {
    const activeClasses = ["bg-emerald-600", "text-white", "hover:bg-emerald-700"];
    const inactiveClasses = ["bg-gray-100", "text-gray-700", "hover:bg-gray-200"];

    categoryList.addEventListener("click", async (e) => {
        const clickedBtn = e.target.closest(".category-btn");
        if (!clickedBtn) return;

        if (clickedBtn.textContent.trim() === "All Recipes") {
            recipeShowing();
            return;
        }

        categoryList.querySelectorAll(".category-btn").forEach((btn) => {
            btn.classList.remove(...activeClasses);
            btn.classList.add(...inactiveClasses);
        });

        clickedBtn.classList.remove(...inactiveClasses);
        clickedBtn.classList.add(...activeClasses);

        const selectedArea = clickedBtn.textContent.trim();
        const res = await fetch(
            `https://www.themealdb.com/api/json/v1/1/filter.php?a=${selectedArea}`
        );

        const data = await res.json();
        dataRecipes = data.meals;
        displayRecipes();
    });
}

/* Browse by Meal Type */

let dataMealType = []
export async function mealType() {
    let res = await fetch("https://www.themealdb.com/api/json/v1/1/categories.php")
    let data = await res.json()
    dataMealType = data
    displayMealType()
}

const categoryIcons = {
    Beef: "fa-solid fa-drumstick-bite",
    Chicken: "fa-solid fa-drumstick-bite",
    Dessert: "fa-solid fa-ice-cream",
    Lamb: "fa-solid fa-drumstick-bite",
    Miscellaneous: "fa-solid fa-utensils",
    Pasta: "fa-solid fa-bowl-food",
    Pork: "fa-solid fa-bacon",
    Seafood: "fa-solid fa-fish",
    Side: "fa-solid fa-plate-wheat",
    Starter: "fa-solid fa-bowl-rice",
    Vegan: "fa-solid fa-leaf",
    Vegetarian: "fa-solid fa-carrot",
    Breakfast: "fa-solid fa-egg",
    Goat: "fa-solid fa-drumstick-bite",
};
function getCategoryIcon(categoryName) {
    return categoryIcons[categoryName] || "fa-solid fa-utensils"
}

const colorThemes = [
    {
        card: "bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200 hover:border-emerald-400",
        icon: "bg-gradient-to-br from-emerald-400 to-teal-500",
    },
    {
        card: "bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200 hover:border-orange-400",
        icon: "bg-gradient-to-br from-orange-400 to-amber-500",
    },
    {
        card: "bg-gradient-to-br from-rose-50 to-pink-50 border-rose-200 hover:border-rose-400",
        icon: "bg-gradient-to-br from-rose-400 to-pink-500",
    },
    {
        card: "bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200 hover:border-cyan-400",
        icon: "bg-gradient-to-br from-blue-400 to-cyan-500",
    },
    {
        card: "bg-gradient-to-br from-red-50 to-rose-50 border-red-200 hover:border-red-400",
        icon: "bg-gradient-to-br from-red-400 to-rose-500",
    },
    {
        card: "bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200 hover:border-amber-400",
        icon: "bg-gradient-to-br from-amber-400 to-yellow-500",
    },
    {
        card: "bg-gradient-to-br from-cyan-50 to-teal-50 border-cyan-200 hover:border-cyan-400",
        icon: "bg-gradient-to-br from-cyan-400 to-teal-500",
    },
    {
        card: "bg-gradient-to-br from-lime-50 to-green-50 border-lime-200 hover:border-lime-400",
        icon: "bg-gradient-to-br from-lime-400 to-green-500",
    },
    {
        card: "bg-gradient-to-br from-slate-50 to-gray-50 border-slate-200 hover:border-slate-400",
        icon: "bg-gradient-to-br from-slate-400 to-gray-500",
    },
    {
        card: "bg-gradient-to-br from-stone-50 to-gray-50 border-stone-200 hover:border-stone-400",
        icon: "bg-gradient-to-br from-stone-400 to-gray-500",
    },
];

function hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0;
    }
    return Math.abs(hash);
}

let lastThemeIndex = -1;
function getThemeForCategory(categoryName) {
    let index = hashString(categoryName) % colorThemes.length;

    while (index === lastThemeIndex && colorThemes.length > 1) {
        index = (index + 1) % colorThemes.length;
    }

    lastThemeIndex = index;
    return colorThemes[index];
}

function createMealTye(index) {
    const category = dataMealType.categories[index];
    const theme = getThemeForCategory(category.strCategory); // بدل getRandomTheme()
    const iconClass = getCategoryIcon(category.strCategory);

    return `
    <div
        class="category-card ${theme.card} rounded-xl border p-3 hover:shadow-md cursor-pointer transition-all group"
            data-category="${category.strCategory}"
        >
            <div class="flex items-center gap-2.5">
                <div
                    class="text-white w-9 h-9 ${theme.icon} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm"
                >
                    <i class="${iconClass}"></i>
                </div>
                <div>
                    <h3 class="text-sm font-bold text-gray-900">${category.strCategory}</h3>
                </div>
            </div>
        </div>
    `;
}

function displayMealType() {
    let cartoona = "";
    for (let i = 0; i < 12; i++) {
        cartoona += createMealTye(i);
    }
    document.getElementById("categories-grid").innerHTML = cartoona;

    attachCategoryCardListeners()
}

let recipe = "chicken";
function attachCategoryCardListeners() {
    const categoryCard = document.querySelectorAll(".category-card");

    categoryCard.forEach((card) => {
        card.addEventListener("click", () => {
            recipe = card.dataset.category
            recipeShowing();
        });
    });
}

let dataRecipes = [];
export async function recipeShowing() {
    let res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${recipe}`)
    let data = await res.json()
    dataRecipes = data.meals;
    displayRecipes()
}

function createRecipes(meal) {
    return `
        <div
            class="recipe-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group"
            data-meal-id="${meal.idMeal}"
        >
            <div class="relative h-48 overflow-hidden">
                <img
                    class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    src="${meal.strMealThumb}"
                    alt="${meal.strMeal}"
                    loading="lazy"
                />
                <div class="absolute bottom-3 left-3 flex gap-2">
                    <span class="px-2 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold rounded-full text-gray-700">
                        <i class="fa-solid fa-utensils text-emerald-600 mr-1"></i>
                        ${meal.strCategory || "Recipe"}
                    </span>
                    <span class="px-2 py-1 bg-white text-xs font-semibold rounded-full text-gray-700">
                        <i class="fa-solid fa-globe text-blue-500 mr-1"></i>
                        ${meal.strCountry}
                    </span>
                </div>
            </div>
            <div class="p-4">
                <h3 class="text-base font-bold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors line-clamp-1">
                    ${meal.strMeal}
                </h3>
                <p class="text-xs text-gray-600 mb-3 line-clamp-2">
                    ${meal.strInstructions || ""}
                </p>
                <div class="flex items-center justify-between text-xs">
                    <span class="font-semibold text-gray-900">
                        <i class="fa-solid fa-utensils text-emerald-600 mr-1"></i>
                        ${meal.strCategory}
                    </span>
                    <span class="font-semibold text-gray-500">
                        <i class="fa-solid fa-globe text-blue-500 mr-1"></i>
                        ${meal.strCountry}
                    </span>
                </div>
            </div>
        </div>
    `
}

function createRecipesListItem(meal) {
    return `
        <div
            class="recipe-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group flex"
            data-meal-id="${meal.idMeal}"
        >
            <div class="relative w-32 shrink-0 overflow-hidden">
                <img
                    class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    src="${meal.strMealThumb}"
                    alt="${meal.strMeal}"
                    loading="lazy"
                />
            </div>
            <div class="p-4 flex-1 min-w-0">
                <h3 class="text-base font-bold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors line-clamp-1">
                    ${meal.strMeal}
                </h3>
                <p class="text-xs text-gray-600 mb-3 line-clamp-2">
                    ${meal.strInstructions || ""}
                </p>
                <div class="flex items-center gap-4 text-xs">
                    <span class="font-semibold text-gray-900">
                        <i class="fa-solid fa-utensils text-emerald-600 mr-1"></i>
                        ${meal.strCategory || "Recipe"}
                    </span>
                    <span class="font-semibold text-gray-500">
                        <i class="fa-solid fa-globe text-blue-500 mr-1"></i>
                        ${meal.strCountry}
                    </span>
                </div>
            </div>
        </div>
    `
}

let currentView = "grid";
function displayRecipes(recipes = dataRecipes) {
    const grid = document.getElementById("recipes-grid");
    const countLabel = document.getElementById("recipes-count");

    if (!recipes || recipes.length === 0) {
        grid.innerHTML = `
            <div class="flex flex-col items-center justify-center py-12 text-center">
                <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <i class="fa-solid fa-search text-gray-400 text-2xl"></i>
                </div>
                <p class="text-gray-500 text-lg">No recipes found</p>
                <p class="text-gray-400 text-sm mt-2">Try searching for something else</p>
            </div>
        `;
        countLabel.innerHTML = "Showing 0 recipes";
        return;
    }

    let cartoona = "";
    for (let i = 0; i < recipes.length; i++) {
        cartoona += currentView === "grid"
            ? createRecipes(recipes[i])
            : createRecipesListItem(recipes[i]);
    }
    grid.innerHTML = cartoona;
    countLabel.innerHTML = `Showing ${recipes.length} ${recipes[0].strCategory || ""} recipes`;

    attachRecipesCardListeners();
}

function attachRecipesCardListeners() {
    const recipesCard = document.querySelectorAll(".recipe-card");

    recipesCard.forEach((card) => {
        card.addEventListener("click", () => {
            const mealId = card.dataset.mealId;
            showMealDetails();
            loadMealDetails(mealId)
        });
    });
}


function getIngredientsList(meal) {
    const ingredients = [];

    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];

        if (ingredient && ingredient.trim() !== "") {
            ingredients.push({ name: ingredient, measure: measure || "" });
        }
    }

    return ingredients;
}

function displayIngredients(ingredients) {
    document.getElementById("ingredients-list").innerHTML = ingredients
        .map(item => `
            <div
                class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-emerald-50 transition-colors"
            >
                <input
                    type="checkbox"
                    class="ingredient-checkbox w-5 h-5 text-emerald-600 rounded border-gray-300"
                />

                <span class="text-gray-700">
                    <span class="font-medium text-gray-900">
                        ${item.measure}
                    </span>
                    ${item.name}
                </span>
            </div>
        `)
        .join("");
}

function displayInstructions(instructions) {
    const instructionsList = document.getElementById("instructions-list");

    const steps = instructions
        .split(/\r?\n/)
        .filter(step => step.trim() !== "");

    instructionsList.innerHTML = steps
        .map((step, index) => `
            <div
                class="flex gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors"
            >
                <div
                    class="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0"
                >
                    ${index + 1}
                </div>

                <p class="text-gray-700 leading-relaxed pt-2">
                    ${step}
                </p>
            </div>
        `)
        .join("");
}

function displayVideo(youtubeUrl) {
    const videoContainer = document.getElementById("video-container");

    if (!youtubeUrl) {
        videoContainer.innerHTML = "";
        return;
    }

    const videoId = youtubeUrl.split("v=")[1]?.split("&")[0];

    if (!videoId) {
        videoContainer.innerHTML = "";
        return;
    }

    videoContainer.innerHTML = `
        <iframe
            src="https://www.youtube.com/embed/${videoId}"
            class="absolute inset-0 w-full h-full"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
        ></iframe>
    `;
}

function displayNutrition(nutrition) {
    const perServing = nutrition.perServing;
    const totals = nutrition.totals;

    const dailyValues = {
        protein: 50,
        carbs: 275,
        fat: 78,
        fiber: 28,
        sugar: 50,
        saturatedFat: 20
    };

    const getPercentage = (value, dailyValue) => {
        return Math.min((value / dailyValue) * 100, 100);
    };

    document.getElementById("nutrition-facts-container").innerHTML = `
        <p class="text-sm text-gray-500 mb-4">Per serving</p>

        <div
            class="text-center py-4 mb-4 bg-linear-to-br from-emerald-50 to-teal-50 rounded-xl"
        >
            <p class="text-sm text-gray-600">
                Calories per serving
            </p>

            <p class="text-4xl font-bold text-emerald-600">
                ${perServing.calories}
            </p>

            <p class="text-xs text-gray-500 mt-1">
                Total: ${totals.calories} cal
            </p>
        </div>

        <div class="space-y-4">

            <!-- Protein -->
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                    <div class="w-3 h-3 rounded-full bg-emerald-500"></div>
                    <span class="text-gray-700">Protein</span>
                </div>

                <span class="font-bold text-gray-900">
                    ${perServing.protein}g
                </span>
            </div>

            <div class="w-full bg-gray-100 rounded-full h-2">
                <div
                    class="bg-emerald-500 h-2 rounded-full"
                    style="width: ${getPercentage(
                        perServing.protein,
                        dailyValues.protein
                    )}%"
                ></div>
            </div>


            <!-- Carbs -->
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                    <div class="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span class="text-gray-700">Carbs</span>
                </div>

                <span class="font-bold text-gray-900">
                    ${perServing.carbs}g
                </span>
            </div>

            <div class="w-full bg-gray-100 rounded-full h-2">
                <div
                    class="bg-blue-500 h-2 rounded-full"
                    style="width: ${getPercentage(
                        perServing.carbs,
                        dailyValues.carbs
                    )}%"
                ></div>
            </div>


            <!-- Fat -->
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                    <div class="w-3 h-3 rounded-full bg-purple-500"></div>
                    <span class="text-gray-700">Fat</span>
                </div>

                <span class="font-bold text-gray-900">
                    ${perServing.fat}g
                </span>
            </div>

            <div class="w-full bg-gray-100 rounded-full h-2">
                <div
                    class="bg-purple-500 h-2 rounded-full"
                    style="width: ${getPercentage(
                        perServing.fat,
                        dailyValues.fat
                    )}%"
                ></div>
            </div>


            <!-- Fiber -->
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                    <div class="w-3 h-3 rounded-full bg-orange-500"></div>
                    <span class="text-gray-700">Fiber</span>
                </div>

                <span class="font-bold text-gray-900">
                    ${perServing.fiber}g
                </span>
            </div>

            <div class="w-full bg-gray-100 rounded-full h-2">
                <div
                    class="bg-orange-500 h-2 rounded-full"
                    style="width: ${getPercentage(
                        perServing.fiber,
                        dailyValues.fiber
                    )}%"
                ></div>
            </div>


            <!-- Sugar -->
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                    <div class="w-3 h-3 rounded-full bg-pink-500"></div>
                    <span class="text-gray-700">Sugar</span>
                </div>

                <span class="font-bold text-gray-900">
                    ${perServing.sugar}g
                </span>
            </div>

            <div class="w-full bg-gray-100 rounded-full h-2">
                <div
                    class="bg-pink-500 h-2 rounded-full"
                    style="width: ${getPercentage(
                        perServing.sugar,
                        dailyValues.sugar
                    )}%"
                ></div>
            </div>


            <!-- Saturated Fat -->
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                    <div class="w-3 h-3 rounded-full bg-red-500"></div>
                    <span class="text-gray-700">Saturated Fat</span>
                </div>

                <span class="font-bold text-gray-900">
                    ${perServing.saturatedFat}g
                </span>
            </div>

            <div class="w-full bg-gray-100 rounded-full h-2">
                <div
                    class="bg-red-500 h-2 rounded-full"
                    style="width: ${getPercentage(
                        perServing.saturatedFat,
                        dailyValues.saturatedFat
                    )}%"
                ></div>
            </div>

        </div>

        <!-- Other -->
        <div class="mt-6 pt-6 border-t border-gray-100">

            <h3 class="text-sm font-semibold text-gray-900 mb-3">
                Other
            </h3>

            <div class="grid grid-cols-2 gap-3 text-sm">

                <div class="flex justify-between">
                    <span class="text-gray-600">
                        Cholesterol
                    </span>

                    <span class="font-medium">
                        ${perServing.cholesterol}mg
                    </span>
                </div>

                <div class="flex justify-between">
                    <span class="text-gray-600">
                        Sodium
                    </span>

                    <span class="font-medium">
                        ${perServing.sodium}mg
                    </span>
                </div>

            </div>

        </div>
    `;
}
function displayNutritionLoading() {
    document.getElementById("nutrition-facts-container").innerHTML = `
        <div class="flex flex-col items-center justify-center py-10">

            <div class="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                <i class="fa-solid fa-calculator text-emerald-600 text-xl"></i>
            </div>

            <p class="text-lg font-medium text-gray-700">
                Calculating Nutrition
            </p>

            <p class="text-sm text-gray-500 mt-1">
                Analyzing ingredients...
            </p>

            <div class="flex justify-center gap-1 mt-3">
                <span class="w-2 h-2 bg-emerald-500 rounded-full animate-loading-dot"></span>
                <span class="w-2 h-2 bg-emerald-500 rounded-full animate-loading-dot"></span>
                <span class="w-2 h-2 bg-emerald-500 rounded-full animate-loading-dot"></span>
            </div>

        </div>
    `;
}

async function getNutritionData(recipeName,ingredients) {
    const ingredientNames = ingredients.map(item => `${item.measure} ${item.name}`);

    let res = await fetch("https://nutriplan-api.vercel.app/api/nutrition/analyze", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": "boILVkOCfYqyOPYrytABVdwpcce0nK0ETal7NEes",
        },
        body: JSON.stringify({
            recipeName: recipeName,
            ingredients: ingredientNames,
        }),
    });

    let data = await res.json();
    return data.data;    
}

let currentMeal = null;
let currentNutrition = null;
async function loadMealDetails(id) {
    logMealBtn.disabled = true;
    logMealBtn.innerHTML = `
        <i class="fa-solid fa-spinner fa-spin"></i>
        <span>Loading...</span>
    `;
    logMealBtn.classList.replace("bg-blue-600","bg-gray-200")
    logMealBtn.classList.remove("hover:bg-blue-700")
    document.getElementById("log-meal-btn").dataset.mealId = id;

    // =====> Hero Section
    document.getElementById("meal-hero-image").src = "";
    document.getElementById("meal-title").textContent = "Loading...";
    document.getElementById("meal-category-badges").innerHTML = "";

    document.getElementById("ingredients-list").innerHTML = `
        <div class="flex items-center justify-center py-8 col-span-2">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
        </div>
    `;

    document.getElementById("meal-badges").innerHTML = `
        <span class="flex items-center gap-2">
            <i class="fa-solid fa-clock"></i>
            <span>30 min</span>
        </span>
        <span class="flex items-center gap-2">
            <i class="fa-solid fa-utensils"></i>
            <span id="hero-servings">
                <i class="fa-solid fa-spinner fa-spin"></i> servings
            </span>
        </span>
        <span class="flex items-center gap-2">
            <i class="fa-solid fa-fire"></i>
            <span id="hero-calories">
                Calculating...
            </span>
        </span>
    `;

    document.getElementById("ingredients-count").textContent = `0 item`
    displayNutritionLoading();

    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
    const data = await res.json();
    const meal = data.meals[0];
    currentMeal = meal;

    // ====> Hero Section
    document.getElementById("meal-hero-image").src = meal.strMealThumb;
    document.getElementById("meal-hero-image").alt = meal.strMeal;
    document.getElementById("meal-title").textContent = meal.strMeal;

    document.getElementById("recipe-source-link").href = meal.strSource;

    document.getElementById("meal-category-badges").innerHTML = `
        <span
            class="px-3 py-1 bg-emerald-500 text-white text-sm font-semibold rounded-full"
            >${meal.strCategory}</span>
        <span
            class="px-3 py-1 bg-blue-500 text-white text-sm font-semibold rounded-full"
            >${meal.strArea}</span>
        ${
            meal.strTags ? `
            <span
                class="px-3 py-1 bg-purple-500 text-white text-sm font-semibold rounded-full"
            >${meal.strTags}</span>` : ''
        }
    `

    try {
        const ingredients = getIngredientsList(meal);

        displayIngredients(ingredients);
        displayInstructions(meal.strInstructions);
        displayVideo(meal.strYoutube);
        
        
        const nutrition = await getNutritionData(meal.strMeal, ingredients);
        currentNutrition = nutrition;
        displayNutrition(nutrition);

        logMealBtn.disabled = false;
        logMealBtn.innerHTML = `
                <i class="fa-solid fa-clipboard-list"></i>
                <span>Log This Meal</span>
            `;
        logMealBtn.classList.replace("bg-gray-200","bg-blue-600")
        logMealBtn.classList.add("hover:bg-blue-700")


        document.getElementById("meal-badges").innerHTML = `
            <span class="flex items-center gap-2">
                <i class="fa-solid fa-clock"></i>
                <span>30 min</span>
            </span>
            <span class="flex items-center gap-2">
                <i class="fa-solid fa-utensils"></i>
                <span id="hero-servings">${nutrition.servings} servings</span>
            </span>
            <span class="flex items-center gap-2">
                <i class="fa-solid fa-fire"></i>
                <span id="hero-calories">${nutrition.perServing.calories} cal/serving</span>
            </span>
        `;

        document.getElementById("ingredients-count").textContent = `${nutrition.ingredients.length} item`


    } catch (error) {
        console.error("Nutrition API error:", error);
        document.getElementById("meal-badges").innerHTML = `
            <span class="flex items-center gap-2 text-red-500">
                <i class="fa-solid fa-triangle-exclamation"></i>
                <span>Nutrition data unavailable</span>
            </span>
        `;

        logMealBtn.disabled = true;
        logMealBtn.innerHTML = `
            <i class="fa-solid fa-triangle-exclamation"></i>
            <span>Unavailable</span>
        `;
    }
}


// ===============================
// Log Meal Modal
// ===============================

const logMealBtn = document.getElementById("log-meal-btn");
const logMealModal = document.getElementById("log-meal-modal");
const cancelLogBtn = document.getElementById("cancel-log-meal");

const modalMealImage = document.getElementById("modal-meal-image");
const modalMealName = document.getElementById("modal-meal-name");

const modalCalories = document.getElementById("modal-calories");
const modalProtein = document.getElementById("modal-protein");
const modalCarbs = document.getElementById("modal-carbs");
const modalFat = document.getElementById("modal-fat");

const decreaseServingsBtn = document.getElementById("decrease-servings");
const increaseServingsBtn = document.getElementById("increase-servings");
const mealServingsInput = document.getElementById("meal-servings");
const confirmLogMealBtn = document.getElementById("confirm-log-meal");



function openLogMealModal() {

    if (!currentMeal || !currentNutrition) return;

    modalMealImage.src = currentMeal.strMealThumb;
    modalMealImage.alt = currentMeal.strMeal;

    modalMealName.textContent = currentMeal.strMeal;

    mealServingsInput.value = 1;

    updateModalNutrition();

    logMealModal.classList.remove("hidden");
}

logMealBtn.addEventListener("click", openLogMealModal);

cancelLogBtn.addEventListener("click", () => {
    logMealModal.classList.add("hidden");
});



function updateModalNutrition() {

    if (!currentNutrition) return;

    const servings = Number(mealServingsInput.value);

    const perServing = currentNutrition.perServing;

    modalCalories.textContent = Math.round(
        perServing.calories * servings
    );

    modalProtein.textContent = `${Math.round(
        perServing.protein * servings
    )}g`;

    modalCarbs.textContent = `${Math.round(
        perServing.carbs * servings
    )}g`;

    modalFat.textContent = `${Math.round(
        perServing.fat * servings
    )}g`;
}

increaseServingsBtn.addEventListener("click", () => {

    let servings = Number(mealServingsInput.value);

    if (servings < 10) {
        servings += 0.5;

        mealServingsInput.value = servings;

        updateModalNutrition();
    }
});

decreaseServingsBtn.addEventListener("click", () => {

    let servings = Number(mealServingsInput.value);

    if (servings > 0.5) {
        servings -= 0.5;

        mealServingsInput.value = servings;

        updateModalNutrition();
    }
});

mealServingsInput.addEventListener("input", () => {

    let servings = Number(mealServingsInput.value);

    if (servings < 0.5) {
        servings = 0.5;
    }

    if (servings > 10) {
        servings = 10;
    }

    mealServingsInput.value = servings;

    updateModalNutrition();
});

// == Nutrition math
function getModalNutrition() {

    const servings = Number(mealServingsInput.value);
    const perServing = currentNutrition.perServing;

    return {
        servings,
        calories: Math.round(perServing.calories * servings),
        protein: Math.round(perServing.protein * servings),
        carbs: Math.round(perServing.carbs * servings),
        fat: Math.round(perServing.fat * servings)
    };
}

confirmLogMealBtn.addEventListener("click", () => {

    const nutrition = getModalNutrition();

        const loggedMeal = {
        id: currentMeal.idMeal,
        name: currentMeal.strMeal,
        image: currentMeal.strMealThumb,

        servings: nutrition.servings,

        calories: nutrition.calories,
        protein: nutrition.protein,
        carbs: nutrition.carbs,
        fat: nutrition.fat,

        loggedAt: new Date().toISOString()
    };

    const loggedMeals =
        JSON.parse(localStorage.getItem("loggedMeals")) || [];

    loggedMeals.push(loggedMeal);

    localStorage.setItem(
        "loggedMeals",
        JSON.stringify(loggedMeals)
    );

    renderFoodLog();
    updateFoodLogNutrition();
    updateWeeklyChart()

    logMealModal.classList.add("hidden");

    // Success Message
    Swal.fire({
        position: "center",
        icon: "success",
        title: "Meal Logged!",
        html: `
            <p>${currentMeal.strMeal} has been added to your daily log.</p>
            <p style="color: #16a34a; font-weight: 700; margin-top: 10px;">
                ${Math.round(modalCalories.textContent)} Calories
            </p>
        `,  
        showConfirmButton: false,
        timer: 1500
    });

});



// ========.. Food Log << ========

export function updateFoodLogNutrition() {

    const loggedMeals =
        JSON.parse(localStorage.getItem("loggedMeals")) || [];

    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;

    loggedMeals.forEach(meal => {

        totalCalories += Number(meal.calories) || 0;
        totalProtein += Number(meal.protein) || 0;
        totalCarbs += Number(meal.carbs) || 0;
        totalFat += Number(meal.fat) || 0;

    });

    updateProgressBar(
        "calories-progress-bar",
        "calories-progress-text",
        totalCalories,
        2000,
        "kcal"
    );

    updateProgressBar(
        "protein-progress-bar",
        "protein-progress-text",
        totalProtein,
        50,
        "g"
    );

    updateProgressBar(
        "carbs-progress-bar",
        "carbs-progress-text",
        totalCarbs,
        250,
        "g"
    );

    updateProgressBar(
        "fat-progress-bar",
        "fat-progress-text",
        totalFat,
        65,
        "g"
    );
}

function updateProgressBar(barId, textId, currentValue, targetValue, unit) {

    const bar = document.getElementById(barId);
    const text = document.getElementById(textId);

    if (!bar || !text) return;

    const percentage = (currentValue / targetValue) * 100;

    const width = Math.min(percentage, 100);

    bar.style.width = `${width}%`;

    text.textContent = `${Math.round(currentValue)} / ${targetValue} ${unit}`;

    // Reset colors
    bar.classList.remove(
        "bg-emerald-500",
        "bg-blue-500",
        "bg-amber-500",
        "bg-purple-500",
        "bg-red-500"
    );

    // If target reached
    if (percentage >= 100) {
        bar.classList.add("bg-red-500");
    } else {

        if (barId === "calories-progress-bar") {
            bar.classList.add("bg-emerald-500");
        }

        if (barId === "protein-progress-bar") {
            bar.classList.add("bg-blue-500");
        }

        if (barId === "carbs-progress-bar") {
            bar.classList.add("bg-amber-500");
        }

        if (barId === "fat-progress-bar") {
            bar.classList.add("bg-purple-500");
        }
    }
}

export function renderFoodLog() {
    const loggedItemsList = document.getElementById("logged-items-list");
    const loggedItemsCount = document.getElementById("logged-items-count");
    const clearFoodLog = document.getElementById("clear-foodlog");
    const loggedMeals = JSON.parse(localStorage.getItem("loggedMeals")) || [];
    loggedItemsCount.textContent = `Logged Items (${loggedMeals.length})`;

    if (loggedMeals.length > 0) {
        clearFoodLog.style.display = "block";
    } else {
        clearFoodLog.style.display = "none";
    }

    if (loggedMeals.length === 0) {
        loggedItemsList.innerHTML = `
            <div class="text-center py-8 text-gray-500">
                <i class="fa-solid fa-utensils text-4xl mb-3 text-gray-300"></i>
                <p class="font-medium">No meals logged today</p>
                <p class="text-sm">
                    Add meals from the Meals page or scan products
                </p>
            </div>
        `;

        return;
    }

    loggedItemsList.innerHTML = loggedMeals.map((meal, index) => {

        const date = new Date(meal.loggedAt);

        const time = date.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit"
        });

        return `
            <div class="flex items-center justify-between bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-all">

                <div class="flex items-center gap-4">

                    <img
                        src="${meal.image}"
                        alt="${meal.name}"
                        class="w-14 h-14 rounded-xl object-cover"
                    >

                    <div>
                        <p class="font-semibold text-gray-900">
                            ${meal.name}
                        </p>

                        <p class="text-sm text-gray-500">
                            ${meal.servings} ${meal.servings == 1 ? "serving" : "servings"}
                            <span class="mx-1">•</span>
                            <span class="text-emerald-600">Recipe</span>
                        </p>

                        <p class="text-xs text-gray-400 mt-1">
                            ${time}
                        </p>
                    </div>

                </div>

                <div class="flex items-center gap-4">

                    <div class="text-right">
                        <p class="text-lg font-bold text-emerald-600">
                            ${meal.calories}
                        </p>

                        <p class="text-xs text-gray-500">
                            kcal
                        </p>
                    </div>

                    <div class="hidden md:flex gap-2 text-xs text-gray-500">

                        <span class="px-2 py-1 bg-blue-50 rounded">
                            ${meal.protein}g P
                        </span>

                        <span class="px-2 py-1 bg-amber-50 rounded">
                            ${meal.carbs}g C
                        </span>

                        <span class="px-2 py-1 bg-purple-50 rounded">
                            ${meal.fat}g F
                        </span>

                    </div>

                    <button
                        class="remove-foodlog-item text-gray-400 hover:text-red-500 transition-all p-2"
                        data-index="${index}"
                    >
                        <i class="fa-solid fa-trash-can"></i>
                    </button>

                </div>

            </div>
        `;
    }).join("");
}

document.getElementById("clear-foodlog").addEventListener("click", function () {

    Swal.fire({
        title: "Clear Today's Log?",
        text: "This will remove all logged food items for today.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete all!"
    }).then((result) => {

        if (result.isConfirmed) {

            localStorage.removeItem("loggedMeals");

            renderFoodLog();
            updateFoodLogNutrition();
            updateWeeklyChart();

            Swal.fire({
                title: "Deleted!",
                text: "All meals have been removed from your food log.",
                icon: "success"
            });

        }

    });

});

document.addEventListener("click", function (e) {

    const removeButton = e.target.closest(".remove-foodlog-item");

    if (!removeButton) return;

    const index = Number(removeButton.dataset.index);

    const loggedMeals =
        JSON.parse(localStorage.getItem("loggedMeals")) || [];

    loggedMeals.splice(index, 1);

    localStorage.setItem(
        "loggedMeals",
        JSON.stringify(loggedMeals)
    );

    renderFoodLog();
    updateFoodLogNutrition();
    updateWeeklyChart()

});


// ==---- Weekly Overview ...

export function updateWeeklyChart() {
    const chart = document.getElementById("weekly-chart");

    const loggedMeals =
        JSON.parse(localStorage.getItem("loggedMeals")) || [];

    const days = [];
    const calories = [];

    // آخر 7 أيام
    for (let i = 6; i >= 0; i--) {
        const date = new Date();

        date.setHours(0, 0, 0, 0);
        date.setDate(date.getDate() - i);

        days.push(
            date.toLocaleDateString("en-US", {
                weekday: "short"
            })
        );

        const dailyCalories = loggedMeals
            .filter(meal => {
                const mealDate = new Date(meal.loggedAt);

                return (
                    mealDate.getFullYear() === date.getFullYear() &&
                    mealDate.getMonth() === date.getMonth() &&
                    mealDate.getDate() === date.getDate()
                );
            })
            .reduce((total, meal) => {
                return total + Number(meal.calories || 0);
            }, 0);

        calories.push(dailyCalories);
    }

    Plotly.newPlot(
        chart,
        [
            {
                x: days,
                y: calories,
                type: "scatter",
                mode: "lines+markers",

                line: {
                    shape: "spline",
                    width: 3
                },

                marker: {
                    size: 8
                },

                hovertemplate:
                    "<b>%{x}</b><br>" +
                    "%{y:,} kcal" +
                    "<extra></extra>"
            }
        ],
        {
            height: 256,

            margin: {
                t: 20,
                r: 20,
                b: 45,
                l: 55
            },

            xaxis: {
                title: "",
                fixedrange: true,

                tickmode: "array",
                tickvals: days,
                ticktext: days,

                showgrid: false
            },

            yaxis: {
                title: "Calories (kcal)",
                fixedrange: true,

                rangemode: "tozero",

                gridcolor: "#e5e7eb"
            },

            hovermode: "x unified",

            dragmode: false,

            plot_bgcolor: "transparent",
            paper_bgcolor: "transparent"
        },
        {
            responsive: true,

            displayModeBar: false,

            scrollZoom: false,

            doubleClick: false,

            staticPlot: false
        }
    );
}

// ====.>> food log date
export function updateFoodLogDate() {

    const foodLogDate = document.getElementById("foodlog-date");

    const today = new Date();

    const formattedDate = today.toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric"
    });

    foodLogDate.textContent = formattedDate;
}



// =======>>> view-toggle
const gridColsClasses = ["grid-cols-1", "sm:grid-cols-2", "lg:grid-cols-4"];
const listColsClasses = ["grid-cols-1", "md:grid-cols-2"];

const gridBtn = document.getElementById("grid-view-btn");
const listBtn = document.getElementById("list-view-btn");
const recipesContainer = document.getElementById("recipes-grid");

recipesContainer.classList.add(...gridColsClasses);

function setActiveButton(activeBtn, inactiveBtn) {
    activeBtn.classList.add("bg-white", "shadow-sm");
    activeBtn.querySelector("i").classList.remove("text-gray-500");
    activeBtn.querySelector("i").classList.add("text-gray-700");

    inactiveBtn.classList.remove("bg-white", "shadow-sm");
    inactiveBtn.querySelector("i").classList.remove("text-gray-700");
    inactiveBtn.querySelector("i").classList.add("text-gray-500");
}

gridBtn.addEventListener("click", () => {
    if (currentView === "grid") return;

    currentView = "grid";
    recipesContainer.classList.remove(...listColsClasses);
    recipesContainer.classList.add(...gridColsClasses);
    setActiveButton(gridBtn, listBtn);
    displayRecipes(dataRecipes);
});

listBtn.addEventListener("click", () => {
    if (currentView === "list") return;

    currentView = "list";
    recipesContainer.classList.remove(...gridColsClasses);
    recipesContainer.classList.add(...listColsClasses);
    setActiveButton(listBtn, gridBtn);
    displayRecipes(dataRecipes);
});


// ====> END <==



// Barcode Section


// =======>>> Product Scanner <<<=======

const productSearchInput = document.getElementById("product-search-input");
const searchProductBtn = document.getElementById("search-product-btn");
const productsGrid = document.getElementById("products-grid");
const productsCount = document.getElementById("products-count");
const nutriScoreFilters = document.querySelectorAll(".nutri-score-filter");

const PRODUCTS_API_BASE = "https://nutriplan-api.vercel.app/api";

function createProductCard(product) {
    const gradeColors = {
        a: "bg-green-500",
        b: "bg-lime-500",
        c: "bg-yellow-500",
        d: "bg-orange-500",
        e: "bg-red-500"
    };

    const grade = (product.nutritionGrade || "").toLowerCase();
    const gradeColor = gradeColors[grade] || "bg-gray-400";

    return `
        <div
            class="product-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group"
            data-barcode="${product.barcode}"
        >
            <div class="relative h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
                <img
                    class="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                    src="${product.image || ""}"
                    alt="${product.name}"
                    loading="lazy"
                    onerror="this.style.display='none'"
                />

                ${grade ? `
                <div class="absolute top-2 left-2 ${gradeColor} text-white text-xs font-bold px-2 py-1 rounded uppercase">
                    Nutri-Score ${grade}
                </div>` : ""}

                ${product.novaGroup ? `
                <div
                    class="absolute top-2 right-2 bg-lime-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center"
                    title="NOVA ${product.novaGroup}"
                >
                    ${product.novaGroup}
                </div>` : ""}
            </div>

            <div class="p-4">
                <p class="text-xs text-emerald-600 font-semibold mb-1 truncate">
                    ${product.brand || "Unknown Brand"}
                </p>
                <h3 class="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                    ${product.name || "Unnamed Product"}
                </h3>

                <div class="flex items-center gap-3 text-xs text-gray-500 mb-3">
                    <span><i class="fa-solid fa-fire mr-1"></i>${Math.round(product.nutrients?.calories || 0)} kcal/100g</span>
                </div>

                <div class="grid grid-cols-4 gap-1 text-center">
                    <div class="bg-emerald-50 rounded p-1.5">
                        <p class="text-xs font-bold text-emerald-700">${Math.round(product.nutrients?.protein ?? 0)}g</p>
                        <p class="text-[10px] text-gray-500">Protein</p>
                    </div>
                    <div class="bg-blue-50 rounded p-1.5">
                        <p class="text-xs font-bold text-blue-700">${Math.round(product.nutrients?.carbs ?? 0)}g</p>
                        <p class="text-[10px] text-gray-500">Carbs</p>
                    </div>
                    <div class="bg-purple-50 rounded p-1.5">
                        <p class="text-xs font-bold text-purple-700">${Math.round(product.nutrients?.fat ?? 0)}g</p>
                        <p class="text-[10px] text-gray-500">Fat</p>
                    </div>
                    <div class="bg-orange-50 rounded p-1.5">
                        <p class="text-xs font-bold text-orange-700">${Math.round(product.nutrients?.sugar ?? 0)}g</p>
                        <p class="text-[10px] text-gray-500">Sugar</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

let currentProducts = [];
let activeGrade = "";
function displayProducts(products) {
    currentProducts = products || [];

    const filtered = activeGrade
        ? currentProducts.filter(p => (p.nutritionGrade || "").toLowerCase() === activeGrade)
        : currentProducts;

    if (!filtered || filtered.length === 0) {
        productsGrid.innerHTML = `
            <div class="col-span-full flex flex-col items-center justify-center py-12 text-center">
                <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <i class="fa-solid fa-search text-gray-400 text-2xl"></i>
                </div>
                <p class="text-gray-500 text-lg">No products found</p>
                <p class="text-gray-400 text-sm mt-2">Try searching for something else</p>
            </div>
        `;
        productsCount.textContent = "Showing 0 products";
        return;
    }

    productsGrid.innerHTML = filtered.map(createProductCard).join("");
    productsCount.textContent = `Showing ${filtered.length} products`;
}

nutriScoreFilters.forEach((btn) => {
    btn.addEventListener("click", () => {
        activeGrade = btn.dataset.grade;

        nutriScoreFilters.forEach((b) => {
            b.classList.remove("ring-2", "ring-offset-1", "ring-gray-900");
        });

        btn.classList.add("ring-2", "ring-offset-1", "ring-gray-900");

        displayProducts(currentProducts);
    });
});

async function searchProducts() {
    const query = productSearchInput.value.trim();

    if (query === "") return;

    productsGrid.innerHTML = `
        <div class="col-span-full flex items-center justify-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
    `;
    productsCount.textContent = "Searching...";

    try {
        const res = await fetch(`${PRODUCTS_API_BASE}/products/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();

        displayProducts(data.results);
    } catch (error) {
        console.error("Product search error:", error);
        productsGrid.innerHTML = `
            <div class="col-span-full text-center py-12 text-red-500">
                Something went wrong. Please try again.
            </div>
        `;
        productsCount.textContent = "";
    }
}

searchProductBtn.addEventListener("click", searchProducts);

productSearchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        searchProducts();
    }
});

// 
const barcodeInput = document.getElementById("barcode-input");
const lookupBarcodeBtn = document.getElementById("lookup-barcode-btn");

async function lookupBarcode() {
    const barcode = barcodeInput.value.trim();

    if (barcode === "") return;

    productsGrid.innerHTML = `
        <div class="col-span-full flex items-center justify-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
    `;
    productsCount.textContent = "Looking up...";

    try {
        const res = await fetch(`${PRODUCTS_API_BASE}/products/barcode/${barcode}`);

        if (!res.ok) {
            displayProducts([]);
            return;
        }

        const data = await res.json();

        displayProducts(data.result ? [data.result] : []);
    } catch (error) {
        console.error("Barcode lookup error:", error);
        productsGrid.innerHTML = `
            <div class="col-span-full text-center py-12 text-red-500">
                Something went wrong. Please try again.
            </div>
        `;
        productsCount.textContent = "";
    }
}

lookupBarcodeBtn.addEventListener("click", lookupBarcode);

barcodeInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        lookupBarcode();
    }
});

// 
const productCategories = document.getElementById("product-categories");

async function loadProductsByCategory(categoryId) {
    productsGrid.innerHTML = `
        <div class="col-span-full flex items-center justify-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
    `;
    productsCount.textContent = "Loading...";

    try {
        const res = await fetch(`${PRODUCTS_API_BASE}/products/category/${categoryId}`);
        const data = await res.json();

        displayProducts(data.results);
    } catch (error) {
        console.error("Category load error:", error);
        productsGrid.innerHTML = `
            <div class="col-span-full text-center py-12 text-red-500">
                Something went wrong. Please try again.
            </div>
        `;
        productsCount.textContent = "";
    }
}

productCategories.addEventListener("click", (e) => {
    const clickedBtn = e.target.closest(".product-category-btn");
    if (!clickedBtn) return;

    const categoryId = clickedBtn.dataset.category;
    loadProductsByCategory(categoryId);
});


/* product module */
const productDetailsModal = document.getElementById("product-details-modal");
const productModalContent = document.getElementById("product-modal-content");

const gradeInfo = {
    a: { color: "#1e8f4e", label: "Excellent" },
    b: { color: "#68b912", label: "Good" },
    c: { color: "#f8b100", label: "Average" },
    d: { color: "#ee8100", label: "Poor" },
    e: { color: "#e63e11", label: "Bad" }
};

const novaInfo = {
    1: "Unprocessed",
    2: "Processed culinary",
    3: "Processed",
    4: "Ultra-processed"
};

const novaColors = {
    1: "#1e8f4e",
    2: "#f8b100",
    3: "#ee8100",
    4: "#e63e11"
};


let currentProduct = null;
function buildProductModalHTML(product) {
    const grade = (product.nutritionGrade || "").toLowerCase();
    const gInfo = gradeInfo[grade];
    const nInfo = novaInfo[product.novaGroup];
    const n = product.nutrients || {};

    const calories = Math.round(n.calories || 0);
    const protein = Math.round((n.protein || 0) * 10) / 10;
    const carbs = Math.round((n.carbs || 0) * 10) / 10;
    const fat = Math.round((n.fat || 0) * 10) / 10;
    const sugar = Math.round((n.sugar || 0) * 10) / 10;
    const fiber = n.fiber !== undefined ? Math.round(n.fiber * 10) / 10 : undefined;
    const sodium = n.sodium !== undefined ? Math.round(n.sodium * 1000) / 1000 : undefined;
    const salt = n.salt !== undefined ? Math.round(n.salt * 1000) / 1000 : undefined;
    const saturatedFat = n.saturatedFat !== undefined ? Math.round(n.saturatedFat * 10) / 10 : undefined;

    const maxVal = Math.max(protein, carbs, fat, sugar, 1);

    return `
        <div class="p-6">
            <!-- Header -->
            <div class="flex items-start gap-6 mb-6">
                <div class="w-32 h-32 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden shrink-0">
                    <img src="${product.image || ""}" alt="${product.name || ""}" class="w-full h-full object-contain">
                </div>
                <div class="flex-1">
                    <p class="text-sm text-emerald-600 font-semibold mb-1">${product.brand || "Unknown Brand"}</p>
                    <h2 class="text-2xl font-bold text-gray-900 mb-2">${product.name || "Unnamed Product"}</h2>

                    <div class="flex items-center gap-3">
                        ${gInfo ? `
                        <div class="flex items-center gap-2 px-3 py-1.5 rounded-lg" style="background-color: ${gInfo.color}20">
                            <span class="w-8 h-8 rounded flex items-center justify-center text-white font-bold" style="background-color: ${gInfo.color}">
                                ${grade.toUpperCase()}
                            </span>
                            <div>
                                <p class="text-xs font-bold" style="color: ${gInfo.color}">Nutri-Score</p>
                                <p class="text-[10px] text-gray-600">${gInfo.label}</p>
                            </div>
                        </div>` : ""}

                        ${nInfo ? `
                        <div class="flex items-center gap-2 px-3 py-1.5 rounded-lg" style="background-color: ${novaColors[product.novaGroup]}20">
                            <span class="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold" style="background-color: ${novaColors[product.novaGroup]}">
                                ${product.novaGroup}
                            </span>
                            <div>
                                <p class="text-xs font-bold" style="color: ${novaColors[product.novaGroup]}">NOVA</p>
                                <p class="text-[10px] text-gray-600">${nInfo}</p>
                            </div>
                        </div>` : ""}
                    </div>
                </div>
                <button class="close-product-modal text-gray-400 hover:text-gray-600">
                    <i class="fa-solid fa-xmark text-2xl"></i>
                </button>
            </div>

            <!-- Nutrition Facts -->
            <div class="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-5 mb-6 border border-emerald-200">
                <h3 class="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <i class="fa-solid fa-chart-pie text-emerald-600"></i>
                    Nutrition Facts <span class="text-sm font-normal text-gray-500">(per 100g)</span>
                </h3>

                <div class="text-center mb-4 pb-4 border-b border-emerald-200">
                    <p class="text-4xl font-bold text-gray-900">${calories}</p>
                    <p class="text-sm text-gray-500">Calories</p>
                </div>

                <div class="grid grid-cols-4 gap-4">
                    <div class="text-center">
                        <div class="w-full bg-gray-200 rounded-full h-2 mb-2">
                            <div class="bg-emerald-500 h-2 rounded-full" style="width: ${(protein / maxVal) * 100}%"></div>
                        </div>
                        <p class="text-lg font-bold text-emerald-600">${protein}g</p>
                        <p class="text-xs text-gray-500">Protein</p>
                    </div>
                    <div class="text-center">
                        <div class="w-full bg-gray-200 rounded-full h-2 mb-2">
                            <div class="bg-blue-500 h-2 rounded-full" style="width: ${(carbs / maxVal) * 100}%"></div>
                        </div>
                        <p class="text-lg font-bold text-blue-600">${carbs}g</p>
                        <p class="text-xs text-gray-500">Carbs</p>
                    </div>
                    <div class="text-center">
                        <div class="w-full bg-gray-200 rounded-full h-2 mb-2">
                            <div class="bg-purple-500 h-2 rounded-full" style="width: ${(fat / maxVal) * 100}%"></div>
                        </div>
                        <p class="text-lg font-bold text-purple-600">${fat}g</p>
                        <p class="text-xs text-gray-500">Fat</p>
                    </div>
                    <div class="text-center">
                        <div class="w-full bg-gray-200 rounded-full h-2 mb-2">
                            <div class="bg-orange-500 h-2 rounded-full" style="width: ${(sugar / maxVal) * 100}%"></div>
                        </div>
                        <p class="text-lg font-bold text-orange-600">${sugar}g</p>
                        <p class="text-xs text-gray-500">Sugar</p>
                    </div>
                </div>

                ${(saturatedFat !== undefined || fiber !== undefined || salt !== undefined || sodium !== undefined) ? `
                <div class="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-emerald-200">
                    ${saturatedFat !== undefined ? `
                    <div class="text-center">
                        <p class="text-sm font-semibold text-gray-900">${saturatedFat}g</p>
                        <p class="text-xs text-gray-500">Saturated Fat</p>
                    </div>` : ""}
                    ${fiber !== undefined ? `
                    <div class="text-center">
                        <p class="text-sm font-semibold text-gray-900">${fiber}g</p>
                        <p class="text-xs text-gray-500">Fiber</p>
                    </div>` : ""}
                    ${(salt !== undefined || sodium !== undefined) ? `
                    <div class="text-center">
                        <p class="text-sm font-semibold text-gray-900">${salt !== undefined ? salt : sodium}g</p>
                        <p class="text-xs text-gray-500">${salt !== undefined ? "Salt" : "Sodium"}</p>
                    </div>` : ""}
                </div>` : ""}
            </div>

            ${product.ingredients ? `
            <div class="bg-gray-50 rounded-xl p-5 mb-6">
                <h3 class="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <i class="fa-solid fa-list text-gray-600"></i>
                    Ingredients
                </h3>
                <p class="text-sm text-gray-600 leading-relaxed">${product.ingredients}</p>
            </div>` : ""}

            ${product.allergens ? `
            <div class="bg-red-50 rounded-xl p-5 mb-6 border border-red-200">
                <h3 class="font-bold text-red-700 mb-2 flex items-center gap-2">
                    <i class="fa-solid fa-triangle-exclamation"></i>
                    Allergens
                </h3>
                <p class="text-sm text-red-600">${product.allergens}</p>
            </div>` : ""}

            <!-- Actions -->
            <div class="flex gap-3">
                <button class="add-product-to-log flex-1 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-all" data-barcode="${product.barcode}">
                    <i class="fa-solid fa-plus mr-2"></i>Log This Food
                </button>
                <button class="close-product-modal flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all">
                    Close
                </button>
            </div>
        </div>
    `;
}

function openProductModal(product) {
    currentProduct = product;
    productModalContent.innerHTML = buildProductModalHTML(product);
    productDetailsModal.classList.remove("hidden");
}

productsGrid.addEventListener("click", (e) => {
    const card = e.target.closest(".product-card");
    if (!card) return;

    const barcode = card.dataset.barcode;
    const product = currentProducts.find(p => p.barcode === barcode);

    if (product) {
        openProductModal(product);
    }
});

productDetailsModal.addEventListener("click", (e) => {
    if (e.target.closest(".close-product-modal")) {
        productDetailsModal.classList.add("hidden");
    }
});

productDetailsModal.addEventListener("click", (e) => {
    const logBtn = e.target.closest(".add-product-to-log");
    if (!logBtn || !currentProduct) return;

    const n = currentProduct.nutrients || {};

    const loggedProduct = {
        id: currentProduct.barcode,
        name: currentProduct.name,
        image: currentProduct.image,

        servings: 1,

        calories: Math.round(n.calories || 0),
        protein: Math.round(n.protein || 0),
        carbs: Math.round(n.carbs || 0),
        fat: Math.round(n.fat || 0),

        loggedAt: new Date().toISOString()
    };

    const loggedMeals = JSON.parse(localStorage.getItem("loggedMeals")) || [];
    loggedMeals.push(loggedProduct);
    localStorage.setItem("loggedMeals", JSON.stringify(loggedMeals));

    renderFoodLog();
    updateFoodLogNutrition();
    updateWeeklyChart();

    productDetailsModal.classList.add("hidden");

    Swal.fire({
        toast: true,
        position: "bottom-end",
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true,
        background: "#059669",
        color: "#ffffff",
        customClass: {
            popup: "rounded-xl"
        },
        html: `
            <div style="display: flex; align-items: center; gap: 10px; font-size: 14px;">
                <span>${currentProduct.brand} logged to your daily intake!</span>
                <i class="fa-solid fa-clipboard-list"></i>
            </div>
        `
    });
});
