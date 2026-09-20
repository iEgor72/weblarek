# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Vite

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — классы приложения на TypeScript
- src/components/models/ — модели данных
- src/components/views/ — компоненты представления
- src/components/base/ — папка с базовым кодом

Важные файлы:
- index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/main.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Нужен Node.js 20.19+ или 22.12+. Создайте `.env` из `.env.example`: в PowerShell выполните `Copy-Item .env.example .env`, в bash — `cp .env.example .env`. Переменная `VITE_API_ORIGIN` задаёт адрес учебного API. Файл `.env` не включается в Git.

Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run dev
```

или

```
yarn
yarn dev
```
## Сборка

```
npm run build
```

или

```
yarn build
```
# Интернет-магазин «Web-Larёk»
«Web-Larёk» — это интернет-магазин с товарами для веб-разработчиков, где пользователи могут просматривать товары, добавлять их в корзину и оформлять заказы. Сайт предоставляет удобный интерфейс с модальными окнами для просмотра деталей товаров, управления корзиной и выбора способа оплаты, обеспечивая полный цикл покупки с отправкой заказов на сервер.

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP (Model-View-Presenter), которая обеспечивает четкое разделение ответственности между классами слоев Model и View. Каждый слой несет свой смысл и ответственность:

Model - слой данных, отвечает за хранение и изменение данных.
View - слой представления, отвечает за отображение данных на странице.
Presenter - презентер содержит основную логику приложения и  отвечает за связь представления и данных.

Взаимодействие между классами обеспечивается использованием событийно-ориентированного подхода. Модели и Представления генерируют события при изменении данных или взаимодействии пользователя с приложением, а Презентер обрабатывает эти события используя методы как Моделей, так и Представлений.

### Базовый код

#### Класс Component
Является базовым классом для всех компонентов интерфейса.
Класс является дженериком и принимает в переменной `T` тип данных, которые могут быть переданы в метод `render` для отображения.

Конструктор:
`constructor(container: HTMLElement)` - принимает ссылку на DOM элемент за отображение, которого он отвечает.

Поля класса:
`container: HTMLElement` - поле для хранения корневого DOM элемента компонента.

Методы класса:
`render(data?: Partial<T>): HTMLElement` - Главный метод класса. Он принимает данные, которые необходимо отобразить в интерфейсе, записывает эти данные в поля класса и возвращает ссылку на DOM-элемент. Предполагается, что в классах, которые будут наследоваться от `Component` будут реализованы сеттеры для полей с данными, которые будут вызываться в момент вызова `render` и записывать данные в необходимые DOM элементы.
`setImage(element: HTMLImageElement, src: string, alt?: string): void` - утилитарный метод для модификации DOM-элементов `<img>`


#### Класс Api
Содержит в себе базовую логику отправки запросов.

Конструктор:
`constructor(baseUrl: string, options: RequestInit = {})` - В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

Поля класса:
`baseUrl: string` - базовый адрес сервера
`options: RequestInit` - объект с заголовками, которые будут использованы для запросов.

Методы:
`get<T extends object>(uri: string): Promise<T>` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер
`post<T extends object>(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<T>` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.
`handleResponse<T>(response: Response): Promise<T>` - защищенный метод проверяющий ответ сервера на корректность и возвращающий объект с данными полученный от сервера или отклоненный промис, в случае некорректных данных.

#### Класс EventEmitter
Брокер событий реализует паттерн "Наблюдатель", позволяющий отправлять события и подписываться на события, происходящие в системе. Класс используется для связи слоя данных и представления.

Конструктор класса не принимает параметров.

Поля класса:
`_events: Map<string | RegExp, Set<Function>>)` -  хранит коллекцию подписок на события. Ключи коллекции - названия событий или регулярное выражение, значения - коллекция функций обработчиков, которые будут вызваны при срабатывании события.

Методы класса:
`on<T extends object>(event: EventName, callback: (data: T) => void): void` - подписка на событие, принимает название события и функцию обработчик.
`emit<T extends object>(event: string, data?: T): void` - инициализация события. При вызове события в метод передается название события и объект с данными, который будет использован как аргумент для вызова обработчика.
`trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие с передачей в него данных из второго параметра.

### Типы данных

Дополнительные методы базового `EventEmitter`: `off(eventName: string | RegExp, callback: Function): void` снимает один обработчик, `onAll(callback: (event: { eventName: string; data: unknown }) => void): void` подписывается на все события, `offAll(): void` удаляет все подписки.

`IProduct` описывает товар каталога: идентификатор, название, описание, изображение, категорию и цену. Цена имеет тип `number | null`, потому что часть товаров нельзя купить.

`TPayment` задаёт допустимые способы оплаты: `card` или `cash`.

`IBuyer` описывает данные покупателя: способ оплаты, адрес, электронную почту и телефон. До заполнения формы способ оплаты может быть равен `null`.

`IOrder` описывает данные, отправляемые при оформлении заказа. Помимо заполненных данных покупателя содержит итоговую стоимость и массив идентификаторов товаров.

`IProductsResponse` и `IOrderResponse` описывают ответы сервера при получении каталога и оформлении заказа.

`IApi` задаёт контракт базового клиента: методы `get` и `post`. Благодаря этому прикладной API не зависит от конкретной реализации сетевых запросов.

### Модели данных

#### Класс Catalog

Хранит товары, полученные от сервера, и товар, выбранный для подробного отображения.

Конструктор `constructor(events: IEvents)` принимает брокер событий и сохраняет его в приватном поле `events: IEvents`.

Поля:

- `products: IProduct[]` — приватный массив товаров каталога.
- `selectedProduct: IProduct | null` — приватное поле выбранного товара.

Методы:

- `setProducts(products: IProduct[]): void` — сохраняет массив товаров;
- `getProducts(): IProduct[]` — возвращает копию массива товаров;
- `getProductById(id: string): IProduct | undefined` — находит товар по идентификатору;
- `setSelectedProduct(product: IProduct): void` — сохраняет выбранный товар;
- `getSelectedProduct(): IProduct | null` — возвращает выбранный товар.

#### Класс Basket

Хранит выбранные товары и выполняет расчёты, относящиеся к корзине. Решение о добавлении или удалении товара принимает презентер.

Конструктор `constructor(events: IEvents)` принимает брокер событий и сохраняет его в приватном поле `events: IEvents`.

Поля:

- `products: IProduct[]` — приватный массив выбранных товаров.

Методы:

- `addProduct(product: IProduct): void` — добавляет товар;
- `removeProduct(id: string): void` — удаляет товар по идентификатору;
- `hasProduct(id: string): boolean` — проверяет наличие товара;
- `getProducts(): IProduct[]` — возвращает копию списка товаров;
- `getProductIds(): string[]` — возвращает идентификаторы товаров для заказа;
- `getTotal(): number` — рассчитывает общую стоимость;
- `getCount(): number` — возвращает количество товаров;
- `clear(): void` — очищает корзину.

#### Класс Buyer

Хранит данные покупателя и проверяет, что обязательные поля заполнены.

Конструктор `constructor(events: IEvents)` принимает брокер событий и сохраняет его в приватном поле `events: IEvents`.

Поля:

- `data: IBuyer` — приватный объект с текущими данными покупателя.

Методы:

- `setData(field, value): void` — записывает значение выбранного поля;
- `getData(): IBuyer` — возвращает копию данных покупателя;
- `validate(): TBuyerErrors` — возвращает ошибки незаполненных полей;
- `clear(): void` — сбрасывает данные покупателя.

### Слой коммуникации

#### Класс WebLarekApi

Работает с API магазина и получает готовую реализацию `IApi` через композицию.

Конструктор:

`constructor(api: IApi)` — принимает объект для выполнения HTTP-запросов.

Поля:

- `api: IApi` — приватный неизменяемый объект, выполняющий HTTP-запросы.

Методы:

- `getProducts(): Promise<IProductsResponse>` — получает полный ответ сервера со списком товаров через `GET /product/`;
- `createOrder(order: IOrder): Promise<IOrderResponse>` — отправляет заказ через `POST /order/`.

### Слой Представления (View)

Компоненты создаются из готовой разметки и шаблонов `index.html`. Они хранят ссылки на DOM, устанавливают слушатели в конструкторе и передают действия пользователя через брокер событий. Данные товаров и покупателя остаются в моделях. Сеттеры представлений меняют только DOM; `render()` без аргументов возвращает корневой элемент.

Компоненты:

- `Page` — каталог, счётчик корзины и сообщение о загрузке каталога.
- `Card` — абстрактный родитель трёх карточек с общими сеттерами названия и цены.
- `CatalogCard`, `PreviewCard`, `BasketCard` — карточки каталога, просмотра и корзины.
- `BasketView` — список товаров, сумма и кнопка оформления.
- `Modal` — один контейнер для произвольного компонента, без наследников.
- `Form` — абстрактная основа форм с ошибками и кнопкой отправки.
- `OrderForm`, `ContactsForm` — шаги оформления заказа.
- `Success` — результат успешного заказа.

### Взаимодействие частей приложения

В `main.ts` создаются экземпляры моделей, API и компонентов. Сначала регистрируются обработчики событий, затем `WebLarekApi` получает товары с сервера и сохраняет их в `Catalog`. Отладочный код первой части удалён.

### События в моделях

Конструкторы `Catalog`, `Basket` и `Buyer` теперь принимают `events: IEvents` и сохраняют его в приватном поле. Структура данных и публичные методы первой части сохранены. После записи данных методы генерируют события, перечисленные ниже. `Buyer.setData<K extends TBuyerField>(field: K, value: IBuyer[K]): void` связывает тип значения с выбранным полем.

### Типы представления

Новые типы объявлены в `src/types/index.ts`. Исходные типы первой части не изменены.

| Тип | Поля |
| --- | --- |
| `IPageView` | `items: HTMLElement[]`, `counter: number`, `message: string`, `disabled: boolean` |
| `TCardView` | `Pick<IProduct, 'title' \| 'price'>` |
| `TCatalogCardView` | Общие данные карточки, `image: string`, `category: string` |
| `TPreviewCardView` | Данные каталога, `description: string`, `buttonText: string`, `disabled: boolean` |
| `TBasketCardView` | Общие данные карточки, `index: number` |
| `IBasketView` | `items: HTMLElement[]`, `total: number`, `disabled: boolean` |
| `IModalView` | `content: HTMLElement` |
| `IFormView` | `errors: string`, `valid: boolean`, `pending: boolean` |
| `TOrderFormView` | Состояние формы и `Pick<IBuyer, 'payment' \| 'address'>` |
| `TContactsFormView` | Состояние формы и `Pick<IBuyer, 'email' \| 'phone'>` |
| `ISuccessView` | `total: number` |
| `TProductEvent` | `Pick<IProduct, 'id'>` |
| `TBuyerChange` | Объединение `{ field: K; value: IBuyer[K] }` для каждого поля покупателя |
| `ICheckoutState` | `status: 'idle' \| 'pending' \| 'success' \| 'error'`, `total: number`, `error: string` |

`TBuyerField = keyof IBuyer` задаёт поля покупателя, `TBuyerErrors = Partial<Record<TBuyerField, string>>` — ошибки обязательных полей. `ApiPostMethods` ограничивает методы записи значениями `POST`, `PUT`, `DELETE`. Базовый `IEvents` описывает `on`, `emit` и `trigger`.

### Программный интерфейс View

Все компоненты наследуют `render(data?: Partial<T>): HTMLElement`, в том числе вызов без аргументов. Приведённые ниже сеттеры не возвращают значение. Данные не сохраняются в полях View: текст и флаги записываются непосредственно в DOM. Геттеров для извлечения данных приложения у View нет.

#### Page

`constructor(container: HTMLElement, events: IEvents)` принимает `.page__wrapper`. Приватные поля `gallery: HTMLElement`, `basketButton: HTMLButtonElement`, `basketCounter: HTMLElement`, `status: HTMLElement` содержат ссылки на элементы внутри контейнера.

Сеттеры: `items: HTMLElement[]` заменяет каталог, `counter: number` обновляет счётчик, `message: string` показывает статус загрузки/ошибки (пустая строка скрывает его), `disabled: boolean` блокирует кнопку корзины. Клик по корзине генерирует `basket:open`.

#### Card<T extends TCardView>

Абстрактный родитель трёх карточек. Защищённый `constructor(container: HTMLElement)` сохраняет защищённые поля `titleElement: HTMLElement` и `priceElement: HTMLElement`.

Сеттеры: `title: string` записывает название; `price: number | null` выводит цену в синапсах или «Бесценно».

#### CatalogCard

Наследует `Card<TCatalogCardView>`. `constructor(container: HTMLElement, onClick: () => void)` принимает клон `#card-catalog` и обработчик выбора. Приватные поля: `imageElement: HTMLImageElement`, `categoryElement: HTMLElement`.

Сеттеры: `image: string` задаёт полный URL и alt, `category: string` — текст и модификатор категории. Для alt название передаётся в `render` до изображения. Корневая кнопка вызывает `onClick`.

#### PreviewCard

Наследует `Card<TPreviewCardView>`. `constructor(container: HTMLElement, onClick: () => void)` принимает клон `#card-preview` и обработчик покупки/удаления. Приватные поля: `imageElement: HTMLImageElement`, `categoryElement: HTMLElement`, `descriptionElement: HTMLElement`, `button: HTMLButtonElement`.

Сеттеры: `image: string`, `category: string`, `description: string`, `buttonText: string`, `disabled: boolean`. Текст кнопки и возможность покупки определяет презентер. Обработчик установлен на кнопку один раз в конструкторе.

#### BasketCard

Наследует `Card<TBasketCardView>`. `constructor(container: HTMLElement, onClick: () => void)` принимает клон `#card-basket` и обработчик удаления. Приватные поля: `indexElement: HTMLElement`, `button: HTMLButtonElement`. Сеттер `index: number` выводит порядковый номер, начиная с единицы. Название и цена наследуются.

#### BasketView

`constructor(container: HTMLElement, events: IEvents)` принимает клон `#basket`. Приватные поля: `list: HTMLElement`, `price: HTMLElement`, `button: HTMLButtonElement`, `emptyMessage: HTMLElement` — элемент списка с текстом «Корзина пуста», созданный в конструкторе.

Сеттеры: `items: HTMLElement[]` заменяет список (пустой массив показывает сообщение), `total: number` выводит сумму, `disabled: boolean` управляет оформлением. Кнопка генерирует `order:open`. Сумму и доступность рассчитывает презентер.

#### Modal

`constructor(container: HTMLElement, events: IEvents)` принимает `#modal-container`. Приватные поля: `contentElement: HTMLElement`, `closeButton: HTMLButtonElement`. Крестик, клик по подложке и Escape генерируют `modal:close`.

Сеттер `content: HTMLElement` помещает готовый компонент. `open(): void` добавляет `modal_active`, обновляет `aria-hidden` и фокусирует крестик. `close(): void` снимает модификатор и удаляет содержимое из DOM. У `Modal` нет наследников. Стиль `.page:has(.modal_active)` блокирует прокрутку страницы; прокручиваться может только список товаров в корзине, не всё окно.

#### Form<T extends IFormView>

Абстрактный родитель форм. Защищённый `constructor(container: HTMLFormElement, onSubmit: () => void)` находит элементы и устанавливает обработчик `submit`, отменяющий стандартную отправку страницы.

Защищённые поля: `submitButton: HTMLButtonElement`, `errorElement: HTMLElement`, `controls: (HTMLInputElement | HTMLButtonElement)[]` — поля ввода и кнопки выбора оплаты.

Сеттеры: `errors: string` выводит ошибки, `valid: boolean` задаёт доступность отправки, `pending: boolean` блокирует редактирование и меняет `aria-busy`. Валидация выполняется моделью `Buyer`.

#### OrderForm

Наследует `Form<TOrderFormView>`. `constructor(container: HTMLFormElement, events: IEvents)` принимает клон `#order`. Приватные поля: `addressInput: HTMLInputElement`, `cardButton: HTMLButtonElement`, `cashButton: HTMLButtonElement`.

Сеттеры: `address: string` обновляет поле, `payment: TPayment | null` выделяет оплату через `button_alt-active` и `aria-pressed`. Ввод адреса и выбор оплаты генерируют `buyer:input`, отправка — `contacts:open`.

#### ContactsForm

Наследует `Form<TContactsFormView>`. `constructor(container: HTMLFormElement, events: IEvents)` принимает клон `#contacts`. Приватные поля: `emailInput: HTMLInputElement`, `phoneInput: HTMLInputElement`. Сеттеры `email: string` и `phone: string` обновляют поля. Ввод генерирует `buyer:input`, отправка — `order:submit`.

#### Success

`constructor(container: HTMLElement, events: IEvents)` принимает клон `#success`. Приватные поля: `description: HTMLElement`, `button: HTMLButtonElement`. Сеттер `total: number` выводит сумму, подтверждённую сервером. Кнопка генерирует `modal:close`.

### Checkout — состояние отправки заказа

Дополнительная модель хранит состояние запроса, чтобы не размещать его во View. `constructor(events: IEvents)` сохраняет приватный брокер. Приватное поле `state: ICheckoutState` содержит статус, сумму и ошибку.

- `getState(): ICheckoutState` возвращает копию состояния;
- `start(): void` устанавливает `pending`, очищает прошлые сумму и ошибку;
- `succeed(total: number): void` устанавливает `success` и сохраняет сумму;
- `fail(error: string): void` сохраняет ошибку и статус `error`;
- `reset(): void` возвращает состояние `idle`.

Каждый метод изменения состояния генерирует `checkout:changed`.

### События

События без данных передаются без второго аргумента; обработчики читают данные через методы моделей.

| Событие | Источник | Данные | Действие презентера |
| --- | --- | --- | --- |
| `catalog:changed` | `Catalog.setProducts` | — | Отобразить каталог |
| `preview:changed` | `Catalog.setSelectedProduct` | — | Открыть карточку просмотра |
| `basket:changed` | `Basket.addProduct`, `removeProduct`, `clear` | — | Обновить список, сумму, счётчик и доступность оплаты |
| `buyer:changed` | `Buyer.setData`, `clear` | — | Обновить формы и ошибки |
| `checkout:changed` | Методы записи `Checkout` | — | Обновить блокировку, ошибки, результат заказа |
| `product:select` | Обработчик `CatalogCard` | `TProductEvent` | Выбрать товар в модели |
| `product:toggle` | Обработчик `PreviewCard` | `TProductEvent` | Добавить/удалить товар, закрыть окно |
| `basket:remove` | Обработчик `BasketCard` | `TProductEvent` | Удалить товар |
| `basket:open` | `Page` | — | Открыть корзину |
| `order:open` | `BasketView` | — | Открыть первый шаг |
| `buyer:input` | Обе формы | `TBuyerChange` | Сохранить изменённое поле |
| `contacts:open` | `OrderForm` | — | Проверить первый шаг, открыть контакты |
| `order:submit` | `ContactsForm` | — | Проверить данные и отправить заказ |
| `modal:close` | `Modal`, `Success` | — | Закрыть окно |

### Презентер

Презентер — обработчики в `src/main.ts`, без отдельного класса. Базовый `Api` передаётся в `WebLarekApi` через композицию. Карточки получают callback от `events.trigger(...)` с id товара: событие возникает только при вызове callback карточкой. Обработчики презентера не вызывают `emit`.

`renderBasket(): void` читает товары и расчёты из `Basket`, создаёт строки с последовательными номерами, обновляет корзину и счётчик. `renderForms(): void` читает `Buyer` и `Checkout`, разделяет ошибки по двум шагам, передаёт результат формам. Эти функции вызываются при событиях моделей и открытии окон.

Товар без цены нельзя добавить. Выбранный товар удаляется повторным нажатием в карточке, а не дублируется. Кнопка первого шага доступна после выбора оплаты и заполнения адреса, оплата — после заполнения всех полей и при непустой корзине. `Buyer.validate()` проверяет заполненность, без дополнительных ограничений формата email и телефона.

При отправке `IOrder` собирается из `Buyer.getData()`, `Basket.getProductIds()` и `Basket.getTotal()`. `Checkout.start()` блокирует повторную отправку, редактирование форм и изменение корзины. Только после успешного ответа очищаются корзина и покупатель, а `Checkout.succeed()` открывает `Success` через событие модели. При ошибке данные остаются, появляется сообщение и можно повторить запрос.

### Утилиты и проверка

`setCardCategory(element: HTMLElement, category: string): void` в `src/utils/view.ts` задаёт текст и заменяет модификатор по `categoryMap`. Неизвестная категория получает цвет «другое». Повторяющаяся логика вынесена из двух карточек в эту функцию.

DOM компонентов ищется только в конструкторе внутри своего контейнера. `ensureElement<T>()` получает элемент, `cloneTemplate<T>()` клонирует шаблон. Три шаблона карточек сохраняются в `main.ts`, поэтому не ищутся повторно при отрисовке.

`npm run build` проверяет TypeScript и собирает `dist`, `npm run preview` запускает собранную версию. Отдельного линтера в стартовом проекте нет, строгие настройки TypeScript сохранены.

Порядок ручной проверки: каталог → недоступный товар → добавление двух товаров → сумма и нумерация корзины → удаление обоими способами → пустая корзина → ошибки двух форм → успешный заказ → очистка данных. Отдельно проверяются закрытие окна, блокировка повторной отправки и сохранение данных при ошибке API.
