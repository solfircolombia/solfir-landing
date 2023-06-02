import React from 'react';
import { ContentfulLivePreviewProvider } from '@contentful/live-preview/react';

// Logs when the client route changes
export const onRouteUpdate = ({ location, prevLocation }: {}): void => {
    console.log('new pathname', location.pathname);
    console.log('old pathname', prevLocation ? prevLocation.pathname : null);
};

// Wraps every page in a component
export const wrapPageElement = ({ element }) => {
    return <ContentfulLivePreviewProvider locale="en-US">{element}</ContentfulLivePreviewProvider>;
};
