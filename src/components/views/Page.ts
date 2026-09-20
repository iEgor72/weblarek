import { Component } from '../base/Component';
import type { IEvents } from '../base/Events';
import type { IPageView } from '../../types';
import { ensureElement } from '../../utils/utils';

export class Page extends Component<IPageView> {
    private gallery: HTMLElement;
    private basketButton: HTMLButtonElement;
    private basketCounter: HTMLElement;
    private status: HTMLElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.gallery = ensureElement('.gallery', container);
        this.basketButton = ensureElement<HTMLButtonElement>('.header__basket', container);
        this.basketCounter = ensureElement('.header__basket-counter', container);
        this.status = ensureElement('.page__status', container);
        this.basketButton.addEventListener('click', () => events.emit('basket:open'));
    }

    set items(items: HTMLElement[]) {
        this.gallery.replaceChildren(...items);
    }

    set counter(value: number) {
        this.basketCounter.textContent = String(value);
    }

    set message(value: string) {
        this.status.textContent = value;
        this.status.hidden = !value;
    }

    set disabled(value: boolean) {
        this.basketButton.disabled = value;
    }
}
