import { Component } from '../base/Component';
import type { IFormView } from '../../types';
import { ensureElement } from '../../utils/utils';

export abstract class Form<T extends IFormView> extends Component<T> {
    protected submitButton: HTMLButtonElement;
    protected errorElement: HTMLElement;
    protected controls: (HTMLInputElement | HTMLButtonElement)[];

    protected constructor(container: HTMLFormElement, onSubmit: () => void) {
        super(container);
        this.submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', container);
        this.errorElement = ensureElement('.form__errors', container);
        this.controls = Array.from(container.querySelectorAll<HTMLInputElement | HTMLButtonElement>(
            'input, button[type="button"]'
        ));
        this.errorElement.setAttribute('aria-live', 'polite');
        container.addEventListener('submit', (event) => {
            event.preventDefault();
            onSubmit();
        });
    }

    set errors(value: string) {
        this.errorElement.textContent = value;
    }

    set valid(value: boolean) {
        this.submitButton.disabled = !value;
    }

    set pending(value: boolean) {
        this.controls.forEach((control) => { control.disabled = value; });
        this.container.setAttribute('aria-busy', String(value));
    }
}
