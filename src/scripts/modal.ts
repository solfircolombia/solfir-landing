export interface ModalController {
    open: () => void;
    close: () => void;
}

export function bindModal(modal: HTMLElement): ModalController {
    let index = 0;

    const focusable = (): HTMLElement[] =>
        Array.from(modal.querySelectorAll<HTMLElement>('button, a[href]')).filter(
            (element) => !element.hasAttribute('disabled')
        );

    function onKey(event: KeyboardEvent): void {
        if (event.key === 'Escape') {
            event.preventDefault();
            close();
            return;
        }
        if (event.key !== 'Tab') {
            return;
        }
        const items = focusable();
        if (items.length === 0) {
            return;
        }
        event.preventDefault();
        const last = items.length - 1;
        if (event.shiftKey) {
            index = document.activeElement === items[0] ? last : Math.max(0, index - 1);
        } else {
            index = document.activeElement === items[last] ? 0 : Math.min(last, index + 1);
        }
        items[index]?.focus();
    }

    function open(): void {
        modal.hidden = false;
        document.body.style.overflow = 'hidden';
        const items = focusable();
        index = 0;
        items[0]?.focus();
        document.addEventListener('keydown', onKey);
    }

    function close(): void {
        if (modal.hidden) {
            return;
        }
        modal.hidden = true;
        document.body.style.overflow = '';
        document.removeEventListener('keydown', onKey);
    }

    modal.querySelectorAll<HTMLElement>('[data-modal-close]').forEach((button) => {
        button.addEventListener('click', () => {
            close();
        });
    });

    return { open, close };
}
