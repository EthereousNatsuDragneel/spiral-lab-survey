// Bipolar descriptors
const pairs = [
  "accidental",
  "deliberate",
  "aggressive",
  "peaceful",
  "alarming",
  "soothing",
  "announcing",
  "concealing",
  "approaching",
  "retreating",
  "artificial",
  "natural",
  "assertive",
  "easygoing",
  "awful",
  "nice",
  "balanced",
  "unbalanced",
  "blunt",
  "sharp",
  "boring",
  "exciting",
  "bright",
  "dull",
  "bubbly",
  "subdued",
  "cartoonish",
  "real-life",
  "chaotic",
  "orderly",
  "cheerful",
  "gloomy",
  "clean",
  "dirty",
  "close",
  "far",
  "closed",
  "open",
  "clumsy",
  "coordinated",
  "cold",
  "hot",
  "comfort",
  "discomfort",
  "comforting",
  "upsetting",
  "compressed",
  "expanded",
  "dangerous",
  "safe",
  "descending",
  "ascending",
  "desolate",
  "populous",
  "digital",
  "analogue",
  "distorted",
  "clear",
  "distressing",
  "reassuring",
  "disturbing",
  "delightful",
  "dry",
  "wet",
  "dynamic",
  "static",
  "earthy",
  "airy",
  "electronic",
  "acoustic",
  "empty",
  "full",
  "encouraging",
  "discouraging",
  "energetic",
  "lethargic",
  "falling",
  "rising",
  "fast",
  "slow",
  "fearful",
  "brave",
  "focused",
  "blurred",
  "funny",
  "serious",
  "futuristic",
  "old-fashioned",
  "gentle",
  "harsh",
  "grainy",
  "smooth",
  "growing",
  "shrinking",
  "hard",
  "soft",
  "empty",
  "full",
  "distorted",
  "clear",
];

// Initialize the first and last values for generating the range
var firstValue = 1;
var lastValue = 3835;

// Generate the array from firstValue to lastValue
var availableNumbers = [];
for (var i = firstValue; i <= lastValue; i++) {
  availableNumbers.push(i);
}

function generateRandomNumberForAudio() {
  // Select a random index from the available numbers array
  var randomIndex = Math.floor(Math.random() * availableNumbers.length);
  var randomNumber = availableNumbers[randomIndex];
  availableNumbers.splice(randomIndex, 1);
  return randomNumber;
}

function generateRandomArray(n) {
  // Create an array with numbers 0 to n-1
  const numbers = Array.from({ length: n }, (_, index) => index);

  // Shuffle the array using the Fisher-Yates algorithm
  for (let i = numbers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [numbers[i], numbers[j]] = [numbers[j], numbers[i]]; // Swap elements
  }

  return numbers;
}

var bipolarDescriptorArray = generateRandomArray(10);
var bipolarDescriptorArrayCounter = 0;

function assignStringsToElements(stringsArray) {
  for (let i = 0; i < 10; i += 2) {
    const lowElementId = `${i / 2 + 1}-low`;
    const lowElement = document.getElementById(lowElementId);

    const highElementId = `${i / 2 + 1}-high`;
    const highElement = document.getElementById(highElementId);

    if (lowElement) {
      lowElement.textContent =
        stringsArray[
          bipolarDescriptorArray[bipolarDescriptorArrayCounter] * 10 + i
        ];
    } else {
      console.warn(`Element with ID "${lowElementId}" not found.`);
    }

    if (highElement) {
      highElement.textContent =
        stringsArray[
          bipolarDescriptorArray[bipolarDescriptorArrayCounter] * 10 + i + 1
        ];
    } else {
      console.warn(`Element with ID "${highElementId}" not found.`);
    }
  }
}

// Set initial audio source and play it
window.onload = function () {
  const audioPlayer = document.getElementById("audioPlayer");
  audioPlayer.src =
    "https://digitalmedia.ok.ubc.ca/projects/vocabulary/corpus/" +
    generateRandomNumberForAudio() +
    ".mp3";
  assignStringsToElements(pairs);

  // Attempt to simulate play with a programmatic call
  audioPlayer
    .play()
    .then(() => {
      console.log("Audio is playing automatically.");
    })
    .catch(() => {
      // Simulate user interaction by programmatically creating an event
      const playButtonEvent = new Event("click");
      audioPlayer.dispatchEvent(playButtonEvent);

      console.log("Autoplay was blocked. Simulating user interaction.");
      audioPlayer.play(); // Attempt to play again
    });
};

// Check if all sliders have been answered and enable buttons
function checkCompletion() {
  const sliders = document.querySelectorAll('input[type="range"]');
  let allSlidersAnswered = Array.from(sliders).every(
    (slider) => slider.value !== "0.5"
  );

  const finishButton = document.getElementById("finishButton");
  const nextButton = document.getElementById("nextButton");

  // Enable buttons only if all sliders are answered
  finishButton.disabled = !allSlidersAnswered;
  nextButton.disabled = !allSlidersAnswered;
}

// Play the next audio source and reset sliders
function playNextAudio() {
  const audioPlayer = document.getElementById("audioPlayer");
  audioPlayer.src =
    "https://digitalmedia.ok.ubc.ca/projects/vocabulary/corpus/" +
    generateRandomNumberForAudio() +
    ".mp3";
  audioPlayer.play();

  // Reset sliders to the default value
  const sliders = document.querySelectorAll('input[type="range"]');
  sliders.forEach((slider) => (slider.value = "0.5"));

  // Disable buttons until new responses are made
  const finishButton = document.getElementById("finishButton");
  const nextButton = document.getElementById("nextButton");

  finishButton.disabled = true;
  nextButton.disabled = true;

  bipolarDescriptorArrayCounter = (bipolarDescriptorArrayCounter + 1) % 10;
  assignStringsToElements(pairs);
}

// Redirect to the thanks page
function finishSurvey() {
  window.location.href = "thanks_page.html";
}
