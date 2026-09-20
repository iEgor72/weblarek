import { Component } from '../base/Component';
import type { IEvents } from '../base/Events';
import type { IBasketView } from '../../types';
import { ensureElement } from '../../utils/utils';

export class BasketView extends Component<IBasketView> {
    private list: HTMLElement;
    private price: HTMLElement;
    private button: HTMLButtonElement;
    private emptyMessage: HTMLElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.list = ensureElement('.basket__list', container);
        this.price = ensureElement('.basket__price', container);
        this.button = ensureElement<HTMLButtonElement>('.basket__button', container);
        this.emptyMessage = document.createElement('li');
        this.emptyMessage.textContent = 'Корзина пуста';
        this.button.addEventListener('click', () => events.emit('order:open'));
    }

    set items(items: HTMLElement[]) {
        this.list.replaceChildren(...(items.length ? items : [this.emptyMessage]));
    }

    set total(value: number) {
        this.price.textContent = `${value} синапсов`;
    }

    set disabled(value: boolean) {
        this.button.disabled = value;
    }
}
