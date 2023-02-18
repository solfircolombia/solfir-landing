import * as React from "react";
import ReactDOM from "react-dom";
import { Icon } from "@components";
import { addPortalElement, getContainerElement, getPortalParentElement, removePortalElement } from "./helpers";

// Styles
import "./modal.scss";

type ModalProps = {
    onCloseModal: () => void
}

export const Modal: React.FC<React.PropsWithChildren<ModalProps>> = ({ children, onCloseModal }) => {

    const CONTAINER_CLASS_NAME = 'portal'
    const CONTAINER_ELEMENT_TAG = 'div';

    const [container] = React.useState<HTMLElement>(() => {
        // This will be executed only on the initial render
        // https://reactjs.org/docs/hooks-reference.html#lazy-initial-state

        const containerElement = document.createElement(CONTAINER_ELEMENT_TAG);
        containerElement.classList.add(CONTAINER_CLASS_NAME);
        containerElement.id = CONTAINER_CLASS_NAME;

        return containerElement;
    });

    const CLASS_NAME = 'modal';


    React.useEffect(() => {
        // Execute on init
        addPortalElement(getPortalParentElement(), container);
        return () => {
            // Execute on destroy
            removePortalElement(getPortalParentElement(), container);
        }
    }, []);

    return ReactDOM.createPortal(
        <div className={CLASS_NAME}>
            <div className={`${CLASS_NAME}-wrapper`}>
                <div className={`${CLASS_NAME}-header`} >
                    <button className={`${CLASS_NAME}-header-close`} onClick={onCloseModal}>
                        <Icon name='close' fill="black"></Icon>
                    </button>
                </div>
                <div className={`${CLASS_NAME}-content`}>
                    {children}
                </div>
                <div className={`${CLASS_NAME}-footer`}>
                    <span>SOLFIR Colombia SAS</span>
                </div>
            </div>
        </div>
    , container);
}