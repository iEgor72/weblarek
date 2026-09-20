import './scss/styles.scss';

import { WebLarekApi } from './components/WebLarekApi';
import { Api } from './components/base/Api';
import { EventEmitter } from './components/base/Events';
import { Basket } from './components/models/Basket';
import { Buyer } from './components/models/Buyer';
import { Catalog } from './components/models/Catalog';
import { Checkout } from './components/models/Checkout';
import { Page } from './components/views/Page';
import { CatalogCard } from './components/views/CatalogCard';
import { PreviewCard } from './components/views/PreviewCard';
import { BasketCard } from './components/views/BasketCard';
import { BasketView } from './components/views/BasketView';
import { Modal } from './components/views/Modal';
import { OrderForm } from './components/views/OrderForm';
import { ContactsForm } from './components/views/ContactsForm';
import { Success } from './components/views/Success';
import type { TBuyerChange, TProductEvent } from './types';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

const events = new EventEmitter();
const catalog = new Catalog(events);
const basket = new Basket(events);
const buyer = new Buyer(events);
const checkout = new Checkout(events);
const api = new WebLarekApi(new Api(API_URL));

const page = new Page(ensureElement('.page__wrapper'), events);
const modal = new Modal(ensureElement('#modal-container'), events);
const basketView = new BasketView(cloneTemplate('#basket'), events);
const orderForm = new OrderForm(cloneTemplate<HTMLFormElement>('#order'), events);
const contactsForm = new ContactsForm(cloneTemplate<HTMLFormElement>('#contacts'), events);
const success = new Success(cloneTemplate('#success'), events);
const catalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const previewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');

function renderBasket(): void {
    const items = basket.getProducts().map((product, index) => {
        const card = new BasketCard(
            cloneTemplate(basketTemplate),
            events.trigger('basket:remove', { id: product.id })
        );
        return card.render({ title: product.title, price: product.price, index: index + 1 });
    });
    basketView.render({
        items,
        total: basket.getTotal(),
        disabled: basket.getCount() === 0 || checkout.getState().status === 'pending',
    });
    page.render({ counter: basket.getCount() });
}

function renderForms(): void {
    const data = buyer.getData();
    const errors = buyer.validate();
    const state = checkout.getState();
    const pending = state.status === 'pending';
    const orderErrors = [errors.payment, errors.address].filter(Boolean).join('. ');
    const contactErrors = [errors.email, errors.phone].filter(Boolean).join('. ');

    orderForm.render({
        payment: data.payment,
        address: data.address,
        errors: orderErrors,
        valid: !orderErrors && !pending,
        pending,
    });
    contactsForm.render({
        email: data.email,
        phone: data.phone,
        errors: contactErrors || state.error,
        valid: Object.keys(errors).length === 0 && basket.getCount() > 0 && !pending,
        pending,
    });
}

events.on('catalog:changed', () => {
    const items = catalog.getProducts().map((product) => {
        const card = new CatalogCard(
            cloneTemplate(catalogTemplate),
            events.trigger('product:select', { id: product.id })
        );
        return card.render({
            title: product.title,
            price: product.price,
            category: product.category,
            image: `${CDN_URL}${product.image}`,
        });
    });
    page.render({ items, message: items.length ? '' : 'В каталоге пока нет товаров' });
});

events.on<TProductEvent>('product:select', ({ id }) => {
    if (checkout.getState().status === 'pending') return;
    const product = catalog.getProductById(id);
    if (product) catalog.setSelectedProduct(product);
});

events.on('preview:changed', () => {
    const product = catalog.getSelectedProduct();
    if (!product) return;
    const card = new PreviewCard(
        cloneTemplate(previewTemplate),
        events.trigger('product:toggle', { id: product.id })
    );
    modal.render({ content: card.render({
        title: product.title,
        price: product.price,
        image: `${CDN_URL}${product.image}`,
        category: product.category,
        description: product.description,
        buttonText: product.price === null ? 'Недоступно' :
            basket.hasProduct(product.id) ? 'Удалить из корзины' : 'Купить',
        disabled: product.price === null,
    }) });
    modal.open();
});

events.on<TProductEvent>('product:toggle', ({ id }) => {
    if (checkout.getState().status === 'pending') return;
    const product = catalog.getProductById(id);
    if (!product || product.price === null) return;
    if (basket.hasProduct(id)) basket.removeProduct(id);
    else basket.addProduct(product);
    modal.close();
});

events.on('basket:changed', () => {
    renderBasket();
    renderForms();
});

events.on('basket:open', () => {
    renderBasket();
    modal.render({ content: basketView.render() });
    modal.open();
});

events.on<TProductEvent>('basket:remove', ({ id }) => {
    if (checkout.getState().status !== 'pending') basket.removeProduct(id);
});

events.on('order:open', () => {
    if (!basket.getCount() || checkout.getState().status === 'pending') return;
    checkout.reset();
    renderForms();
    modal.render({ content: orderForm.render() });
    modal.open();
});

events.on<TBuyerChange>('buyer:input', (data) => {
    if (checkout.getState().status === 'pending') return;
    buyer.setData(data.field, data.value);
});

events.on('buyer:changed', renderForms);

events.on('contacts:open', () => {
    const errors = buyer.validate();
    if (errors.payment || errors.address || !basket.getCount()) return;
    renderForms();
    modal.render({ content: contactsForm.render() });
    modal.open();
});

events.on('checkout:changed', () => {
    const state = checkout.getState();
    page.render({ disabled: state.status === 'pending' });
    renderForms();
    if (state.status === 'success') {
        modal.render({ content: success.render({ total: state.total }) });
        modal.open();
    }
});

events.on('order:submit', async () => {
    if (checkout.getState().status === 'pending' || !basket.getCount()) return;
    const data = buyer.getData();
    if (Object.keys(buyer.validate()).length || !data.payment) return;
    checkout.start();
    try {
        const result = await api.createOrder({
            ...data,
            payment: data.payment,
            items: basket.getProductIds(),
            total: basket.getTotal(),
        });
        basket.clear();
        buyer.clear();
        checkout.succeed(result.total);
    } catch {
        checkout.fail('Не удалось оформить заказ. Попробуйте ещё раз.');
    }
});

events.on('modal:close', () => modal.close());

api.getProducts()
    .then((response) => catalog.setProducts(response.items))
    .catch(() => page.render({ message: 'Не удалось загрузить товары. Обновите страницу.' }));
