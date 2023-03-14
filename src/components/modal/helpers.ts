export const getPortalParentElement = (): HTMLElement | null => {
    return document.getElementById('layout');
};

export const addPortalElement = (el: HTMLElement | null, container: HTMLElement) => {
    if (el) {
        el.appendChild(container);
    }
    document.body.style.overflow = 'hidden'; // To disable the background scrolling
};

export const removePortalElement = (el: HTMLElement | null, container: HTMLElement | null) => {
    try {
        if (container && el) {
            el?.removeChild(container);
        }
    } catch (error: unknown) {
        if (error instanceof DOMException) {
            console.log('Cannot find child element');
        } else if (error instanceof Error) {
            console.error('Modal helper error: ', error.message);
        }
    }
    document.body.style.overflow = 'initial'; // To enable the background scrolling
};
