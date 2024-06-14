import { isRequired } from "./extra";
import { checkLabel, convertToUpperSnakeCase, converttoCamelCase, obtainName, obtainPlaceholder, obtainType } from "./util";

const formConfigImports = {
    'SelectInput' : "import { SelectInput } from '@sprinklrjs/modules/platform/form/fieldRenderers/SelectInput';",
    'TextInput' : "import { TextInput } from '@sprinklrjs/modules/platform/form/fieldRenderers/TextInput'",
    'AsyncSelectInput' : "import { DimensionLookupAsyncSelectInput } from '@sprinklrjs/modules/platform/form/fieldRenderers/DimensionLookupAsyncSelectInput'"
}

const formConfigComponents = {
    'SelectInput' : "SelectInput",
    'TextInput' : "TextInput",
    'AsyncSelectInput' : "DimensionLookupAsyncSelectInput"
}

export function obtainFieldConfigMap(component,imports) {
    let code;
    if (checkLabel(component)) {
        let componentType = obtainType(component);
        imports.add(componentType);
        if(isRequired(component)){
            let fieldConfig=`       .addFieldConfig({
            id: FORM_FIELDS.${convertToUpperSnakeCase(obtainName(component))},
            Component: ${formConfigComponents[componentType]},
            componentProps: {
                label : '${component.name}',
                placeholder: '${obtainPlaceholder(component)}',
                required: false,
            },
        })`;
            return fieldConfig;
        }
        else{
            let fieldConfig=`       .addFieldConfig({
            id: FORM_FIELDS.${convertToUpperSnakeCase(obtainName(component))},
            Component: ${formConfigComponents[componentType]},
            componentProps: {
                label : '${component.name}',
                placeholder: '${obtainPlaceholder(component)}',
                required: true,
            },
        })`;
            return fieldConfig;
        }
        
    } 
    else {
    if (component.children) {
    code=`${component.children.map(child => obtainFieldConfigMap(child,imports)).join('\n')}`;
    }
    }
    return `${code}`;
  }

export function generatefieldConfigMap(component){
    const imports = new Set<string>();
    const fieldConfigMap = obtainFieldConfigMap(component, imports);
  let code = "//components";
for(const type of imports){
    code+=`
${formConfigImports[type]}`;
}
  
  
code+= `

import { useMemo } from 'react';

//builders
import { FieldConfigBuilder, FieldConfigMapBuilder } from '@sprinklrjs/spaceweb-form';

//constants
import {FORM_FIELDS} from '../constants';

//types
import { FieldConfigMap } from '@sprinklrjs/spaceweb-form/types';

`;


  
code+= `

export const useFieldConfigMap = (): FieldConfigMap => useMemo( () => 
    new FieldConfigMapBuilder()
${fieldConfigMap}
        .build(),
    []
);
`
  return code;
}