import { memo } from 'react';
import { SelectItem } from '~/ui/select';

export type FormSelectTypeItemsProps = {
  type: [string, ...string[]] | Readonly<[string, ...string[]]>;
};

const FormSelectTypeItems = memo(({ type }: FormSelectTypeItemsProps) => {
  return (
    <>
      {type.map((d) => (
        <SelectItem key={d} value={d}>
          {d}
        </SelectItem>
      ))}
    </>
  );
});
FormSelectTypeItems.displayName = 'FormSelectTypeItems';

export default FormSelectTypeItems;
