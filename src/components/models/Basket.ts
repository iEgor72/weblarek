import type { IProduct } from '../../types';
import type { IEvents } from '../base/Events';

export class Basket {
    private products: IProduct[] = [];

    constructor(private readonly events: IEvents) {}

    addProduct(product: IProduct): void {
        this.products.push(product);
        this.events.emit('basket:changed');
    }

    removeProduct(id: string): void {
        this.products = this.products.filter((product) => product.id !== id);
        this.events.emit('basket:changed');
    }

    hasProduct(id: string): boolean {
        return this.products.some((product) => product.id === id);
    }

    getProducts(): IProduct[] {
        return [...this.products];
    }

    getProductIds(): string[] {
        return this.products.map((product) => product.id);
    }

    getTotal(): number {
        return this.products.reduce(
            (total, product) => total + (product.price ?? 0),
            0
        );
    }

    getCount(): number {
        return this.products.length;
    }

    clear(): void {
        this.products = [];
        this.events.emit('basket:changed');
    }
}
