// =====================================================
// ERROR TRANSLATOR + DEBUG CHECKLIST
// LocalStorage Enabled
// Professional Beginner Tool
// =====================================================

// -----------------------------
// ELEMENTS
// -----------------------------
const errorInput = document.getElementById("errorInput");
const translateBtn = document.getElementById("translateBtn");
const clearBtn = document.getElementById("clearBtn");

const translatedOutput = document.getElementById("translatedOutput");
const fixOutput = document.getElementById("fixOutput");

const checklistContainer = document.getElementById("checklistContainer");
const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");

const resetChecklistBtn = document.getElementById("resetChecklistBtn");
const addChecklistBtn = document.getElementById("addChecklistBtn");
const searchChecklist = document.getElementById("searchChecklist");

const historyContainer = document.getElementById("historyContainer");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");

// -----------------------------
// STORAGE KEYS
// -----------------------------
const STORAGE_CHECKLIST = "debug_checklist_items";
const STORAGE_HISTORY = "error_history_list";
const STORAGE_LAST_ERROR = "last_error_input";

// -----------------------------
// DEFAULT CHECKLIST ITEMS
// -----------------------------
let checklistItems = [
  { text: "Check the console for the exact error line number.", done: false },
  { text: "Make sure your script.js is linked correctly in HTML.", done: false },
  { text: "Check if your element ID matches your JavaScript selector.", done: false },
  { text: "Make sure your script is placed before </body>.", done: false },
  { text: "Refresh your browser using Ctrl + Shift + R.", done: false },
  { text: "Check if your function is being called correctly.", done: false },
  { text: "Make sure your variables are declared properly.", done: false },
  { text: "Look for missing brackets: { } ( ) [ ].", done: false },
  { text: "Check spelling mistakes in variable names.", done: false },
  { text: "Check for missing semicolons or commas.", done: false },
  { text: "Make sure you didn't forget return in your function.", done: false },
  { text: "If using localStorage, check if the key exists first.", done: false },
  { text: "Check if your API URL or fetch request is correct.", done: false },
  { text: "If using arrays, confirm index is valid.", done: false },
  { text: "Check if your CSS is overriding your design.", done: false },
  { text: "Test your website on mobile using Inspect Element.", done: false },
];

// -----------------------------
// HISTORY LIST
// -----------------------------
let errorHistory = [];

// -----------------------------
// HELPER FUNCTIONS
// -----------------------------
function saveChecklistToStorage() {
  localStorage.setItem(STORAGE_CHECKLIST, JSON.stringify(checklistItems));
}

function loadChecklistFromStorage() {
  const saved = localStorage.getItem(STORAGE_CHECKLIST);
  if (saved) {
    checklistItems = JSON.parse(saved);
  }
}

function saveHistoryToStorage() {
  localStorage.setItem(STORAGE_HISTORY, JSON.stringify(errorHistory));
}

function loadHistoryFromStorage() {
  const saved = localStorage.getItem(STORAGE_HISTORY);
  if (saved) {
    errorHistory = JSON.parse(saved);
  }
}

function saveLastErrorInput() {
  localStorage.setItem(STORAGE_LAST_ERROR, errorInput.value);
}

function loadLastErrorInput() {
  const saved = localStorage.getItem(STORAGE_LAST_ERROR);
  if (saved) {
    errorInput.value = saved;
  }
}

// -----------------------------
// ERROR TRANSLATOR LOGIC
// -----------------------------
function translateError(errorText) {
  let meaning = "I couldn't fully recognize this error, but it usually means something is wrong in your code.";
  let fix = "Check the console line number and review the code around that part.";

  const text = errorText.toLowerCase();

  if (text.includes("cannot read properties of null")) {
    meaning = "Your JavaScript is trying to use an element that does not exist in your HTML.";
    fix = "Make sure the element ID/class is correct, and your script runs after the HTML loads.";
  }

  else if (text.includes("undefined")) {
    meaning = "Your code is trying to use a variable or function that has no value yet.";
    fix = "Check spelling and make sure the variable is declared before using it.";
  }

  else if (text.includes("is not defined")) {
    meaning = "JavaScript does not know what that variable/function is.";
    fix = "Declare the variable or check if you typed the name correctly.";
  }

  else if (text.includes("unexpected token")) {
    meaning = "Your code has a syntax error (something typed wrong like extra comma, missing bracket, etc).";
    fix = "Check the line number and look for missing quotes, commas, or brackets.";
  }

  else if (text.includes("missing ) after argument list")) {
    meaning = "You forgot to close a bracket ')' in a function call.";
    fix = "Check your parentheses and make sure every '(' has a matching ')'.";
  }

  else if (text.includes("failed to fetch")) {
    meaning = "Your code tried to request data from an API or link, but it failed.";
    fix = "Check your internet, API URL, and ensure CORS or server is working.";
  }

  else if (text.includes("net::err")) {
    meaning = "Your browser failed to load a file or resource (image, script, API, etc).";
    fix = "Check the file path or link. Make sure the resource exists.";
  }

  else if (text.includes("uncaught typeerror")) {
    meaning = "Your code is using something incorrectly (wrong data type or missing element).";
    fix = "Check the console line number and see what variable is causing the problem.";
  }

  else if (text.includes("maximum call stack size exceeded")) {
    meaning = "Your code is running a function infinitely (loop recursion).";
    fix = "Check if your function calls itself repeatedly without stopping.";
  }

  else if (text.includes("illegal invocation")) {
    meaning = "You called a function in the wrong way or wrong object context.";
    fix = "Make sure you're calling the function correctly (ex: document.method()).";
  }

  else if (text.includes("cors")) {
    meaning = "Your browser blocked an API request because of security rules (CORS policy).";
    fix = "Try using a proper backend, use correct headers, or use an API that allows requests.";
  }

  else if (text.includes("404")) {
    meaning = "The file or page you're trying to access does not exist.";
    fix = "Check the file path, spelling, and folder structure.";
  }

  else if (text.includes("500")) {
    meaning = "The server has an internal error. This is usually not your frontend fault.";
    fix = "Try again later or check the backend server logs.";
  }

  return { meaning, fix };
}

// -----------------------------
// CHECKLIST RENDERING
// -----------------------------
function renderChecklist(filterText = "") {
  checklistContainer.innerHTML = "";

  checklistItems.forEach((item, index) => {
    if (!item.text.toLowerCase().includes(filterText.toLowerCase())) {
      return;
    }

    const li = document.createElement("li");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = item.done;

    checkbox.addEventListener("change", () => {
      checklistItems[index].done = checkbox.checked;
      saveChecklistToStorage();
      updateProgress();
    });

    const span = document.createElement("span");
    span.classList.add("text");
    span.textContent = item.text;

    const deleteBtn = document.createElement("span");
    deleteBtn.classList.add("delete");
    deleteBtn.textContent = "✖";

    deleteBtn.addEventListener("click", () => {
      checklistItems.splice(index, 1);
      saveChecklistToStorage();
      renderChecklist(searchChecklist.value);
      updateProgress();
    });

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(deleteBtn);

    checklistContainer.appendChild(li);
  });

  updateProgress();
}

// -----------------------------
// PROGRESS BAR UPDATE
// -----------------------------
function updateProgress() {
  if (checklistItems.length === 0) {
    progressFill.style.width = "0%";
    progressText.textContent = "0%";
    return;
  }

  const doneCount = checklistItems.filter(item => item.done).length;
  const percent = Math.round((doneCount / checklistItems.length) * 100);

  progressFill.style.width = percent + "%";
  progressText.textContent = percent + "%";
}

// -----------------------------
// HISTORY RENDERING
// -----------------------------
function renderHistory() {
  historyContainer.innerHTML = "";

  if (errorHistory.length === 0) {
    historyContainer.innerHTML = `<p style="opacity:0.7;">No history yet. Translate an error first.</p>`;
    return;
  }

  errorHistory.slice().reverse().forEach((item) => {
    const div = document.createElement("div");
    div.classList.add("history-item");

    div.innerHTML = `
      <strong>${item.error}</strong>
      <span>${item.translation}</span>
    `;

    div.addEventListener("click", () => {
      errorInput.value = item.error;
      translatedOutput.textContent = item.translation;
      fixOutput.textContent = item.fix;
      saveLastErrorInput();
    });

    historyContainer.appendChild(div);
  });
}

// -----------------------------
// ADD TO HISTORY
// -----------------------------
function addToHistory(errorText, translation, fix) {
  const newItem = {
    error: errorText.substring(0, 150),
    translation: translation,
    fix: fix,
    date: new Date().toLocaleString()
  };

  errorHistory.push(newItem);

  if (errorHistory.length > 20) {
    errorHistory.shift();
  }

  saveHistoryToStorage();
  renderHistory();
}

// -----------------------------
// BUTTON EVENTS
// -----------------------------
translateBtn.addEventListener("click", () => {
  const errorText = errorInput.value.trim();

  if (errorText === "") {
    translatedOutput.textContent = "Please paste an error first.";
    fixOutput.textContent = "Try copying an error from your console (F12 > Console).";
    return;
  }

  const result = translateError(errorText);

  translatedOutput.textContent = result.meaning;
  fixOutput.textContent = result.fix;

  addToHistory(errorText, result.meaning, result.fix);
  saveLastErrorInput();
});

clearBtn.addEventListener("click", () => {
  errorInput.value = "";
  translatedOutput.textContent = "Your translated error will appear here...";
  fixOutput.textContent = "Suggested fix will appear here...";
  saveLastErrorInput();
});

resetChecklistBtn.addEventListener("click", () => {
  checklistItems.forEach(item => item.done = false);
  saveChecklistToStorage();
  renderChecklist(searchChecklist.value);
});

addChecklistBtn.addEventListener("click", () => {
  const newItem = prompt("Enter a custom debug checklist item:");

  if (!newItem || newItem.trim() === "") {
    return;
  }

  checklistItems.push({ text: newItem.trim(), done: false });
  saveChecklistToStorage();
  renderChecklist(searchChecklist.value);
});

searchChecklist.addEventListener("input", () => {
  renderChecklist(searchChecklist.value);
});

clearHistoryBtn.addEventListener("click", () => {
  if (confirm("Are you sure you want to clear your history?")) {
    errorHistory = [];
    saveHistoryToStorage();
    renderHistory();
  }
});

// -----------------------------
// AUTO SAVE INPUT WHILE TYPING
// -----------------------------
errorInput.addEventListener("input", () => {
  saveLastErrorInput();
});

// -----------------------------
// INIT LOAD
// -----------------------------
function initApp() {
  loadChecklistFromStorage();
  loadHistoryFromStorage();
  loadLastErrorInput();

  renderChecklist();
  renderHistory();
  updateProgress();
}

initApp();

// -----------------------------
// EXTRA FEATURE: AUTO SUGGESTION
// -----------------------------
function autoSuggestion(errorText) {
  const text = errorText.toLowerCase();

  if (text.includes("null")) {
    return "💡 Tip: Check if your element exists in HTML before selecting it in JavaScript.";
  }
  if (text.includes("undefined")) {
    return "💡 Tip: Print your variables using console.log() to see their values.";
  }
  if (text.includes("syntax")) {
    return "💡 Tip: Syntax errors are often caused by missing brackets or quotes.";
  }
  return "💡 Tip: Always check the line number shown in your browser console.";
}

// Add suggestion when typing stops
let typingTimer;

errorInput.addEventListener("keyup", () => {
  clearTimeout(typingTimer);

  typingTimer = setTimeout(() => {
    const errorText = errorInput.value.trim();
    if (errorText.length > 10) {
      translatedOutput.textContent = autoSuggestion(errorText);
    }
  }, 900);
});
