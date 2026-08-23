import type {
    IBuyer,
    TBuyerErrors,
    TBuyerField,
} from '../../types';

const emptyBuyer: IBuyer = {
    payment: null,
    address: '',
    email: '',
    phone: '',
};

export class Buyer {
    private data: IBuyer = { ...emptyBuyer };

    setData<K extends TBuyerField>(field: K, value: IBuyer[K]): void {
        this.data[field] = value;
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

    isValid(): boolean {
        return Object.keys(this.validate()).length === 0;
    }

    clear(): void {
        this.data = { ...emptyBuyer };
    }
}
