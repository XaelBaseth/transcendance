// BackgroundSwitcher.tsx
import React, { useState } from 'react';

const BackgroundSwitcher: React.FC = () => {
    const [background, setBackground] = useState('default');

    const changeBackground = (bg: string) => {
        setBackground(bg);
        const bgUrl: Record<string, string> = {
            'default': 'var(--background-default)',
            'alternate1': 'var(--background-alternate1)',
            'alternate2': 'var(--background-alternate2)',
            // Ajoutez d'autres mappings ici
        };
        document.documentElement.style.setProperty('--background-image', bgUrl[bg]);
    };

    return (
        <div>
            <button onClick={() => changeBackground('default')}>Default Background</button>
            <button onClick={() => changeBackground('alternate1')}>Alternate 1</button>
            <button onClick={() => changeBackground('alternate2')}>Alternate 2</button>
        </div>
    );
};

export default BackgroundSwitcher;
