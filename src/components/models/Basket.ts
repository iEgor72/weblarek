import type { IProduct } from '../../types';

export class Basket {
    private products: IProduct[] = [];

    addProduct(product: IProduct): void {
        this.products.push(product);
    }

    removeProduct(id: string): void {
        this.products = this.products.filter((product) => product.id !== id);
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
    }
}
