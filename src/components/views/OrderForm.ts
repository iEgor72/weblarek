import { Form } from './Form';
import type { IEvents } from '../base/Events';
import type { TOrderFormView, TPayment } from '../../types';
import { ensureElement } from '../../utils/utils';

export class OrderForm extends Form<TOrderFormView> {
    private addressInput: HTMLInputElement;
    private cardButton: HTMLButtonElement;
    private cashButton: HTMLButtonElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, () => events.emit('order:submit'));
        this.addressInput = ensureElement<HTMLInputElement>('[name="address"]', container);
        this.cardButton = ensureElement<HTMLButtonElement>('[name="card"]', container);
        this.cashButton = ensureElement<HTMLButtonElement>('[name="cash"]', container);
        this.addressInput.addEventListener('input', () => {
            events.emit('buyer:input', { field: 'address', value: this.addressInput.value });
        });
        this.cardButton.addEventListener('click', () => {
            events.emit('buyer:input', { field: 'payment', value: 'card' });
        });
        this.cashButton.addEventListener('click', () => {
            events.emit('buyer:input', { field: 'payment', value: 'cash' });
        });
    }

    set address(value: string) {
        this.addressInput.value = value;
    }

    set payment(value: TPayment | null) {
        this.cardButton.classList.toggle('button_alt-active', value === 'card');
        this.cashButton.classList.toggle('button_alt-active', value === 'cash');
        this.cardButton.setAttribute('aria-pressed', String(value === 'card'));
        this.cashButton.setAttribute('aria-pressed', String(value === 'cash'));
    }
}
