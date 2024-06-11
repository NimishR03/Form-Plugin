export function generateFormCode(component){
let code = `
import {LAYOUT} from './layout';
import {useFieldConfigMap} from './hooks/useFieldConfigMap';
import { Form, useForm } from '@sprinklrjs/spaceweb-form';

export const ${component.name} = (): JSX.Element => {

    const {fieldConfigMap} = useFieldConfigMap();
    
    const { values, errors, handleAction, handleSubmit } = useForm({
        //validate: ({ values: valuesToValidate }) => validate(valuesToValidate, validationSchema), //to be added later
    });
    
    return (
        <Form
            layout={LAYOUT}
            fieldConfigMap={fieldConfigMap}
            values={values}
            errors={errors}
            onAction={handleAction}
        />
    )
}`
    return code;
  }