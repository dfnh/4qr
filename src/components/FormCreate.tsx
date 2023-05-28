import { useSession } from 'next-auth/react';
import { memo, useEffect, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { type QrFullSchema } from '~/schemas/QRCodeStyling';
import { Label } from '~/ui/label';
import { Separator } from '~/ui/separator';
import { Textarea } from '~/ui/textarea';
import { ErrorSpan } from './ErrorSpan';
import { FormCreateOptions, FormSwitch } from './FormCreateOptions';
import { GeneratePassword } from './GeneratePassword';
import HoverCardWrapper from './HoverCardWrapper';
import { useTranslations } from 'next-intl';

const FormCreate = () => {
  const t = useTranslations('CreateQrPage.CardCreate.FormCreate.Data');
  const {
    register,
    formState: { errors },
  } = useFormContext<QrFullSchema>();

  return (
    <form className="grid gap-2">
      <Label htmlFor="data">{t('label')}</Label>
      <Textarea
        id="data"
        className="resize-none"
        placeholder={t('placeholder')}
        {...register('data')}
      />
      {errors.data?.message && <ErrorSpan>{errors.data.message}</ErrorSpan>}

      <FormCreateMainBusiness />
      <Separator className="my-2" />
      <FormCreateOptions />
    </form>
  );
};

const FormCreateMainBusiness = () => {
  const t = useTranslations('CreateQrPage.CardCreate.FormCreate');
  const { status } = useSession();
  const isAuthed = useMemo(() => status === 'authenticated', [status]);

  return (
    <>
      <FormSwitchSlink
        isAuthed={isAuthed}
        label={t('FormSwitchSlink.label')}
        hoverCardText={t('FormSwitchSlink.hoverCardText', {
          isAuthed: isAuthed,
        })}
      />
      <FormSwitchMain
        name="sign"
        label={t('FormSwitchSign.label')}
        isAuthed={isAuthed}
        hoverCardText={t('FormSwitchSign.hoverCardText', {
          isAuthed: isAuthed,
        })}
      />
      <GeneratePassword isAuthed={isAuthed} />
    </>
  );
};

type FormSwitchMainProps = {
  isAuthed: boolean;
  hoverCardText: string;
  label: string;
  name: string;
};
const FormSwitchMain = memo(
  ({ hoverCardText, label, name, isAuthed = true }: FormSwitchMainProps) => {
    return (
      <HoverCardWrapper
        className="text-sm"
        openDelay={!isAuthed ? 200 : undefined}
        hoverCardText={hoverCardText}
      >
        <FormSwitch name={name} label={label} disabled={!isAuthed} />
      </HoverCardWrapper>
    );
  }
);
FormSwitchMain.displayName = 'FormSwitchMain';

type FormSwitchSlinkProps = Omit<FormSwitchMainProps, 'name'>;
const FormSwitchSlink = memo(
  ({ hoverCardText, label, isAuthed = true }: FormSwitchSlinkProps) => {
    const { watch, setValue } = useFormContext<QrFullSchema>();
    const sign = watch('sign');
    const slink = watch('slink');

    useEffect(() => {
      if (sign) {
        setValue('slink', true);
      }
    }, [setValue, sign]);
    useEffect(() => {
      if (!slink) {
        setValue('sign', false);
      }
    }, [setValue, slink]);

    return (
      <FormSwitchMain
        name="slink"
        label={label}
        isAuthed={isAuthed}
        hoverCardText={hoverCardText}
      />
    );
  }
);
FormSwitchSlink.displayName = 'FormSwitchSlink';

export default FormCreate;
