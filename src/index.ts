export function generateIndexCode(component){
    let code = `
// builders
import {${component.name}} from './${component.name}';
    
export default ${component.name};
    `
        return code;
      }