import { Card } from './Card';
import type { TPreviewCardView } from '../../types';
import { ensureElement } from '../../utils/utils';
import { setCardCategory } from '../../utils/view';

export class PreviewCard extends Card<TPreviewCardView> {
    private imageElement: HTMLImageElement;
    private categoryElement: HTMLElement;
    private descriptionElement: HTMLElement;
    private button: HTMLButtonElement;

    constructor(container: HTMLElement, onClick: () => void) {
        super(container);
        this.imageElement = ensureElement<HTMLImageElement>('.card__image', container);
        this.categoryElement = ensureElement('.card__category', container);
        this.descriptionElement = ensureElement('.card__text', container);
        this.button = ensureElement<HTMLButtonElement>('.card__button', container);
        this.button.addEventListener('click', onClick);
    }

    set image(value: string) {
        this.setImage(this.imageElement, value);
    }

    set category(value: string) {
        setCardCategory(this.categoryElement, value);
    }

    set description(value: string) {
        this.descriptionElement.textContent = value;
    }

    set buttonText(value: string) {
        this.button.textContent = value;
    }

    set disabled(value: boolean) {
        this.button.disabled = value;
    }
}
