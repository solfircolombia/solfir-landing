export const getPortalParentElement = (): HTMLElement | null => {
    return document.getElementById('layout');
}

export const addPortalElement = (el: HTMLElement | null, container: HTMLElement) => {
    if (el) { 
        el.appendChild(container);
    }
    document.body.style.overflow = "hidden"; // To disable the background scrolling
}

export const removePortalElement = (el: HTMLElement | null, container: HTMLElement | null) => {

    if (container) {
        if(el){
            el?.removeChild(container);
        }
    }
    document.body.style.overflow = "initial"; // To enable the background scrolling
}