import { strArea, mealType, recipeShowing, renderFoodLog, updateFoodLogNutrition, updateWeeklyChart, updateFoodLogDate} from "./ui/components.js"


/**
 * NutriPlan - Main Entry Point
 * 
 * This is the main entry point for the application.
 * Import your modules and initialize the app here.
 */

/* ====== DOM ====== */
const navLink = document.querySelectorAll(".nav-link")
const nutriPlanContant = document.querySelectorAll(".nutri-plan-contant")
const quickLogBtns = document.querySelectorAll(".quick-log-btn");


//  =====> sidebar open Link
function navigateToSection(sectionId) {

    nutriPlanContant.forEach((content) => {
        content.classList.add("hidden");
    });

    document.getElementById("meal-details").classList.add("hidden");

    const targetSection = document.getElementById(sectionId);

    if (!targetSection) return;

    targetSection.classList.remove("hidden");

    updateHeader(sectionId);

    navLink.forEach((btn) => {
        btn.classList.remove(
            "bg-emerald-50",
            "text-emerald-700"
        );

        btn.classList.add(
            "text-gray-600",
            "hover:bg-gray-50"
        );
    });

    const activeLink = document.querySelector(
        `.nav-link[href="#${sectionId}"]`
    );

    if (activeLink) {
        activeLink.classList.remove(
            "text-gray-600",
            "hover:bg-gray-50"
        );

        activeLink.classList.add(
            "bg-emerald-50",
            "text-emerald-700"
        );
    }
}

navLink.forEach((link) => {

    link.addEventListener("click", function () {

        const sectionId = this.getAttribute("href").substring(1);

        navigateToSection(sectionId);

    });

});

quickLogBtns.forEach((button) => {

    button.addEventListener("click", function () {

        const targetSection = this.dataset.target;

        navigateToSection(targetSection);

    });

});

// =======>> meal-details (open/close) <<=======
export function showMealDetails() {
    nutriPlanContant.forEach((contant) => {
        contant.classList.add("hidden");
    });
    document.getElementById("meal-details").classList.remove("hidden");
    updateHeader("meal-details");
}
export function backToRecipes() {
    document.getElementById("meal-details").classList.add("hidden");
    document.getElementById("home").classList.remove("hidden");
    updateHeader("home");
}
document.getElementById("back-to-meals-btn").addEventListener("click", backToRecipes);

// =====. sidebar (open/close) resp
document.getElementById("header-menu-btn").addEventListener('click', () => {
    document.getElementById("sidebar").classList.toggle("open");
});
document.getElementById("sidebar-close-btn").addEventListener('click', () => {
    document.getElementById("sidebar").classList.remove("open");
});

// ==========.. header & para <<<=======

const sectionHeaders = {
    "home": {
        title: "Meals & Recipes",
        subtitle: "Discover delicious and nutritious recipes tailored for you"
    },
    "products-section": {
        title: "Product Scanner",
        subtitle: "Search packaged foods by name or barcode"
    },
    "foodlog-section": {
        title: "Food Log",
        subtitle: "Track your daily nutrition and food intake"
    },
    "meal-details": {
        title: "Recipe Details",
        subtitle: "View full recipe information and nutrition facts"
    }
};

function updateHeader(sectionId) {
    const section = sectionHeaders[sectionId];
    if (!section) return;

    document.querySelector("#header h1").textContent = section.title;
    document.querySelector("#header p").textContent = section.subtitle;
}

// =======>>> call API`s <<<=======
async function initializeApp() {
    const loadingOverlay = document.getElementById("app-loading-overlay");

    try {
        await Promise.all([
            strArea(),
            mealType(),
            recipeShowing()
        ]);

        renderFoodLog();

    } catch (error) {
        console.error("App initialization error:", error);

    } finally {
        loadingOverlay.classList.add("opacity-0");

        setTimeout(() => {
            loadingOverlay.classList.add("hidden");
        }, 500);
    }
}

initializeApp();
updateFoodLogNutrition()
updateWeeklyChart()
updateFoodLogDate()