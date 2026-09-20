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

export interface IHeaderView {
    counter: number;
    disabled: boolean;
}

export interface IGalleryView {
    items: HTMLElement[];
    disabled: boolean;
}

export type TCardView = Pick<IProduct, 'title' | 'price'>;
export type TCatalogCardView = TCardView & Pick<IProduct, 'image' | 'category'>;
export type TPreviewCardView = TCatalogCardView & Pick<IProduct, 'description'> & {
    buttonText: string;
    disabled: boolean;
};
export type TBasketCardView = TCardView & { index: number };

export interface IBasketView {
    items: HTMLElement[];
    total: number;
    disabled: boolean;
}

export interface IModalView {
    content: HTMLElement;
}

export interface IFormView {
    errors: string;
    valid: boolean;
    pending: boolean;
}

export type TOrderFormView = IFormView & Pick<IBuyer, 'payment' | 'address'>;
export type TContactsFormView = IFormView & Pick<IBuyer, 'email' | 'phone'>;
export interface ISuccessView {
    total: number;
}

export type TBuyerChange = {
    [K in TBuyerField]: { field: K; value: IBuyer[K] }
}[TBuyerField];
export type TProductEvent = Pick<IProduct, 'id'>;
