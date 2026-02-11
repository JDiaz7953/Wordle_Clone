var keys = document.querySelectorAll(".key");
var currentWordBox = document.querySelectorAll(".wrd-box");
var deleteButton = document.getElementById("delete");
var enterButton = document.getElementById("enter");
var usersCurrentWord = "";
var boxSpot = -1;
var nextSegment = -1;
var cpuSelectedWord = ["P", "A", "S", "T", "A"];
var currentRow = 0;
var exactMatch = [];
var notExactMatch = [];
var enteredKeys = [];
deleteButton.addEventListener("click", deleteCharacter);
enterButton.addEventListener("click", EnterAnswer);

function disableKey(letters) {
  // it has to evaluate the whole keyboard
  for (var i = 0; i < keys.length; i++) {
    for (var j = 0; j < letters.length; j++) {
      if (keys[i].innerHTML == letters[j]) {
        console.log("IN HERE");
        keys[i].classList.add("disabled");
        break;
      }
    }
  }
}

function initializeLetterCount() {
  const count = new Map();
  for (var i = 0; i < cpuSelectedWord.length; i++) {
    const letter = cpuSelectedWord[i];
    count.set(letter, (count.get(letter) || 0) + 1);
  }

  return count;
}

//Add the event listner to every key
for (var i = 0; i < keys.length; i++) {
  keys[i].addEventListener("click", function () {
    placeCharacter(this.innerHTML);
    console.log(boxSpot);
  });
}

// Function to place the character
function placeCharacter(characterSelected) {
  //Check is the users current word === 5 first

  if (usersCurrentWord.length != 5) {
    boxSpot++;
    usersCurrentWord += characterSelected;
    currentWordBox[boxSpot].innerHTML = characterSelected;
    console.log(usersCurrentWord);
  }

  return;
}

//Function to delete character
function deleteCharacter() {
  if (boxSpot != nextSegment) {
    console.log(usersCurrentWord);
    usersCurrentWord = usersCurrentWord.substring(
      0,
      usersCurrentWord.length - 1,
    );
    currentWordBox[boxSpot].innerHTML = "";
    boxSpot--;
    console.log(boxSpot);
  }

  return;
}

//Validate if users answer matches the cpu answer
function checkAnswer() {
  //Maybe use the find function for arrays, then we can use the current segment to see which one has the letter then affect the background
  //maybe loop through the wordbox starting at the current segment to the current max and try
  // or loop through it find exact matches first then find away to leave the right letters wrong spot?
  var availableLetters = initializeLetterCount(cpuSelectedWord);

  for (var i = 0; i < cpuSelectedWord.length; i++) {
    if (cpuSelectedWord[i] === currentWordBox[currentRow + i].innerHTML) {
      exactMatch.push(cpuSelectedWord[i]);
      availableLetters.set(
        cpuSelectedWord[i],
        availableLetters.get(cpuSelectedWord[i]) - 1,
      );
      currentWordBox[currentRow + i].classList.add("correct");
    }
  }
  //console.log(exactMatch);
  // we have the words that are an exact match so if its not in the array and it is a letter in the word then turn it yellow
  //maybe instead of getting the match letters get the match letter

  for (var i = 0; i < cpuSelectedWord.length; i++) {
    var currentWord = usersCurrentWord[i];
    if (cpuSelectedWord[i] === currentWord) {
      continue;
    }
    console.log(availableLetters.get(currentWord));
    console.log(currentWord);
    if (availableLetters.get(currentWord) >= 1) {
      currentWordBox[currentRow + i].classList.add("wrong-spot");
      availableLetters.set(currentWord, availableLetters.get(currentWord) - 1);
    }
  }

  //Grey out invalid inputs, the letters not in the answer, disable those buttons
  for (var i = 0; i < cpuSelectedWord.length; i++) {
    if (!cpuSelectedWord.includes(usersCurrentWord[i])) {
      enteredKeys.push(usersCurrentWord[i]);
    }
  }
  disableKey(enteredKeys);

  //determine if they have one
  var winCounter = 0;
  for (var i = 0; i < cpuSelectedWord.length; i++) {
    const letter = cpuSelectedWord[i];
    if (letter === currentWordBox[currentRow + i].innerHTML) {
      winCounter++;
    }
  }
  if (winCounter === 5) {
    document.querySelector("h1").innerHTML = "YOU WON!";
    enterButton.classList.add("disabled");
  }

  //Solve: checking for dupes
  // first though that comes to mind instantly is using a map but might be overkill but its the only way I can think of keeping track of a dupe
}

//Validate answer or go to the next row
function EnterAnswer() {
  //First We need to check the users answers to the selected word (Maybe another function that performs this?)
  checkAnswer();
  if (usersCurrentWord.length == 5) {
    currentRow += 5;
    //Second we need to set the latest limit
    nextSegment = boxSpot;
    //Reset the users current word
    usersCurrentWord = "";
  }
  if (currentRow >= 25) {
    document.querySelector("h1").innerHTML =
      "GAME OVER! The word was " + cpuSelectedWord.join("");
    enterButton.classList.add("disabled");
  }

  return;
}

//***Notes***
// When the user Clicks on a letter then fill the square with that letter
// - We need to get the character after the user clicks the letter (done)
// - insert that letter into the box
// - Now we need to be able to delete a character BUT disable the user to go back more than they should
//    - so after a user presses enter a new limit is set they can no longer delete the last segment from the last row and beyond
