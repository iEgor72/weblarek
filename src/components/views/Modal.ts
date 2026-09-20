import { Component } from '../base/Component';
import type { IModalView } from '../../types';
import { ensureElement } from '../../utils/utils';

export class Modal extends Component<IModalView> {
    private contentElement: HTMLElement;
    private closeButton: HTMLButtonElement;

    constructor(container: HTMLElement) {
        super(container);
        this.contentElement = ensureElement('.modal__content', container);
        this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
        this.closeButton.addEventListener('click', () => this.close());
        container.addEventListener('click', (event) => {
            if (event.target === container) this.close();
        });
        container.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') this.close();
        });
    }

    set content(value: HTMLElement) {
        this.contentElement.replaceChildren(value);
    }

    open(): void {
        this.container.classList.add('modal_active');
        this.closeButton.focus();
    }

    close(): void {
        const focusedElement = document.activeElement;
        if (focusedElement instanceof HTMLElement && this.container.contains(focusedElement)) {
            focusedElement.blur();
        }
        this.container.classList.remove('modal_active');
        this.contentElement.replaceChildren();
    }
}
