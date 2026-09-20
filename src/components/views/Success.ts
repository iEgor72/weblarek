import { Component } from '../base/Component';
import type { IEvents } from '../base/Events';
import type { ISuccessView } from '../../types';
import { ensureElement } from '../../utils/utils';

export class Success extends Component<ISuccessView> {
    private description: HTMLElement;
    private button: HTMLButtonElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.description = ensureElement('.order-success__description', container);
        this.button = ensureElement<HTMLButtonElement>('.order-success__close', container);
        this.button.addEventListener('click', () => events.emit('modal:close'));
    }

    set total(value: number) {
        this.description.textContent = `Списано ${value} синапсов`;
    }
}
