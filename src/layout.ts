import { checkLabel, convertToUpperSnakeCase, obtainName } from "./util";


export function generateComponentCode(component, depth ) {
    const indentation = '  '.repeat(depth);
    let code;
    if (checkLabel(component)) {
return `${indentation}.addNode(FORM_FIELDS.${convertToUpperSnakeCase(obtainName(component))})`;
    } 
    else {
if (component.children) {
code=
`
${indentation}.addnode(
  ${indentation}new LayoutBuilder:({
  ${indentation}${indentation}direction: '${component.direction}',
  ${indentation}})

${component.children.map(child => generateComponentCode(child, depth + 2)).join(',\n')}
  ${indentation}.build()
${indentation})`;
}
    }
    return `${code}`;
  }

export function generateLayout(component){
  let code = `
//builders
import { LayoutBuilder } from '@sprinklrjs/spaceweb-form';

//constants
import {FORM_FIELDS} './constants';

export const LAYOUT = ${generateComponentCode(component,1)}
`
  return code;
}
  


  