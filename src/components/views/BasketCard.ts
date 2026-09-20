import { Card } from './Card';
import type { TBasketCardView } from '../../types';
import { ensureElement } from '../../utils/utils';

export class BasketCard extends Card<TBasketCardView> {
    private indexElement: HTMLElement;
    private button: HTMLButtonElement;

    constructor(container: HTMLElement, onClick: () => void) {
        super(container);
        this.indexElement = ensureElement('.basket__item-index', container);
        this.button = ensureElement<HTMLButtonElement>('.card__button', container);
        this.button.addEventListener('click', onClick);
    }

    set index(value: number) {
        this.indexElement.textContent = String(value);
    }
}
