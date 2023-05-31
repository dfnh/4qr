import { Input, type InputProps } from '~/ui/input';
import { Label } from '~/ui/label';

interface InputFileProps extends InputProps {
  labelTitle?: string;
}
//todo delete
const InputFile = ({ labelTitle, ...props }: InputFileProps) => {
  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="inputFileId">{labelTitle ?? 'Picture'}</Label>
      <Input id="inputFileId" type="file" {...props} />
    </div>
  );
};

export { InputFile };
