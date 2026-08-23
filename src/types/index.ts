export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export type TPayment = 'card' | 'cash';

export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

export interface IBuyer {
    payment: TPayment | null;
    address: string;
    email: string;
    phone: string;
}

export type TBuyerField = keyof IBuyer;
export type TBuyerErrors = Partial<Record<TBuyerField, string>>;

export interface IOrder extends Omit<IBuyer, 'payment'> {
    payment: TPayment;
    total: number;
    items: string[];
}

export interface IProductsResponse {
    total: number;
    items: IProduct[];
}

export interface IOrderResponse {
    id: string;
    total: number;
}

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}
