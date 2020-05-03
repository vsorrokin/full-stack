import { uuid } from 'vue-uuid';

// Get first prop name of validationRules (usually it is "formData")
function getRootProp(validationRules) {
  const rulesKeys = Object.keys(validationRules);

  if (rulesKeys.length > 1) return null;

  return rulesKeys[0];
}

function getRulesForLoop(validationRules) {
  const rootProp = getRootProp(validationRules);

  if (!rootProp) return validationRules;

  // Define rules for loop depends on "$each" prop exist (https://monterail.github.io/vuelidate/#sub-collections-validation)
  const rulesForLoop = validationRules[rootProp].$each || validationRules[rootProp];

  return rulesForLoop;
}

function getRulesForFill(validationRules, result) {
  const rootProp = getRootProp(validationRules);

  if (!rootProp) return result;

  result[rootProp] = {};

  if (validationRules[rootProp].$each) {
    result[rootProp].$each = {};
    return result[rootProp].$each;
  } else {
    return result[rootProp];;
  }
}

function prepareValidationRules(validationRules) {
  if (!validationRules) {
    return {};
  }

  const rulesForLoop = getRulesForLoop(validationRules);

  const result = {};
  const rulesForFill = getRulesForFill(validationRules, result);

  Object.keys(rulesForLoop).forEach(fieldName => {
    rulesForFill[fieldName] = {};
    const fieldRules = rulesForFill[fieldName];

    const definedRules = rulesForLoop[fieldName];

    Object.keys(definedRules).forEach(ruleName => {
      if (ruleName === '$each') {
        fieldRules[ruleName] = prepareValidationRules(definedRules[ruleName]);
      } else {
        fieldRules[ruleName] = definedRules[ruleName].rule;
      }
    });

  });

  return result;
};

function prepareValidationMessages(validationRules) {
  if (!validationRules) {
    return {};
  }

  const validationMessages = {};

  const rulesForLoop = getRulesForLoop(validationRules);

  Object.keys(rulesForLoop).forEach(fieldName => {

    const definedRules = rulesForLoop[fieldName];

    validationMessages[fieldName] = {};
    const fieldValidationMessages = validationMessages[fieldName];

    Object.keys(definedRules).forEach(ruleName => {
      if (ruleName === '$each') {
        fieldValidationMessages[ruleName] = prepareValidationMessages(definedRules[ruleName]);
      } else {
        fieldValidationMessages[ruleName] = {'id': uuid.v1(), 'text': definedRules[ruleName].message};
      }
    });

  });

  return validationMessages;
};


export default function(validationRules) {
  return {
    data () {
      let data = validationRules;
      if (typeof validationRules === 'function') data = validationRules(this);
      return {
        validationMessages: prepareValidationMessages(data)
      };
    },
    validations () {
      let data = validationRules;
      if (typeof validationRules === 'function') data = validationRules(this);
      return prepareValidationRules(data);
    }
  };
}
