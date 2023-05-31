import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import FormSwitchMain from './FormSwitchMain';
import FormSwitchSlink from './FormSwitchSlink';
import GeneratePassword from './GeneratePassword';

const CreateFormMain = () => {
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

export default CreateFormMain;
