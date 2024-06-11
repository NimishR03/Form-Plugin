import { checkLabel, convertToUpperSnakeCase, converttoCamelCase, obtainName, obtainType } from "./util";

const formConfigImports = {
    'SelectInput' : "import { Select } from '@sprinklrjs/modules/infra/components/interactiveAtoms/Select'",
    'TextInput' : "import { TextInput } from '@sprinklrjs/modules/platform/form/fieldRenderers/TextInput'",
    'AsyncSelectInput' : "import { DimensionLookupAsyncSelectInput } from '@sprinklrjs/modules/platform/form/fieldRenderers/DimensionLookupAsyncSelectInput'"
        
}
const formConfigComponents = {
    'SelectInput' : "Select",
    'TextInput' : "TextInput",
    'AsyncSelectInput' : "DimensionLookupAsyncSelectInput"
        
}

export function obtainFieldConfigMap(component,imports) {
    let code;
    if (checkLabel(component)) {
        let componentType = obtainType(component);
        imports.add(componentType);
        let fieldConfig=`           .addFieldConfig({
                id: FORM_FIELDS.${convertToUpperSnakeCase(obtainName(component))},
                Component: ${formConfigComponents[componentType]}
            })`;
        return fieldConfig;
    } 
    else {
if (component.children) {
code=
`${component.children.map(child => obtainFieldConfigMap(child,imports)).join('\n')}
`;
}
    }
    return `${code}`;
  }

export function generatefieldConfigMap(component){
    const imports = new Set<string>();
    const fieldConfigMap = obtainFieldConfigMap(component, imports);
  let code = `//builders
import { FieldConfigBuilder, FieldConfigMapBuilder } from '@sprinklrjs/spaceweb-form';

//types
import { FieldConfigMap } from '@sprinklrjs/spaceweb-form/types';

import {FORM_FIELDS} from '../constants';

`;

for(const type of imports){
    code+=`
${formConfigImports[type]}`;
}
  
code+= `

export const useFieldConfigMap = (): FieldConfigMap => {
    const fieldConfigMap = useMemo( () => 
        new FieldConfigMapBuilder()
${fieldConfigMap}          .build(),
    []);
    return fieldConfigMap
};
`
  return code;
}
