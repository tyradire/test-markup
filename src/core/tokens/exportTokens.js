const fs = require("fs");
const _ = require("lodash");
let fileOutput = [], tempArray = [];

// Load the exported variables from Figma
// const dataColors = require("./tokens_color.json");
// const dataDimension = require("./tokens_dimension.json");
// const dataSpace = require("./tokens_space.json");
// const dataBorder = require("./tokens_border.json");
// const dataSizes = require("./tokens_sizes.json");
// const dataMargins = require("./tokens_margin.json");
const dataAll = require("./design.tokens.json");
// Define the fields that contain colors and their respective Tailwind keywords
const regexObject = new RegExp('\{(.*?)\}');

// all tokens
for (let field in dataAll) {
  getFiniteValue(dataAll[field], field, '', dataAll);
}

// // color tokens
// for (let field in dataColors) {
//   getFiniteValue(dataColors[field], field, '', dataColors);
// }

// //dimension+
// for (let field in dataDimension) {
//   getFiniteValue(dataDimension);
// }

// // space+
// for (let field in dataSpace) {
//   getFiniteValue(dataSpace[field], field, '', dataDimension);
// }

// // border+
// for (let field in dataBorder) {
//   getFiniteValue(dataBorder[field], field, 'border-radius-', dataBorder);
// }

// // sizes+
// for (let field in dataSizes) {
//   getFiniteValue(dataSizes, '', 'sizes-', dataDimension);
// }

//margins
// for (let field in dataMargins) {
//   getFiniteValue(dataMargins, '', 'margin-', dataDimension);
// }

// setNotFindVariables(tempArray);

function getFiniteValue(obj, field, prefix = '', globalArray) {
  let handledFlag = 'temp__isAlreadyHandled__';
  let propertyPath, finishValue;

  getProp(obj);
  function getProp(o, stack) {
    for (let prop in o) {
      if (typeof (o[prop]) === 'object') {
        if (!o[prop][handledFlag]) {
          Object.defineProperty(o[prop], handledFlag, {
            value: true,
            writable: false,
            configurable: true
          });

          if (!stack) {
            propertyPath = (field ? field + '-' : '') + prop
          }
          else {
            propertyPath = (stack ? stack + '-' : '') + prop;
          }
          getProp(o[prop], propertyPath);
        } else {
          propertyPath = (stack ? stack + '-' : '') + prop;
          console.error('Циклическая ссылка. Свойство: ' + propertyPath);
        }
        delete o[prop][handledFlag]
      } else {

        if (prop == '$value') {
          if (propertyPath) {
            propertyPath = propertyPath.toLowerCase()
              .replace(/ /g, ',')
              .replace(/\-\+/g, '-lighter-')
              .replace(/\-\-/g, '-darker-')
              .replace(/\./g, '-')
              .replace(/\,/g, '-')
              .replace('{', '')
              .replace('}', '')
          }
          let element, value;
          if (regexObject.test(o[prop])) {
            // value = '$'+ o[prop].toLowerCase()
            //                     .replace(/ /g, ',')
            //                     .replace(/\-\+/g, '-lighter-')
            //                     .replace(/\-\-/g, '-darker-')
            //                     .replace(/\./g, '-')
            //                     .replace(/\,/g,'-')
            //                     .replace('{','')
            //                     .replace('}','');

            // if(!fileOutput[value]){
            //     tempArray['$'+propertyPath] = value;
            // }else{
            //     fileOutput['$'+propertyPath] = value;
            // }
            getLink((propertyPath ? propertyPath : field), o[prop], prefix, globalArray);
          } else {
            value = o[prop];
            fileOutput['$' + propertyPath] = value;
          }
        }
      }
    }

  }
}

function getLink(propertyPath, object, prefix, globalArray) {
  let array = globalArray;
  if (regexObject.test(object)) {
    object = object.replace('{', '').replace('}', '').split('.');


    // for (let i = 0; i < object.length; i++) {
    //   if (object[i].includes(object[0]) && i !== 0 || object[0].includes('color')) {
    //     object = object.slice(1);
    //   }
    // }

    object.forEach((item) => {
      array = array[item];
    })

    if (regexObject.test(array['$value'])) {
      getLink(propertyPath, array['$value'], prefix, globalArray);
    } else {
      if (propertyPath) {
        propertyPath = propertyPath.toLowerCase().replace(/ /g, ',').replace(',', '-');
        fileOutput['$' + prefix + propertyPath] = array['$value'];
      }
    }
  }
}

function setNotFindVariables(array) {
  if (Object.keys(array).length > 0) {
    for (let value in array) {
      if (fileOutput[array[value]]) {
        fileOutput[value] = array[value];
        delete tempArray[value];
      } else {
        setNotFindVariables(tempArray);
      }
    }
  }
}

let variablesList = [];
if (Object.keys(fileOutput).length > 0) {
  for (let variable in fileOutput) {
    variablesList.push(variable + ':' + fileOutput[variable] + ';');
  }
}

fs.writeFileSync(
  "../config/scss/_token_variables.scss",
  variablesList.join('\n'),
  "utf-8",
);

console.log(
  "Processing completed successfully. Output written to 'variableOutput.js'.",
);
