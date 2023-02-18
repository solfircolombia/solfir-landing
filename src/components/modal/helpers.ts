export const getPortalParentElement = (): HTMLElement | null => {
    console.log("getPortalParentElement");
    return document.getElementById('layout');
}

export const addPortalElement = (el: HTMLElement | null, container: HTMLElement) => {
    console.log("addPortalElement");
    if (el) { 
        el.appendChild(container);
    }
    document.body.style.overflow = "hidden"; // To disable the background scrolling
}

export const removePortalElement = (el: HTMLElement | null, container: HTMLElement | null) => {

    console.log("removePortalElement el:", el, " cont: ", container);
    if (container) {
        if(el){
            el?.removeChild(container);
        }
    }
    document.body.style.overflow = "initial"; // To enable the background scrolling
}