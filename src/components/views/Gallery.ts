import { Component } from '../base/Component';
import type { IGalleryView } from '../../types';

export class Gallery extends Component<IGalleryView> {
    constructor(container: HTMLElement) {
        super(container);
    }

    set items(items: HTMLElement[]) {
        this.container.replaceChildren(...items);
    }

    set disabled(value: boolean) {
        this.container.inert = value;
    }
}
