import React from 'react';
import { AvatarCardSettings, TextCardSettings } from '../styles/ProfileSettings.css';
import '../styles/Setting.css';

export default function ProfileSettings() {
  return (
    <div className='settings__container'>
      <AvatarCardSettings />
      <TextCardSettings property="Enter your pseudo" />
      <TextCardSettings property="Enter a bio" />
      <TextCardSettings property="Enter your email" />
    </div>
  );
}
