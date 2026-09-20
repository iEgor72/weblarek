import { categoryMap } from './constants';

export function setCardCategory(element: HTMLElement, category: string): void {
    element.textContent = category;
    element.classList.remove(...Object.values(categoryMap));
    const modifier = categoryMap[category as keyof typeof categoryMap] || categoryMap['другое'];
    element.classList.add(modifier);
}
