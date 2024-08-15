// getting all variables
const inputslider = document.querySelector("[data-lengthslider]");
const lengthDisplay = document.querySelector("[data-length-number]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[copybtn]");
const copyMsg = document.querySelector("[copytext]");
const Uppercasecheck = document.querySelector("#ch1");
const Lowercasecheck = document.querySelector("#ch2");
const numbercheck = document.querySelector("#ch3");
const symbolcheck = document.querySelector("#ch4");
const indicator = document.querySelector(".strength-indicator .indicator");
const generateBtn = document.querySelector(".generate-button");
const allcheckbox = document.querySelectorAll("input[type=checkbox]");
const symbol = "~`!@#$%^&*()_-+=||}]{[:;?/>.<,";

let password = "";
let password_length = 10;
let checkcount = 0;
console.log("inside js");

handleslider();

function handleslider() {
  inputslider.value = password_length;
  lengthDisplay.innerText = password_length;
}

// Updated to only change the indicator within the strength container
function setindicator(width, color) {
  indicator.style.width = width;
  indicator.style.backgroundColor = color;
}

function getrndint(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function getrndnumber() {
  return getrndint(0, 9);
}

function getrndlower() {
  return String.fromCharCode(getrndint(97, 123));
}

function getrndUppper() {
  return String.fromCharCode(getrndint(65, 91));
}

function getrndsymbol() {
  let size = symbol.length;
  const index = getrndint(0, size);
  const ch = symbol.charAt(index);
  return ch;
}

function shuffle_password(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Updated to calculate strength and set indicator properties
function calcstrength() {
  let hasupper = false;
  let haslower = false;
  let hasnum = false;
  let hassymbol = false;
  let count = 0;

  if (Uppercasecheck.checked) {
    hasupper = true;
    count++;
  }
  if (Lowercasecheck.checked) {
    haslower = true;
    count++;
  }
  if (symbolcheck.checked) {
    hassymbol = true;
    count++;
  }
  if (numbercheck.checked) {
    hasnum = true;
    count++;
  }

  // Determine strength and update indicator
  if (count === 4 && password_length >= 10) {
    setindicator("100%", "#28a745"); // Strong: Green
  } else if (count >= 2 && password_length >= 6) {
    setindicator("66%", "#ffc107"); // Medium: Yellow
  } else {
    setindicator("33%", "#ff4d4f"); // Weak: Red
  }
}

async function copycontent() {
  try {
    // Copy the password to the clipboard
    await navigator.clipboard.writeText(passwordDisplay.value);

    // Clear any previous message and set it to "Copied"

    copyMsg.innerText = "copied";
  } catch (error) {
    // If an error occurs, show "Failed"
    copyMsg.innerText = "Failed";
  }

  // Add the active class to make the message visible
  // Remove the message after 2 seconds
  setTimeout(() => {
    // Clear the message and remove the active class
    copyMsg.innerText = "copy";
    copyMsg.classList.remove("active");
  }, 2000);
}

// adding event listeners
inputslider.addEventListener("input", (e) => {
  password_length = e.target.value;
  handleslider();
});

copyBtn.addEventListener("click", () => {
  if (passwordDisplay.value) {
    copycontent();
  }
});

function handleCheckboxChange() {
  checkcount = 0;
  allcheckbox.forEach((checkbox) => {
    if (checkbox.checked) {
      checkcount++;
    }
  });

  // special case jha check jyada ho length se
  if (password_length < checkcount) {
    password_length = checkcount;
    handleslider();
  }
}

allcheckbox.forEach((checkbox) => {
  checkbox.addEventListener("change", handleCheckboxChange);
});

// password generator
generateBtn.addEventListener("click", () => {
  if (checkcount <= 0) return;
  console.log("password gen ");

  // handling that special case
  if (password_length < checkcount) {
    password_length = checkcount;
    handleslider();
  }

  // remove old password
  password = "";

  console.log("old password removed");
  let funcarr = [];

  // jo jo checked hai unhe array me daal de
  if (Uppercasecheck.checked) {
    funcarr.push(getrndUppper);
  }
  if (Lowercasecheck.checked) {
    funcarr.push(getrndlower);
  }
  if (symbolcheck.checked) {
    funcarr.push(getrndsymbol);
  }
  if (numbercheck.checked) {
    funcarr.push(getrndnumber);
  }
  console.log("addition in funcarr");

  // compulasry addition
  for (let i = 0; i < funcarr.length; i++) {
    password += funcarr[i]();
  }
  console.log("compulsary additon");
  console.log(password);

  // remaining addition
  for (let i = 0; i < password_length - funcarr.length; i++) {
    let ranIndex = getrndint(0, funcarr.length);
    password += funcarr[ranIndex]();
  }
  console.log("remaining additon");

  // shuffling password
  // to get total random password
  password = shuffle_password(Array.from(password)).join("");

  console.log("password shuffle");

  // showing in UI
  passwordDisplay.value = password;

  // calculating strength
  calcstrength();
});
