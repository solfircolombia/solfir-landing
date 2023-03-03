import * as React from 'react';

export const onRenderBody = ({ setHeadComponents }: { setHeadComponents: any }) => {
  setHeadComponents([
    <link
      rel="preload"
      href="/fonts/modern20.ttf"
      as="font"
      type="font/ttf"
      crossOrigin="anonymous"
      key="modern20font"
    />,
    <link
      rel="preload"
      href="/fonts/Champagne&Limousines.ttf"
      as="font"
      type="font/ttf"
      crossOrigin="anonymous"
      key="Champagne&Limousines"
    />,
    <link
      rel="preload"
      href="/fonts/Champagne&LimousinesBold.ttf"
      as="font"
      type="font/ttf"
      crossOrigin="anonymous"
      key="Champagne&LimousinesBold"
    />,
    <link
      rel="preload"
      href="/fonts/Champagne&LimousinesBoldItalic.ttf"
      as="font"
      type="font/ttf"
      crossOrigin="anonymous"
      key="Champagne&LimousinesBoldItalic"
    />,
    <link
      rel="preload"
      href="/fonts/Champagne&LimousinesItalic.ttf"
      as="font"
      type="font/ttf"
      crossOrigin="anonymous"
      key="Champagne&LimousinesItalic"
    />,
  ]);
};
