import { Card } from './Card';
import type { TCatalogCardView } from '../../types';
import { ensureElement } from '../../utils/utils';
import { setCardCategory } from '../../utils/view';

export class CatalogCard extends Card<TCatalogCardView> {
    private imageElement: HTMLImageElement;
    private categoryElement: HTMLElement;

    constructor(container: HTMLElement, onClick: () => void) {
        super(container);
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', container);
        this.categoryElement = ensureElement('.card__category', container);
        container.addEventListener('click', onClick);
    }

    set image(value: string) {
        this.setImage(this.imageElement, value, this.titleElement.textContent || 'Товар');
    }

    set category(value: string) {
        setCardCategory(this.categoryElement, value);
    }
}
