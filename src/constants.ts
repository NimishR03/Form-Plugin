import { checkLabel } from "./helpers/checkLabel";
import {
  convertToUpperSnakeCase,
  converttoCamelCase,
} from "./helpers/convertCasing";
import { obtainName } from "./helpers/obtainFieldNames";

export function obtainConstants(component) {
  let code;
  if (checkLabel(component)) {
    return `  ${convertToUpperSnakeCase(
      obtainName(component)
    )}: '${converttoCamelCase(obtainName(component))}',`;
  } else {
    if (component.children) {
      code = `${component.children
        .map((child) => obtainConstants(child))
        .join("\n")}`;
    }
  }
  return `${code}`;
}

export function generateConstants(component) {
  let code = `export const FORM_FIELDS = {
${obtainConstants(component)}
}`;
  return code;
}
