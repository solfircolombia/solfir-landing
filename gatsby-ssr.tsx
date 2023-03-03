import * as React from "react"

export const onRenderBody = ({ setHeadComponents }:{setHeadComponents:any}) => {
  setHeadComponents([
    <link
      rel="preload"
      href="/fonts/modern20.ttf"
      as="font"
      type="font/ttf"
      crossOrigin="anonymous"
      key="modern20font"
    />,
  ])
}