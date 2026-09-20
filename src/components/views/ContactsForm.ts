import { Form } from './Form';
import type { IEvents } from '../base/Events';
import type { TContactsFormView } from '../../types';
import { ensureElement } from '../../utils/utils';

export class ContactsForm extends Form<TContactsFormView> {
    private emailInput: HTMLInputElement;
    private phoneInput: HTMLInputElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, () => events.emit('order:submit'));
        this.emailInput = ensureElement<HTMLInputElement>('[name="email"]', container);
        this.phoneInput = ensureElement<HTMLInputElement>('[name="phone"]', container);
        this.emailInput.addEventListener('input', () => {
            events.emit('buyer:input', { field: 'email', value: this.emailInput.value });
        });
        this.phoneInput.addEventListener('input', () => {
            events.emit('buyer:input', { field: 'phone', value: this.phoneInput.value });
        });
    }

    set email(value: string) {
        this.emailInput.value = value;
    }

    set phone(value: string) {
        this.phoneInput.value = value;
    }
}
