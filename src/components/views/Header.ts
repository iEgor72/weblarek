import { Component } from '../base/Component';
import type { IEvents } from '../base/Events';
import type { IHeaderView } from '../../types';
import { ensureElement } from '../../utils/utils';

export class Header extends Component<IHeaderView> {
    private basketButton: HTMLButtonElement;
    private basketCounter: HTMLElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.basketButton = ensureElement<HTMLButtonElement>('.header__basket', container);
        this.basketCounter = ensureElement('.header__basket-counter', container);
        this.basketButton.addEventListener('click', () => events.emit('basket:clicked'));
    }

    set counter(value: number) {
        this.basketCounter.textContent = String(value);
    }

    set disabled(value: boolean) {
        this.basketButton.disabled = value;
    }
}
