export const transformTextCapitalize = text => {
  let wordsArr = text.split(" ");
  let capitalizedWordsArr = [];
  for (let word of wordsArr) {
    const capitalizedWord = word.charAt(0).toUpperCase() + word.substr(1);
    capitalizedWordsArr.push(capitalizedWord);
  }
  return capitalizedWordsArr.join(" ");
};
