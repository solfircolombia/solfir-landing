import React from 'react';

function getTitle(page: string) {
    const siteName: string = 'SOLFIR';
    return React.createElement('title', null, `${siteName} - ${page}`);
}

export { getTitle };
