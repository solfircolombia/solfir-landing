import * as React from "react"

import { Footer, Header } from "@components";
import "./layout.scss";

export const Layout: React.FC<{children: any}> = ({children}) => {
    return (
        <main className="layout">
            <Header></Header>
            <div className="content" >{children}</div>
            <Footer></Footer>
        </main>
    );  
}