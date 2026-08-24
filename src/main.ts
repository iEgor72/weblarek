import './scss/styles.scss';

import { WebLarekApi } from './components/WebLarekApi';
import { Api } from './components/base/Api';
import { Basket } from './components/models/Basket';
import { Buyer } from './components/models/Buyer';
import { Catalog } from './components/models/Catalog';
import { API_URL } from './utils/constants';
import { apiProducts } from './utils/data';

const catalog = new Catalog();
const basket = new Basket();
const buyer = new Buyer();

console.group('Проверка модели каталога');
catalog.setProducts(apiProducts.items);
console.log('Все товары:', catalog.getProducts());
console.log(
    'Товар по идентификатору:',
    catalog.getProductById(apiProducts.items[0].id)
);
catalog.setSelectedProduct(apiProducts.items[0]);
console.log('Выбранный товар:', catalog.getSelectedProduct());
console.groupEnd();

console.group('Проверка модели корзины');
basket.addProduct(apiProducts.items[0]);
basket.addProduct(apiProducts.items[1]);
console.log('Товары в корзине:', basket.getProducts());
console.log('Идентификаторы товаров:', basket.getProductIds());
console.log('Количество товаров:', basket.getCount());
console.log('Стоимость корзины:', basket.getTotal());
console.log('Первый товар находится в корзине:', basket.hasProduct(apiProducts.items[0].id));
basket.removeProduct(apiProducts.items[0].id);
console.log('Корзина после удаления товара:', basket.getProducts());
basket.clear();
console.log('Корзина после очистки:', basket.getProducts());
console.groupEnd();

console.group('Проверка модели покупателя');
console.log('Ошибки пустой формы:', buyer.validate());
buyer.setData('payment', 'card');
buyer.setData('address', 'Москва, улица Примерная, 1');
buyer.setData('email', 'buyer@example.com');
buyer.setData('phone', '+7 900 000-00-00');
console.log('Данные покупателя:', buyer.getData());
const buyerErrors = buyer.validate();
console.log('Ошибки заполненной формы:', buyerErrors);
console.log(
    'Данные заполнены корректно:',
    Object.keys(buyerErrors).length === 0
);
buyer.clear();
console.log('Данные после очистки:', buyer.getData());
console.groupEnd();

const baseApi = new Api(API_URL);
const api = new WebLarekApi(baseApi);

api.getProducts()
    .then((response) => {
        catalog.setProducts(response.items);
        console.log('Каталог, загруженный с сервера:', catalog.getProducts());
    })
    .catch((error: unknown) => {
        console.error('Не удалось загрузить каталог:', error);
    });
