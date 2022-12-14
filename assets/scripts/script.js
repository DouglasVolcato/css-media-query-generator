document.getElementById("reference").value = 0.5;
document.getElementById("screenSize").value = 250;

function generate() {
  const reference =
    document.getElementById("reference").value === ""
      ? 0.5
      : document.getElementById("reference").value;
  const screenSize =
    document.getElementById("screenSize").value === ""
      ? 250
      : document.getElementById("screenSize").value;

  const input = document.getElementById("cssInput").value;
  if (
    input.includes("vw") &&
    input.includes(":") &&
    input.includes("}") &&
    input.includes("{")
  ) {
    document.getElementById("generatedCss").innerText = cssResponsivity(
      input,
      reference,
      screenSize
    );
  } else {
    document.getElementById("generatedCss").innerText = "Invalid CSS";
  }
}

//mainly function
function cssResponsivity(css, ref, screenSizeDecrease) {
  const reference = ref;

  //convert text(string) to arr
  const arr = textToArr(css);

  //give vw location in arr
  const locations = findVw(arr);

  //extract numbers and clean text
  //obj.numbers
  //obj.textArr
  const obj = extractNumbers(arr, locations, css);

  //configurations for @media
  //Width always in decrescent order
  const mediaQueryConfig = {
    width: cssWidthSizes(screenSizeDecrease),
    multiplier: [reference],
  };

  //return @media(arr format)
  const arrMediaQuery = mediaGenerator(
    css,
    obj.numbers,
    obj.textArr,
    mediaQueryConfig
  );

  //convert @media to string
  const text = arrToText(arrMediaQuery);

  // remove useless lines
  return removeUnusedLines(text);
}

function textToArr(text) {
  const arr = [];
  for (i = 0; i < text.length; i++) {
    arr.push(text[i]);
  }
  return arr;
}

function findVw(arr) {
  const locations = [];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === "v" && arr[i + 1] === "w") {
      locations.push(i);
    }
  }
  return locations;
}

function extractNumbers(arr, locations) {
  const characters = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."];
  const arrNumbers = [];
  const locationNumbers = [];
  const newTextArr = arr;

  for (let i = arr.length - 1; i >= 0; i--) {
    for (let n = 0; n < locations.length; n++) {
      if (i === locations[n]) {
        let num = "";

        if (characters.includes(arr[i - 7])) {
          num = num + arr[i - 7];
          locationNumbers.push(i - 7);
        }
        if (characters.includes(arr[i - 6])) {
          num = num + arr[i - 6];
          locationNumbers.push(i - 6);
        }
        if (characters.includes(arr[i - 5])) {
          num = num + arr[i - 5];
          locationNumbers.push(i - 5);
        }
        if (characters.includes(arr[i - 4])) {
          num = num + arr[i - 4];
          locationNumbers.push(i - 4);
        }
        if (characters.includes(arr[i - 3])) {
          num = num + arr[i - 3];
          locationNumbers.push(i - 3);
        }
        if (characters.includes(arr[i - 2])) {
          num = num + arr[i - 2];
          locationNumbers.push(i - 2);
        }
        if (characters.includes(arr[i - 1])) {
          num = num + arr[i - 1];
          locationNumbers.push(i - 1);
        }
        arrNumbers.push(Number(num));
      }
    }
  }

  for (let i = newTextArr.length - 1; i >= 0; i--) {
    for (let n = 0; n < locations.length; n++) {
      if (i === locations[n]) {
        if (characters.includes(newTextArr[i - 1])) {
          newTextArr.splice(i - 1, 1);
        }
        if (characters.includes(newTextArr[i - 2])) {
          newTextArr.splice(i - 2, 1);
        }
        if (characters.includes(newTextArr[i - 3])) {
          newTextArr.splice(i - 3, 1);
        }
        if (characters.includes(newTextArr[i - 4])) {
          newTextArr.splice(i - 4, 1);
        }
        if (characters.includes(newTextArr[i - 5])) {
          newTextArr.splice(i - 5, 1);
        }
        if (characters.includes(newTextArr[i - 6])) {
          newTextArr.splice(i - 6, 1);
        }
        if (characters.includes(newTextArr[i - 7])) {
          newTextArr.splice(i - 7, 1);
        }
      }
    }
  }

  const obj = {
    numbers: arrNumbers,
    textArr: newTextArr,
  };

  return obj;
}

function mediaGenerator(css, numbersArr, textArr, mediaQuery) {
  const text = textArr;
  const locations = [];
  const completeTextArr = [];

  for (let i = text.length - 1; i >= 0; i--) {
    if (text[i] == "v" && text[i + 1] == "w") {
      locations.push(i);
    }
  }

  for (let i = 0; i < mediaQuery.width.length; i++) {
    const modifiedNumbers = numbersArr.map(
      (num) => num + Number(mediaQuery.multiplier) * i
    );
    let count = 0;
    const cache = text;

    for (let n of locations) {
      cache.splice(n, 1, modifiedNumbers[count] + "v");
      count++;
    }
    completeTextArr.push([
      `@media(max-width: ${mediaQuery.width[i]}px){ \n`,
      ...cache,
      "\n}\n",
    ]);
  }

  return completeTextArr;
}

function arrToText(arr) {
  let string = "";
  for (let n of arr) {
    for (let i of n) {
      string = string + i;
    }
  }
  return string;
}

function cssWidthSizes(screenSizeDecrease) {
  const arrSizes = [];

  for (let i = window.innerWidth - 100; i >= 50; i -= screenSizeDecrease) {
    arrSizes.push(i);
  }
  return arrSizes;
}

function removeUnusedLines(text) {
  const arr = text.split(";");
  const modifiedArr = [];
  arr.map((item) => {
    if (
      item.includes("vw") ||
      item.includes("*") ||
      item.includes("{") ||
      item.includes("}")
    ) {
      modifiedArr.push(item);
    }
  });
  return modifiedArr.join(";");
}
