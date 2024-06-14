export function generateFormCode(component) {
  let code = `//components
import { Form as SpaceWebForm, useForm } from '@sprinklrjs/spaceweb-form';

//hooks
import {useFieldConfigMap} from './hooks/useFieldConfigMap';

//layout
import {LAYOUT} from './layout';

export const ${component.name} = (): JSX.Element => {

    const fieldConfigMap = useFieldConfigMap();
    
    const { values, errors, handleAction, handleSubmit } = useForm({
        //validate: ({ values: valuesToValidate }) => validate(valuesToValidate, validationSchema), //to be added later
    });
    
    return (
        <SpaceWebForm
            layout={LAYOUT}
            fieldConfigMap={fieldConfigMap}
            values={values}
            errors={errors}
            onAction={handleAction}
        />
    )
}`;
  return code;
}
