import { useTranslations } from 'next-intl';
import Link from 'next/link';
import React from 'react';

const ProfileListEmpty = () => {
  const t = useTranslations('ProfilePage.Empty');

  return (
    <div className="absolute self-center justify-self-center">
      <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
        {t('NotCreatedYet')}
      </h4>
      <Link href="/create" className="scroll-m-20 text-xl font-semibold tracking-tight">
        {t('ToCreateGoTo')}
        <span className="hover:animate-hue-rotation hover:text-emerald-500 dark:hover:text-emerald-200">
          /create
        </span>
      </Link>
    </div>
  );
};

export default ProfileListEmpty;
