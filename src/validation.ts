import { checkLabel, isRequired } from "./helpers/checkLabel";
import { convertToUpperSnakeCase } from "./helpers/convertCasing";
import { obtainName } from "./helpers/obtainFieldNames";

export function obtainValidations(component) {
  let code;
  if (checkLabel(component)) {
    if (isRequired(component)) {
      return `   
  [FORM_FIELDS.${convertToUpperSnakeCase(
    obtainName(component)
  )}]: vs.string().required (ERROR_TYPES.MANDATORY()),`;
    } else {
      return;
    }
  } else {
    if (component.children) {
      code = `${component.children
        .map((child) => obtainValidations(child))
        .join("")}`;
    }
  }
  return `${code}`;
}

export function generateValidation(component) {
  let code = `
import vs from '@sprinklrjs/validation-schema/validationSchema';

//modules
import ERROR_TYPES from '@sprinklrjs/modules/infra/utils/errorTypes'; 

//constants
import { FORM_FIELDS } from './constants';

const schema = {${obtainValidations(component)}
};
export const validationSchema = vs.object(schema);
`;
  return code;
}
