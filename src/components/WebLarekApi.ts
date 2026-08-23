import type {
    IApi,
    IOrder,
    IOrderResponse,
    IProduct,
    IProductsResponse,
} from '../types';

export class WebLarekApi {
    constructor(private readonly api: IApi) {}

    getProducts(): Promise<IProduct[]> {
        return this.api
            .get<IProductsResponse>('/product/')
            .then((response) => response.items);
    }

    createOrder(order: IOrder): Promise<IOrderResponse> {
        return this.api.post<IOrderResponse>('/order/', order);
    }
}
