import * as React from "react"

import { Footer, Header, Icon, Settings } from "@components";
import "./layout.scss";

export const Layout: React.FC<{ children: any }> = ({ children }) => {

    const contactPhoneNumber = "3196399877";
    const contactMsg = "Hola%21%0A%0AEstoy%20interesado%20en%20obtener%20m%C3%A1s%20informaci%C3%B3n%20sobre%20los%20servicios%20de%20insolvencia%20y%20reorganizaci%C3%B3n%20que%20ofrece%20%2ASOLFIR%2A.%0A%0A%C2%BFPodr%C3%ADa%20proporcionarme%20m%C3%A1s%20detalles%20o%20programar%20una%20consulta%20para%20discutir%20mis%20opciones%3F%20Gracias%20por%20su%20tiempo.%0A%0AMuchas%20gracias%21%21";

    return (
        <main className="layout" id="layout">
            <Header></Header>
            <div className="content" >{children}</div>
            <Footer></Footer>
            {/* <a className="bubble" target="_blank" href={`https://wa.me/${contactPhoneNumber}?text=${contactMsg}`}> */}
            <a className="bubble">
                <Icon name="whatsapp" fill="white"></Icon>
            </a>
            <Settings></Settings>
        </main>
    );
}