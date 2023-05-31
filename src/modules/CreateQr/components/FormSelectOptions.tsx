import { memo } from 'react';
import { SelectWrapper, type SelectWrapperProps } from '~/components/SelectWrapper';
import { Label } from '~/ui/label';
import FormSelectTypeItems, {
  type FormSelectTypeItemsProps,
} from './FormSelectTypeItems';

export type FormSelectOptions = { label: string } & FormSelectTypeItemsProps &
  Required<
    Pick<SelectWrapperProps, 'placeholder' | 'defaultValue' | 'onSelected' | 'name'>
  > &
  Pick<SelectWrapperProps, 'className'>;

const FormSelectOptions = memo((props: FormSelectOptions) => {
  return (
    <>
      <Label>{props.label}</Label>
      <SelectWrapper
        placeholder={props.placeholder}
        defaultValue={props.defaultValue}
        onSelected={props.onSelected}
        name={props.name}
        className={props.className}
      >
        <FormSelectTypeItems type={props.type} />
      </SelectWrapper>
    </>
  );
});
FormSelectOptions.displayName = 'FormSelectOptions';

export { type OnSelectType } from '~/components/SelectWrapper';

export default FormSelectOptions;
