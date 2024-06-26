import { checkLabel } from "./helpers/checkLabel";
import { convertToUpperSnakeCase } from "./helpers/convertCasing";
import { obtainName, obtainTitle } from "./helpers/obtainFieldNames";

export function generateComponentCode(component, depth) {
  const indentation = "  ".repeat(depth);
  let code;
  if (checkLabel(component)) {
    return `${indentation}.addNode(FORM_FIELDS.${convertToUpperSnakeCase(
      obtainName(component)
    )})`;
  } else {
    if (component.children) {
      if (depth === 1) {
        code = `
${indentation}new LayoutBuilder({
${indentation}  direction: '${component.direction}',${isTitle(
          component.node,
          depth
        )}
${indentation}})
${component.children
  .map((child) => generateComponentCode(child, depth + 1))
  .join("\n")}
${indentation}.build()`;
      } else {
        code = `${indentation}.addNode(
${indentation}  new LayoutBuilder({
${indentation}    direction: '${component.direction}', ${isTitle(
          component.node,
          depth
        )}
${indentation}  })
${component.children
  .map((child) => generateComponentCode(child, depth + 1))
  .join("\n")}
  ${indentation}.build()
${indentation})`;
      }
    }
  }
  return `${code}`;
}

export function generateLayout(component) {
  let code = `//builders
import { LayoutBuilder } from '@sprinklrjs/spaceweb-form';

//constants
import {FORM_FIELDS} from './constants';

export const LAYOUT = ${generateComponentCode(component, 1)}
`;
  return code;
}

function isTitle(node, depth) {
  let title = obtainTitle(node);
  const indentation = "  ".repeat(depth);
  if (title !== "") {
    return `
${indentation}    group: {
${indentation}      title: '${title}',
${indentation}      className: 'p-0',
${indentation}    },`;
  }
  return "";
}
