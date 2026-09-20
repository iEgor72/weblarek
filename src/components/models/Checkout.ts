import type { ICheckoutState } from '../../types';
import type { IEvents } from '../base/Events';

export class Checkout {
    private state: ICheckoutState = { status: 'idle', total: 0, error: '' };

    constructor(private readonly events: IEvents) {}

    getState(): ICheckoutState {
        return { ...this.state };
    }

    start(): void {
        this.state = { status: 'pending', total: 0, error: '' };
        this.events.emit('checkout:changed');
    }

    succeed(total: number): void {
        this.state = { status: 'success', total, error: '' };
        this.events.emit('checkout:changed');
    }

    fail(error: string): void {
        this.state = { status: 'error', total: 0, error };
        this.events.emit('checkout:changed');
    }

    reset(): void {
        this.state = { status: 'idle', total: 0, error: '' };
        this.events.emit('checkout:changed');
    }
}
