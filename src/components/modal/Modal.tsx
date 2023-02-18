import * as React from "react";
import ReactDOM from "react-dom";
import { Icon } from "@components";
import { addPortalElement, getPortalParentElement, removePortalElement } from "./helpers";

// Styles
import "./modal.scss";
import { KEY, LABELS } from "@constants";

type ModalProps = {
    onCloseModal: () => void,
    ariaLabel?: string,
};

export const Modal: React.FC<React.PropsWithChildren<ModalProps>> = ({ children, onCloseModal, ariaLabel }) => {

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

    const modalRef = React.createRef<any>();

    let focusableElementIdx = 0;

    const getFocusableElements = () => {

        const selectors: string[] = [
            'button',
            'a[href]'
        ]

        return modalRef.current?.querySelectorAll(
            selectors.join(',')
        );
        
    }

    const handleTabKey = (e: KeyboardEvent) => {
        console.log("Tab");

        const focusableModalElements = getFocusableElements();

        if (focusableModalElements) {

            const firstElement = focusableModalElements[0];
            const lastElement = focusableModalElements[focusableModalElements.length - 1];

            //  Should move to next focusable element
            if (!e.shiftKey) {
                // Focus first element if has reached last element
                if (document.activeElement === lastElement) {
                    focusableElementIdx = 0;
                    firstElement.focus();
                } else {
                    focusableElementIdx++;
                    focusableModalElements[focusableElementIdx].focus();
                }

            }
            //  Should move to prev focusable element
            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    focusableElementIdx = focusableModalElements.length - 1;
                    lastElement.focus();
                } else {
                    focusableElementIdx--;
                    focusableModalElements[focusableElementIdx].focus();
                }
            }
            e.preventDefault();
        }


    };

    const keyListenersMap: Map<KEY, any> = new Map([[KEY.ESCAPE, onCloseModal], [KEY.TAB, handleTabKey]]);


    React.useEffect(() => {
        // Execute on init

        // Add portal
        addPortalElement(getPortalParentElement(), container);

        // Add initial focusable element
        getFocusableElements()[0].focus();

        // Add listeners
        function keyListener(e: KeyboardEvent) {
            const listener = keyListenersMap.get(e.key as KEY);
            return listener && listener(e);
        }
        document.addEventListener("keydown", keyListener);

        return () => {
            // Execute on destroy

            // Remove portal
            removePortalElement(getPortalParentElement(), container);

            // Remove listeners
            document.removeEventListener("keydown", keyListener);
        }
    }, []);


  

    return ReactDOM.createPortal(
        <div
            role="dialog"
            aria-modal="true"
            aria-label={ ariaLabel ?? LABELS.MODAL_DEFAULT}
            className={CLASS_NAME}
            ref={modalRef}
        >
            <div className={`${CLASS_NAME}-wrapper`}>
                <div className={`${CLASS_NAME}-header`} >
                    <button aria-label={LABELS.MENU_CERRAR} className={`${CLASS_NAME}-header-close`} onClick={onCloseModal}>
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