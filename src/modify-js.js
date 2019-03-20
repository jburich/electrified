import fs from 'fs';
import {promisify} from 'util';

const read = filename => fs.readFileSync(filename).toString('utf8').split('\n');

const isImport = line => line.includes('import') || line.includes('use strict');

const isConst = line => line.includes('const') || line.includes('let');

const isFunction = line => line.includes('createMainWindow');

const isLoadUrl = line => line.includes('loadURL');

const isElse = line => line.includes('else');

const isListener = line => line.includes('app.on');

const isElseEnd = line => line.trim() === '}';

const isReturn = line => line.trim().indexOf('return') === 0;

const isFunctionEnd = line => line.trimRight() === '}';

const isInFunction = line => !isReturn(line) && !isFunctionEnd(line);

const isBlank = line => line.trim().length === 0;

const isCompleteLine = line => line.trim().charAt(line.trim().length - 1) === ';';

const isNotLineEnd = line => line.trim().charAt(line.trim().length - 1) !== ';';

const isInCompleteLine = line => isConst(line) && line.trim().charAt(line.trim().length - 1) === '{';


/**
 * Merges a Patch File (note its not an actual patch file, but simply a file that can be merged in based on
 * VERY SIMPLISTIC javascript AST rules. The rules handled are:
 * 1. imports go first
 * 2. consts go second
 * 3. Everything inside of the main function call stays there, the patch code comes first
 */
const merge = (base, patch) => {
  const result = [];
  let inFunction = false;
  let lookForSemicolon = false;

  let nextBaseLine = base.shift();

  /**
   * push all of the lines for "base" into the resulting file until some criteria is meet
   * @param result Function that will get the line passed into it to determine if processing should stop
   */
  const pushBase = until => {
    while (until(nextBaseLine) || isBlank(nextBaseLine)) {
      // console.log(nextBaseLine)
      result.push(nextBaseLine);
      if (isInCompleteLine(nextBaseLine)) {
        // console.log(`incomplete: ${nextBaseLine}`)
        nextBaseLine = base.shift();
        result.push("//******** start recursion **********");
        pushBase(isNotLineEnd);
        result.push(`//******** end recursion ${nextBaseLine} **********`);
        result.push(nextBaseLine);
        nextBaseLine = base.shift();
      } else {
        nextBaseLine = base.shift();
      }
    }
    console.log(`escape test was for ${nextBaseLine} and was ${until(nextBaseLine)}`);
  };

  /**
   * Push the line from the patch file onto the results. Will set the flag to look for a semicolon if the line does
   * not end in one.
   * @param line to be pushed
   */
  const pushPatch = line => {
    result.push(line);
    //console.log(line)
    lookForSemicolon = !isCompleteLine(line) && !isBlank(line);
  };

  read(`./templates/${patch}.js`).forEach((line, i) => {
    //if the last line didn't end in a semicolon; push all the patch lines onto result until we find one
    if (lookForSemicolon) {
      //console.log('match semicolon');
      pushPatch(line);

      //if an import line is found, push all of bases imports first and then all of patches imports
    } else if (isImport(line)) {
      //console.log('match import');
      pushBase(isImport);
      pushPatch(line);

      //if a const is found push all of the bases consts first and then all of patches consts
    } else if (isConst(line)) {
      //console.log('match const');
      pushBase(isConst);
      pushPatch(line);

      //add app event listeners next
    }  else if (isListener(line)) {
      //console.log('match const');
      pushBase(isListener);
      pushPatch(line);

      //if the function line is found push the version from base and move onto the next line and then...
    } else if (isFunction(line)) {
      //console.log('match function');
      pushBase(baseLine => !isFunction(baseLine));
      pushBase(isInFunction);
      inFunction = true;

      //if it is the end of the function push all of the base lines and function end line into the result
    } else if (inFunction && isFunctionEnd(line)) {
      //console.log('match end function');
      pushBase(baseLine => !isFunctionEnd(baseLine));
      inFunction = false;

      //while inside the function first push all of the patch linesh
    } else if (inFunction || isBlank(line)) {
      //console.log('match in or blank');
      result.push(line);

      //if we hit some other condition simply fail
    } else {
      throw(`Line ${i}: "${line}" from the patch file didn't match anything`);
    }
  });

  //push whatever the last base line we read was
  result.push(nextBaseLine);

  //concat any remaining base lines into the result and return it
  return result.concat(base);
};


/**
 * Find the if/else in the base file where all of the window load functionality happens and replace it with just
 * the loading of the passed in url
 *
 * @param base The file
 * @param url The url
 *
 * @returns {*} The results
 */
const setUrl = (base, url) => {
  const startOfLoad = base.findIndex(line => isLoadUrl(line)) - 1;
  if (startOfLoad > -1) {
    let replaceCount = 2;
    let foundEnd = false;
    while (!foundEnd && startOfLoad + replaceCount < base.length) {
      foundEnd = isElseEnd(base[startOfLoad + replaceCount]);
      replaceCount++;
      foundEnd = foundEnd && !isElse(base[startOfLoad + replaceCount]);
    }
    base.splice(startOfLoad, replaceCount, `  window.loadURL('${url}');`);
  }
  return base;
};

/**
 * Assume that the webpack base will have new BrowserWindow() and set the options.
 * This code will need updating if the base WebPack every starts passing options into BrowserWindow
 *
 * @param base The code to inject into
 *
 * @returns {*} The array of the file with updated data
 */
export const setBrowserOptions = base => {
  const newLineIndex = base.findIndex(line=>line.includes('new BrowserWindow'))
  if ( newLineIndex > -1 ) {
    base[newLineIndex] = base[newLineIndex].replace(/\(\)/, '({webPreferences:{sandbox:true}})');
  }
  return base;
}

export default async function modifyJs(outputDirectory, urlToLoad) {
  console.log('Generating index.js');

  //insert the menu file
  let result = read(`${outputDirectory}/src/main/index.js`);
  result = merge(result, 'menu');
  result = merge(result, 'open-in-browser');
  result = merge(result, 'notifications');
  // result = merge(result, 'debug');

  //set the url
  if (urlToLoad) {
    result = setUrl(result, urlToLoad);
  }

  result = setBrowserOptions(result);

  //write the results back to index.js
  return promisify(fs.writeFile)(`${outputDirectory}/src/main/index.js`, result.join('\n'), 'utf8');
}
