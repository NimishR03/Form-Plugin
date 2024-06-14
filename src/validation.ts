import { obtainConstants } from "./constants";
import { isRequired } from "./extra";
import { checkLabel, convertToUpperSnakeCase, obtainName } from "./util";

export function obtainValidations(component) {
  let code;
  if (checkLabel(component)) {
    if (!isRequired(component)) {
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
