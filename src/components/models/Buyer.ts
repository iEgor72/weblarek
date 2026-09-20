import type {
    IBuyer,
    TBuyerErrors,
    TBuyerField,
} from '../../types';
import type { IEvents } from '../base/Events';

const emptyBuyer: IBuyer = {
    payment: null,
    address: '',
    email: '',
    phone: '',
};

export class Buyer {
    private data: IBuyer = { ...emptyBuyer };

    constructor(private readonly events: IEvents) {}

    setData<K extends TBuyerField>(field: K, value: IBuyer[K]): void {
        this.data[field] = value;
        this.events.emit('buyer:changed');
    }

    getData(): IBuyer {
        return { ...this.data };
    }

    validate(): TBuyerErrors {
        const errors: TBuyerErrors = {};

        if (!this.data.payment) {
            errors.payment = 'Не выбран способ оплаты';
        }
        if (!this.data.address.trim()) {
            errors.address = 'Не указан адрес';
        }
        if (!this.data.email.trim()) {
            errors.email = 'Не указан email';
        }
        if (!this.data.phone.trim()) {
            errors.phone = 'Не указан телефон';
        }

        return errors;
    }

    clear(): void {
        this.data = { ...emptyBuyer };
        this.events.emit('buyer:changed');
    }
}
