/* =========================================
   THERMOX — TEMPERATURE CONVERTER
   ========================================= */

// -----------------------------------------
// Get HTML elements
// -----------------------------------------

const temperatureInput =
    document.getElementById("temperature");

const fromUnit =
    document.getElementById("fromUnit");

const toUnit =
    document.getElementById("toUnit");

const convertButton =
    document.getElementById("convertButton");

const clearButton =
    document.getElementById("clearButton");

const swapButton =
    document.getElementById("swapButton");

const clearHistoryButton =
    document.getElementById("clearHistory");

const resultValue =
    document.getElementById("resultValue");

const resultFormula =
    document.getElementById("resultFormula");

const resultBox =
    document.getElementById("resultBox");

const errorMessage =
    document.getElementById("errorMessage");

const inputSymbol =
    document.getElementById("inputSymbol");

const visualTemperature =
    document.getElementById("visualTemperature");

const historyList =
    document.getElementById("historyList");


// -----------------------------------------
// Unit symbols
// -----------------------------------------

const symbols = {
    celsius: "°C",
    fahrenheit: "°F",
    kelvin: "K"
};


// -----------------------------------------
// Unit names
// -----------------------------------------

const unitNames = {
    celsius: "Celsius",
    fahrenheit: "Fahrenheit",
    kelvin: "Kelvin"
};


// -----------------------------------------
// Conversion history
// -----------------------------------------

let conversionHistory = [];


// -----------------------------------------
// Update input symbol
// -----------------------------------------

function updateInputSymbol() {

    inputSymbol.textContent =
        symbols[fromUnit.value];

}


// -----------------------------------------
// Convert temperature
// -----------------------------------------

function convertTemperature() {

    const rawValue =
        temperatureInput.value.trim();


    // Check empty input
    if (rawValue === "") {

        showError(
            "Please enter a temperature value first."
        );

        return;
    }


    const temperature = Number(rawValue);


    // Check invalid number
    if (!Number.isFinite(temperature)) {

        showError(
            "Please enter a valid numeric temperature."
        );

        return;
    }


    // Check absolute zero
    if (
        fromUnit.value === "celsius" &&
        temperature < -273.15
    ) {

        showError(
            "Celsius cannot be below −273.15°C."
        );

        return;
    }


    if (
        fromUnit.value === "fahrenheit" &&
        temperature < -459.67
    ) {

        showError(
            "Fahrenheit cannot be below −459.67°F."
        );

        return;
    }


    if (
        fromUnit.value === "kelvin" &&
        temperature < 0
    ) {

        showError(
            "Kelvin cannot be below 0 K."
        );

        return;
    }


    clearError();


    // -----------------------------------------
    // Convert input → Celsius
    // -----------------------------------------

    let celsius;


    if (fromUnit.value === "celsius") {

        celsius = temperature;

    }

    else if (fromUnit.value === "fahrenheit") {

        celsius =
            (temperature - 32) * 5 / 9;

    }

    else {

        celsius =
            temperature - 273.15;

    }


    // -----------------------------------------
    // Celsius → destination
    // -----------------------------------------

    let result;


    if (toUnit.value === "celsius") {

        result = celsius;

    }

    else if (toUnit.value === "fahrenheit") {

        result =
            (celsius * 9 / 5) + 32;

    }

    else {

        result =
            celsius + 273.15;

    }


    // Round result
    result =
        Math.round(result * 100) / 100;


    // -----------------------------------------
    // Display result
    // -----------------------------------------

    resultValue.textContent =
        `${result} ${symbols[toUnit.value]}`;


    resultFormula.textContent =
        `${temperature} ${symbols[fromUnit.value]} = ` +
        `${result} ${symbols[toUnit.value]}`;


    resultBox.classList.add("active");


    // Update visual
    updateTemperatureVisual(
        celsius
    );


    // Add to history
    addToHistory(
        temperature,
        fromUnit.value,
        result,
        toUnit.value
    );

}


// -----------------------------------------
// Validate errors
// -----------------------------------------

function showError(message) {

    errorMessage.textContent = message;

    resultValue.textContent = "—";

    resultFormula.textContent =
        "Please correct the input and try again.";

    resultBox.classList.remove("active");

}


// -----------------------------------------
// Clear error
// -----------------------------------------

function clearError() {

    errorMessage.textContent = "";

}


// -----------------------------------------
// Clear converter
// -----------------------------------------

function clearConverter() {

    temperatureInput.value = "";

    fromUnit.value = "celsius";

    toUnit.value = "fahrenheit";


    resultValue.textContent = "—";


    resultFormula.textContent =
        "Enter a temperature to see your result.";


    resultBox.classList.remove("active");


    clearError();


    updateInputSymbol();


    visualTemperature.textContent =
        "25°";

}


// -----------------------------------------
// Swap units
// -----------------------------------------

function swapUnits() {

    const oldFrom =
        fromUnit.value;

    fromUnit.value =
        toUnit.value;

    toUnit.value =
        oldFrom;


    updateInputSymbol();


    // Automatically convert if input exists
    if (
        temperatureInput.value.trim() !== ""
    ) {

        convertTemperature();

    }


    // Small animation
    swapButton.animate(
        [
            {
                transform: "rotate(0deg)"
            },
            {
                transform: "rotate(180deg)"
            },
            {
                transform: "rotate(360deg)"
            }
        ],
        {
            duration: 450
        }
    );

}


// -----------------------------------------
// Add conversion to history
// -----------------------------------------

function addToHistory(
    input,
    from,
    result,
    to
) {

    const item = {
        input: input,
        from: from,
        result: result,
        to: to
    };


    conversionHistory.unshift(item);


    // Keep only last 5
    if (conversionHistory.length > 5) {

        conversionHistory.pop();

    }


    renderHistory();

}


// -----------------------------------------
// Display history
// -----------------------------------------

function renderHistory() {

    if (conversionHistory.length === 0) {

        historyList.innerHTML = `
            <div class="empty-history">
                Your recent conversions
                will appear here.
            </div>
        `;

        return;
    }


    historyList.innerHTML =
        conversionHistory
            .map(item => {

                return `
                    <div class="history-item">

                        <strong>
                            ${item.input}
                            ${symbols[item.from]}
                            →
                            ${item.result}
                            ${symbols[item.to]}
                        </strong>

                        <span>
                            ${unitNames[item.from]}
                            to
                            ${unitNames[item.to]}
                        </span>

                    </div>
                `;

            })
            .join("");

}


// -----------------------------------------
// Clear history
// -----------------------------------------

function clearHistory() {

    conversionHistory = [];

    renderHistory();

}


// -----------------------------------------
// Update animated temperature visual
// -----------------------------------------

function updateTemperatureVisual(
    celsius
) {

    let displayTemperature;


    if (
        celsius < 10
    ) {

        displayTemperature =
            `${Math.round(celsius)}°`;

    }

    else {

        displayTemperature =
            `${Math.round(celsius)}°`;

    }


    visualTemperature.textContent =
        displayTemperature;


    // Change description based on temperature
    const visualStatus =
        document.querySelector(
            ".temperature-core span"
        );


    if (celsius <= 0) {

        visualStatus.textContent =
            "Freezing";

    }

    else if (celsius < 15) {

        visualStatus.textContent =
            "Cold";

    }

    else if (celsius < 30) {

        visualStatus.textContent =
            "Comfortable";

    }

    else if (celsius < 40) {

        visualStatus.textContent =
            "Warm";

    }

    else {

        visualStatus.textContent =
            "Hot";

    }

}


// -----------------------------------------
// Enter key support
// -----------------------------------------

temperatureInput.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Enter") {

            convertTemperature();

        }

    }
);


// -----------------------------------------
// Update symbol when unit changes
// -----------------------------------------

fromUnit.addEventListener(
    "change",
    updateInputSymbol
);


// -----------------------------------------
// Event listeners
// -----------------------------------------

convertButton.addEventListener(
    "click",
    convertTemperature
);


clearButton.addEventListener(
    "click",
    clearConverter
);


swapButton.addEventListener(
    "click",
    swapUnits
);


clearHistoryButton.addEventListener(
    "click",
    clearHistory
);


// -----------------------------------------
// Initial setup
// -----------------------------------------

updateInputSymbol();

renderHistory();