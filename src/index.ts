export function generateIndexCode(component){
    let code = `// components
import {${component.name}} from './${component.name}';
    
export default ${component.name};
    `
        return code;
      }