const password = document.getElementById("password");
const strengthBar = document.getElementById("strength-bar");
const strengthText = document.getElementById("strength-text");
const crackTime = document.getElementById("crack-time");
const suggestions = document.getElementById("suggestions");
const generateBtn = document.getElementById("generate");

// Indicators
const lengthCheck = document.getElementById("length-check");
const upperCheck = document.getElementById("upper-check");
const lowerCheck = document.getElementById("lower-check");
const numberCheck = document.getElementById("number-check");
const specialCheck = document.getElementById("special-check");

const commonPasswords = ["123456", "password", "123456789", "qwerty", "abc123", "111111"];

password.addEventListener("input", () => {
  const val = password.value;
  let strength = 0;
  let charsetSize = 0;

  // Update indicator statuses
  updateIndicator(lengthCheck, val.length >= 8, "Minimum 8 characters");
  updateIndicator(upperCheck, /[A-Z]/.test(val), "At least one uppercase letter");
  updateIndicator(lowerCheck, /[a-z]/.test(val), "At least one lowercase letter");
  updateIndicator(numberCheck, /[0-9]/.test(val), "At least one number");
  updateIndicator(specialCheck, /[^A-Za-z0-9]/.test(val), "At least one special character");

  if (val.length >= 8) strength++;
  if (/[A-Z]/.test(val)) {
    strength++;
    charsetSize += 26;
  }
  if (/[a-z]/.test(val)) charsetSize += 26;
  if (/[0-9]/.test(val)) {
    strength++;
    charsetSize += 10;
  }
  if (/[^A-Za-z0-9]/.test(val)) {
    strength++;
    charsetSize += 32;
  }

  const guessesPerSecond = 1e9;
  const combinations = Math.pow(charsetSize, val.length);
  const secondsToCrack = combinations / guessesPerSecond;

  function formatTime(seconds) {
    if (seconds < 1) return "Instantly";
    const units = [
      { label: "centuries", value: 3153600000 },
      { label: "years", value: 31536000 },
      { label: "months", value: 2628000 },
      { label: "days", value: 86400 },
      { label: "hours", value: 3600 },
      { label: "minutes", value: 60 },
      { label: "seconds", value: 1 },
    ];
    for (let unit of units) {
      if (seconds >= unit.value) {
        return Math.floor(seconds / unit.value) + " " + unit.label;
      }
    }
    return "seconds";
  }

  crackTime.textContent = "⏱️ Estimated crack time: " + formatTime(secondsToCrack);

  let feedback = [];
  if (val.length < 8) feedback.push("Use at least 8 characters.");
  if (!/[A-Z]/.test(val)) feedback.push("Add uppercase letters.");
  if (!/[a-z]/.test(val)) feedback.push("Include lowercase letters.");
  if (!/[0-9]/.test(val)) feedback.push("Add some numbers.");
  if (!/[^A-Za-z0-9]/.test(val)) feedback.push("Include symbols like !, @, #.");

  if (commonPasswords.includes(val)) {
    suggestions.textContent = "⚠️ This is a commonly used password. Please choose another one.";
    strength = 0;
  } else {
    suggestions.textContent = feedback.length ? "💡 Suggestions: " + feedback.join(" ") : "";
  }

  switch (strength) {
    case 0:
      strengthBar.style.width = "0%";
      strengthBar.style.background = "#eee";
      strengthText.textContent = "";
      break;
    case 1:
      strengthBar.style.width = "25%";
      strengthBar.style.background = "#ff4b5c";
      strengthText.textContent = "Weak";
      break;
    case 2:
      strengthBar.style.width = "50%";
      strengthBar.style.background = "#ffa931";
      strengthText.textContent = "Moderate";
      break;
    case 3:
      strengthBar.style.width = "75%";
      strengthBar.style.background = "#43e97b";
      strengthText.textContent = "Strong";
      break;
    case 4:
      strengthBar.style.width = "100%";
      strengthBar.style.background = "#38f9d7";
      strengthText.textContent = "Very Strong";
      break;
  }
});

function updateIndicator(element, condition, message) {
  if (condition) {
    element.textContent = "✅ " + message;
    element.classList.add("valid");
    element.classList.remove("invalid");
  } else {
    element.textContent = "❌ " + message;
    element.classList.add("invalid");
    element.classList.remove("valid");
  }
}

// Generate password
generateBtn.addEventListener("click", () => {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+{}[]";
  let generated = "";
  for (let i = 0; i < 14; i++) {
    generated += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  password.value = generated;
  password.dispatchEvent(new Event("input"));
});
