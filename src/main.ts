import './scss/styles.scss';

import { WebLarekApi } from './components/WebLarekApi';
import { Api } from './components/base/Api';
import { EventEmitter } from './components/base/Events';
import { Basket } from './components/models/Basket';
import { Buyer } from './components/models/Buyer';
import { Catalog } from './components/models/Catalog';
import { Header } from './components/views/Header';
import { Gallery } from './components/views/Gallery';
import { CatalogCard } from './components/views/CatalogCard';
import { PreviewCard } from './components/views/PreviewCard';
import { BasketCard } from './components/views/BasketCard';
import { BasketView } from './components/views/BasketView';
import { Modal } from './components/views/Modal';
import { OrderForm } from './components/views/OrderForm';
import { ContactsForm } from './components/views/ContactsForm';
import { Success } from './components/views/Success';
import type { TBuyerChange, TProductEvent, TPayment } from './types';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

const events = new EventEmitter();
const catalog = new Catalog(events);
const basket = new Basket(events);
const buyer = new Buyer(events);
const api = new WebLarekApi(new Api(API_URL));

const header = new Header(ensureElement('.header'), events);
const gallery = new Gallery(ensureElement('.gallery'));
const modal = new Modal(ensureElement('#modal-container'));
const basketView = new BasketView(cloneTemplate('#basket'), events);
const orderForm = new OrderForm(cloneTemplate<HTMLFormElement>('#order'), events);
const contactsForm = new ContactsForm(cloneTemplate<HTMLFormElement>('#contacts'), events);
const success = new Success(cloneTemplate('#success'), events);
const catalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const previewCard = new PreviewCard(cloneTemplate('#card-preview'), events.trigger('preview:clicked'));
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
        disabled: basket.getCount() === 0,
    });
}

function renderForms(): void {
    const data = buyer.getData();
    const errors = buyer.validate();
    const orderErrors = [errors.payment, errors.address].filter(Boolean).join('. ');
    const contactErrors = [errors.email, errors.phone].filter(Boolean).join('. ');

    orderForm.render({
        payment: data.payment,
        address: data.address,
        errors: orderErrors,
        valid: !orderErrors,
    });
    contactsForm.render({
        email: data.email,
        phone: data.phone,
        errors: contactErrors,
        valid: !contactErrors,
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
    gallery.render({ items });
});

events.on<TProductEvent>('product:select', ({ id }) => {
    const product = catalog.getProductById(id);
    if (product) catalog.setSelectedProduct(product);
});

events.on('preview:changed', () => {
    const product = catalog.getSelectedProduct();
    if (!product) return;
    modal.render({ content: previewCard.render({
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

events.on('preview:clicked', () => {
    const product = catalog.getSelectedProduct();
    if (!product || product.price === null) return;
    if (basket.hasProduct(product.id)) basket.removeProduct(product.id);
    else basket.addProduct(product);
    modal.close();
});

events.on('basket:changed', () => {
    renderBasket();
    header.render({ counter: basket.getCount() });
});

events.on('basket:clicked', () => {
    modal.render({ content: basketView.render() });
    modal.open();
});

events.on<TProductEvent>('basket:remove', ({ id }) => {
    basket.removeProduct(id);
});

events.on('basket:checkout', () => {
    modal.render({ content: orderForm.render() });
    modal.open();
});

events.on<TBuyerChange>('buyer:input', (data) => {
    buyer.setData(data.field, data.value);
});

events.on('buyer:changed', renderForms);

events.on('order:submit', () => {
    modal.render({ content: contactsForm.render() });
    modal.open();
});

events.on('contacts:submit', async () => {
    const data = buyer.getData();
    contactsForm.render({ valid: false, pending: true });
    orderForm.render({ valid: false, pending: true });
    header.render({ disabled: true });
    gallery.render({ disabled: true });
    try {
        const result = await api.createOrder({
            ...data,
            payment: data.payment as TPayment,
            items: basket.getProductIds(),
            total: basket.getTotal(),
        });
        basket.clear();
        buyer.clear();
        modal.render({ content: success.render({ total: result.total }) });
        modal.open();
    } catch {
        contactsForm.render({ valid: true });
        orderForm.render({ valid: true });
        window.alert('Не удалось оформить заказ. Попробуйте ещё раз.');
    } finally {
        contactsForm.render({ pending: false });
        orderForm.render({ pending: false });
        header.render({ disabled: false });
        gallery.render({ disabled: false });
    }
});

events.on('success:confirmed', () => modal.close());

basket.clear();
buyer.clear();

api.getProducts()
    .then((response) => catalog.setProducts(response.items))
    .catch(() => window.alert('Не удалось загрузить товары. Обновите страницу.'));
