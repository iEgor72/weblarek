import type { IProduct } from '../../types';

export class Catalog {
    private products: IProduct[] = [];

    setProducts(products: IProduct[]): void {
        this.products = [...products];
    }

    getProducts(): IProduct[] {
        return [...this.products];
    }

    getProductById(id: string): IProduct | undefined {
        return this.products.find((product) => product.id === id);
    }
}
