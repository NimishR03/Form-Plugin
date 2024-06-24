import {
  isInformation,
  getInformation,
  checkLabel,
  isRequired,
} from "./helpers/checkLabel";
import {
  convertToAllCaps,
  convertToUpperSnakeCase,
} from "./helpers/convertCasing";
import {
  obtainType,
  obtainName,
  obtainPlaceholder,
} from "./helpers/obtainFieldNames";

const formConfigImports = {
  SELECTINPUT:
    "import { SelectInput } from '@sprinklrjs/modules/platform/form/fieldRenderers/SelectInput';",
  TEXTINPUT:
    "import { TextInput } from '@sprinklrjs/modules/platform/form/fieldRenderers/TextInput'",
  ASYNCSELECTINPUT:
    "import { DimensionLookupAsyncSelectInput } from '@sprinklrjs/modules/platform/form/fieldRenderers/DimensionLookupAsyncSelectInput'",
};

const formConfigComponents = {
  SELECTINPUT: "SelectInput",
  TEXTINPUT: "TextInput",
  ASYNCSELECTINPUT: "DimensionLookupAsyncSelectInput",
};

export function ifInfo(node) {
  if (isInformation(node)) {
    return `          
      subText: "${getInformation(node)}",
      subTextAsIcon: true,`;
  }
  return "";
}

export function obtainFieldConfigMap(component, imports) {
  let code;
  if (checkLabel(component)) {
    let componentType = convertToAllCaps(obtainType(component));
    imports.add(componentType);
    let required = isRequired(component);
    let fieldConfig = ` .addFieldConfig({
    id: FORM_FIELDS.${convertToUpperSnakeCase(obtainName(component))},
    Component: ${formConfigComponents[componentType]},
    componentProps: {
      label : '${component.name}',
      placeholder: '${obtainPlaceholder(component)}',
      required: ${required},${ifInfo(component)}
    },
  })`;
    return fieldConfig;
  } else {
    if (component.children) {
      code = `${component.children
        .map((child) => obtainFieldConfigMap(child, imports))
        .join("\n")}`;
    }
  }
  return `${code}`;
}

export function generatefieldConfigMap(component) {
  const imports = new Set<string>();
  const fieldConfigMap = obtainFieldConfigMap(component, imports);
  let code = `import { useMemo } from 'react';
  
//component`;
  for (const type of imports) {
    code += `
${formConfigImports[type]}`;
  }

  code += `

//builders
import { FieldConfigBuilder, FieldConfigMapBuilder } from '@sprinklrjs/spaceweb-form';

//constants
import {FORM_FIELDS} from '../constants';

//types
import { FieldConfigMap } from '@sprinklrjs/spaceweb-form/types';
`;

  code += `
export const useFieldConfigMap = (): FieldConfigMap => useMemo( () => 
new FieldConfigMapBuilder()
${fieldConfigMap}
  .build(),
[]
);
`;
  return code;
}
