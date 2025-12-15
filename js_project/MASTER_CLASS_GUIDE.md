# Мастер-класс: Подготовка к экзамену по ООП

## Система управления начислениями за коммунальные услуги

---

## Оглавление

1. [Введение в проект](#введение-в-проект)
2. [Как подготовиться к экзамену на примере этого проекта](#как-подготовиться-к-экзамену)
3. [Основные принципы ООП в проекте](#основные-принципы-ооп)
4. [Построчный разбор кода](#построчный-разбор-кода)
5. [Типичные вопросы экзамена](#типичные-вопросы-экзамена)

---

## Введение в проект

### Что делает проект?

Проект реализует систему для управления начислениями за коммунальные услуги:

- Хранение данных о гражданах, услугах, начислениях
- Обработка начислений с применением валидации и скидок
- Генерация Excel-файлов с извещениями на оплату

### Зачем этот проект для изучения ООП?

Проект демонстрирует **все четыре основных принципа ООП**:

1. **Инкапсуляция** - скрытие внутренней реализации
2. **Наследование** - создание новых классов на основе существующих
3. **Полиморфизм** - разные классы реализуют один интерфейс по-разному
4. **Абстракция** - выделение общих характеристик объектов

---

## Как подготовиться к экзамену

### Стратегия подготовки

1. **Изучите структуру проекта**

   - Какие классы есть и за что они отвечают
   - Как классы связаны между собой
   - Какие паттерны проектирования используются

2. **Разберите каждый класс**

   - Конструктор: что он делает и какие параметры принимает
   - Свойства (поля): какие данные хранят объекты
   - Методы: какие действия могут выполнять объекты

3. **Найдите примеры ООП принципов**

   - Где используется инкапсуляция?
   - Где демонстрируется наследование?
   - Как проявляется полиморфизм?
   - Где применена абстракция?

4. **Попробуйте написать похожий проект**
   - Начните с простых классов (как Street)
   - Добавьте классы с методами (как Service)
   - Реализуйте наследование (как ChargeHandler)
   - Примените паттерны проектирования

---

## Основные принципы ООП

### 1. ИНКАПСУЛЯЦИЯ (Encapsulation)

**Суть:** Объединение данных (свойств) и методов (функций) в одном объекте и скрытие внутренней реализации.

**Примеры в проекте:**

#### Пример 1: Приватные поля в Database

```javascript
export class Database {
  // Приватные поля - недоступны извне
  #streets = new Map();
  #accounts = new Map();

  // Публичные методы - единственный способ работы с данными
  addStreet(street) {
    this.#streets.set(street.streetCode, street);
  }

  getStreet(streetCode) {
    return this.#streets.get(streetCode);
  }
}
```

**Объяснение:**

- Поля `#streets` и `#accounts` нельзя изменить напрямую извне
- Доступ возможен только через методы `addStreet()`, `getStreet()`
- Это защищает данные от случайного изменения
- Внутренняя реализация (использование Map) скрыта от пользователя класса

**Вопрос для экзамена:** "Что такое инкапсуляция? Приведите пример из проекта."

- **Ответ:** Инкапсуляция - это объединение данных и методов в одном объекте и скрытие внутренней реализации. В проекте класс `Database` использует приватные поля `#streets`, `#accounts` (недоступные извне) и предоставляет публичные методы для работы с ними.

#### Пример 2: Метод calculateCost в Service

```javascript
export class Service {
  constructor(serviceCode, name, tariff) {
    this.serviceCode = serviceCode;
    this.name = name;
    this.tariff = tariff; // Данные объекта
  }

  calculateCost(quantity) {
    // Метод работает с данными объекта
    return this.tariff * quantity;
  }
}
```

**Объяснение:**

- Данные (tariff) и метод (calculateCost) объединены в одном классе
- Метод использует данные объекта через `this.tariff`
- Логика расчета инкапсулирована внутри класса

---

### 2. НАСЛЕДОВАНИЕ (Inheritance)

**Суть:** Создание нового класса на основе существующего класса с наследованием его свойств и методов.

**Примеры в проекте:**

#### Пример: Иерархия обработчиков

```javascript
// Базовый (родительский) класс
export class ChargeHandler {
  #nextHandler = null;

  setNext(handler) {
    this.#nextHandler = handler;
    return handler;
  }

  handle(charge, service) {
    throw new Error("Метод должен быть переопределен");
  }
}

// Дочерний класс (наследуется от ChargeHandler)
export class ValidationChargeHandler extends ChargeHandler {
  // Переопределяет метод handle из родительского класса
  handle(charge, service) {
    if (charge.quantity < 0) {
      throw new Error("Отрицательное количество");
    }
    return this._processNext(charge, service);
  }
}
```

**Объяснение:**

- `ValidationChargeHandler extends ChargeHandler` - наследование
- Дочерний класс наследует методы `setNext()` и `_processNext()`
- Дочерний класс переопределяет метод `handle()`
- Ключевое слово `extends` означает "расширяет" или "наследуется от"

**Вопрос для экзамена:** "Что такое наследование? Покажите пример из проекта."

- **Ответ:** Наследование - это создание нового класса на основе существующего. В проекте класс `ValidationChargeHandler extends ChargeHandler` наследует методы базового класса и может их переопределять или дополнять.

**Зачем нужно наследование?**

- Избегаем дублирования кода (общие методы в базовом классе)
- Легко добавлять новые типы обработчиков
- Обеспечиваем единый интерфейс для всех обработчиков

---

### 3. ПОЛИМОРФИЗМ (Polymorphism)

**Суть:** Возможность использовать объекты разных классов через единый интерфейс, где каждый класс реализует этот интерфейс по-своему.

**Примеры в проекте:**

#### Пример: Разные реализации метода handle()

```javascript
// Все три класса имеют метод handle(), но реализуют его по-разному

// Обработчик 1: валидация
export class ValidationChargeHandler extends ChargeHandler {
  handle(charge, service) {
    // Проверяет данные
    if (charge.quantity < 0) throw new Error("...");
    return this._processNext(charge, service);
  }
}

// Обработчик 2: применение скидки
export class DiscountChargeHandler extends ChargeHandler {
  handle(charge, service) {
    // Применяет скидку
    const cost = service.calculateCost(charge.quantity);
    if (cost >= this.discountThreshold) {
      return cost - discount;
    }
    return this._processNext(charge, service);
  }
}

// Обработчик 3: стандартный расчет
export class StandardChargeHandler extends ChargeHandler {
  handle(charge, service) {
    // Просто вычисляет стоимость
    return service.calculateCost(charge.quantity);
  }
}
```

**Объяснение:**

- Все три класса имеют метод `handle(charge, service)`
- Но каждый реализует его по-разному
- В коде можно вызывать `handler.handle(...)` не зная, какой именно обработчик это
- Это и есть полиморфизм: "один интерфейс, много реализаций"

**Вопрос для экзамена:** "Что такое полиморфизм? Приведите пример."

- **Ответ:** Полиморфизм - это способность объектов разных классов отвечать на один и тот же метод по-разному. В проекте три обработчика (`ValidationChargeHandler`, `DiscountChargeHandler`, `StandardChargeHandler`) все реализуют метод `handle()`, но каждый выполняет свою логику.

---

### 4. АБСТРАКЦИЯ (Abstraction)

**Суть:** Выделение общих характеристик объектов и создание абстрактных классов/интерфейсов, которые определяют ЧТО должно быть, но не КАК это реализовано.

**Примеры в проекте:**

#### Пример: Абстрактный метод в ChargeHandler

```javascript
export class ChargeHandler {
  // Абстрактный метод - определен интерфейс, но нет реализации
  handle(charge, service) {
    throw new Error("Метод должен быть переопределен в дочернем классе");
  }
}
```

**Объяснение:**

- Базовый класс `ChargeHandler` определяет ЧТО должен делать метод `handle()`
- Но НЕ определяет КАК это делать
- Реализация делегируется дочерним классам
- Это абстракция: мы абстрагируемся от конкретной реализации

**Вопрос для экзамена:** "Что такое абстракция в ООП?"

- **Ответ:** Абстракция - это выделение общих характеристик объектов и создание абстрактных описаний. В проекте класс `ChargeHandler` абстрактно определяет, что обработчик должен иметь метод `handle()`, но конкретную реализацию оставляет дочерним классам.

---

## Построчный разбор кода

### Файл: models.js

#### Класс Street

```javascript
/**
 * Класс Улица.
 * Демонстрирует простой класс с инкапсуляцией данных.
 * Это пример КЛАССА как шаблона для создания объектов.
 */
export class Street {
  /**
   * Конструктор класса - специальный метод, вызываемый при создании объекта.
   * @param {number} streetCode - Код улицы
   * @param {string} name - Название улицы
   */
  constructor(streetCode, name) {
    // this - ссылка на текущий объект
    this.streetCode = streetCode; // Публичное свойство (публичное поле)
    this.name = name;
  }
}
```

**Построчное объяснение:**

1. **`export class Street {`**

   - `export` - делает класс доступным для импорта в других файлах
   - `class` - ключевое слово для объявления класса
   - `Street` - имя класса (обычно с заглавной буквы)
   - `{` - начало тела класса

2. **`constructor(streetCode, name) {`**

   - `constructor` - специальный метод, вызываемый при создании объекта через `new`
   - `(streetCode, name)` - параметры конструктора
   - Эти параметры передаются при создании: `new Street(1, "Ленина")`

3. **`this.streetCode = streetCode;`**

   - `this` - ссылка на создаваемый объект
   - `this.streetCode` - создает свойство объекта
   - `= streetCode` - присваивает значение из параметра
   - После этого объект будет иметь свойство `streetCode`

4. **`this.name = name;`**
   - Аналогично создает свойство `name`

**Как это работает:**

```javascript
// Создание объекта (экземпляра класса)
const street = new Street(1, "Ленина");
// Выполняется constructor(1, "Ленина")
// this = новый пустой объект
// this.streetCode = 1
// this.name = "Ленина"
// Возвращается объект: { streetCode: 1, name: "Ленина" }

// Доступ к свойствам
console.log(street.streetCode); // 1
console.log(street.name); // "Ленина"
```

---

#### Класс Service

```javascript
export class Service {
  constructor(serviceCode, name, tariff) {
    this.serviceCode = serviceCode;
    this.name = name;
    this.tariff = tariff;
  }

  calculateCost(quantity) {
    return this.tariff * quantity;
  }
}
```

**Построчное объяснение:**

1. **`constructor(serviceCode, name, tariff) {`**

   - Конструктор принимает три параметра
   - Инициализирует три свойства объекта

2. **`calculateCost(quantity) {`**

   - Это МЕТОД класса (функция, принадлежащая объекту)
   - `quantity` - параметр метода
   - Метод можно вызвать только у объекта: `service.calculateCost(10)`

3. **`return this.tariff * quantity;`**
   - `this.tariff` - обращение к свойству объекта
   - Выполняет вычисление и возвращает результат
   - Демонстрирует инкапсуляцию: метод работает с данными объекта

**Как это работает:**

```javascript
// Создание объекта
const service = new Service(1, "Холодное водоснабжение", 45.5);
// service = { serviceCode: 1, name: "Холодное водоснабжение", tariff: 45.50 }

// Вызов метода
const cost = service.calculateCost(10);
// Внутри метода: this = service
// this.tariff = 45.50
// return 45.50 * 10 = 455.0
// cost = 455.0
```

---

### Файл: database.js

#### Класс Database с приватными полями

```javascript
export class Database {
  // Приватные поля - демонстрация инкапсуляции
  #streets = new Map();
  #accounts = new Map();
  #services = new Map();
  #charges = new Map();

  constructor() {
    // Приватные поля уже инициализированы
  }

  addStreet(street) {
    this.#streets.set(street.streetCode, street);
  }

  getStreet(streetCode) {
    return this.#streets.get(streetCode);
  }
}
```

**Построчное объяснение:**

1. **`#streets = new Map();`**

   - `#` - обозначает приватное поле (private field в JavaScript)
   - `new Map()` - создает коллекцию типа Map (ключ-значение)
   - Это поле НЕ доступно извне класса
   - Можно использовать только внутри методов класса

2. **`constructor() { }`**

   - Пустой конструктор (приватные поля уже инициализированы)

3. **`addStreet(street) {`**

   - Публичный метод для добавления улицы
   - Это единственный способ добавить улицу (инкапсуляция)

4. **`this.#streets.set(street.streetCode, street);`**
   - `this.#streets` - обращение к приватному полю внутри метода
   - `.set(key, value)` - метод Map для сохранения пары ключ-значение
   - `street.streetCode` - ключ (код улицы)
   - `street` - значение (объект улицы)

**Как это работает:**

```javascript
const db = new Database();
const street = new Street(1, "Ленина");

// ✅ Правильно: через публичный метод
db.addStreet(street);

// ❌ Ошибка: нельзя обратиться к приватному полю
// db.#streets  // SyntaxError: Private field '#streets' must be declared

// ✅ Правильно: через публичный метод
const found = db.getStreet(1);
```

**Почему это важно для экзамена?**

- Показывает понимание инкапсуляции
- Демонстрирует использование приватных полей
- Защита данных от прямого доступа

---

### Файл: chainOfResponsibility.js

#### Базовый класс ChargeHandler

```javascript
export class ChargeHandler {
  #nextHandler = null;

  constructor() {
    // Конструктор может быть пустым
  }

  setNext(handler) {
    this.#nextHandler = handler;
    return handler;
  }

  handle(charge, service) {
    throw new Error("Метод должен быть переопределен");
  }

  #processNext(charge, service) {
    if (this.#nextHandler) {
      return this.#nextHandler.handle(charge, service);
    }
    return null;
  }

  _processNext(charge, service) {
    return this.#processNext(charge, service);
  }
}
```

**Построчное объяснение:**

1. **`#nextHandler = null;`**

   - Приватное поле для хранения следующего обработчика в цепочке
   - Изначально `null` (нет следующего обработчика)

2. **`setNext(handler) { ... return handler; }`**

   - Устанавливает следующий обработчик
   - `return handler` - возвращает handler для цепочки вызовов (Fluent Interface)
   - Позволяет писать: `handler1.setNext(handler2).setNext(handler3)`

3. **`handle(charge, service) { throw new Error(...); }`**

   - Абстрактный метод - должен быть переопределен в дочерних классах
   - Если не переопределен, выбрасывает ошибку
   - Демонстрирует абстракцию

4. **`#processNext(charge, service) { ... }`**

   - Приватный метод (недоступен даже в наследниках)
   - Передает обработку следующему обработчику в цепочке
   - Если следующего нет, возвращает `null`

5. **`_processNext(charge, service) { ... }`**
   - Публичный метод для доступа к приватному `#processNext`
   - Соглашение именования: `_` означает "защищенный" метод
   - Используется в дочерних классах

**Паттерн Chain of Responsibility:**

- Каждый обработчик может либо обработать запрос, либо передать его дальше
- Создается цепочка: handler1 -> handler2 -> handler3
- Если handler1 не может обработать, передает handler2 и т.д.

---

#### Дочерний класс ValidationChargeHandler

```javascript
export class ValidationChargeHandler extends ChargeHandler {
  handle(charge, service) {
    if (charge.quantity < 0) {
      throw new Error(
        `Отрицательное количество для начисления #${charge.chargeCode}`
      );
    }
    if (service.tariff < 0) {
      throw new Error(`Отрицательный тариф для услуги #${service.serviceCode}`);
    }
    return this._processNext(charge, service);
  }
}
```

**Построчное объяснение:**

1. **`extends ChargeHandler`**

   - Ключевое слово `extends` означает наследование
   - `ValidationChargeHandler` наследует все методы и свойства `ChargeHandler`
   - Может использовать `this._processNext()` из родительского класса

2. **`handle(charge, service) {`**

   - ПЕРЕОПРЕДЕЛЕНИЕ метода из родительского класса
   - Та же сигнатура (имя и параметры), но другая реализация
   - Это ПОЛИМОРФИЗМ: один интерфейс, разная реализация

3. **`if (charge.quantity < 0) { throw ... }`**

   - Валидация данных
   - Если количество отрицательное, выбрасывает ошибку
   - Обработка прерывается

4. **`return this._processNext(charge, service);`**
   - Если валидация прошла, передает обработку следующему обработчику
   - `this._processNext()` - метод из родительского класса
   - Цепочка продолжается

**Как это работает:**

```javascript
// Создание обработчиков
const validation = new ValidationChargeHandler();
const discount = new DiscountChargeHandler(5000, 5);
const standard = new StandardChargeHandler();

// Создание цепочки
validation.setNext(discount).setNext(standard);
// validation -> discount -> standard

// Обработка
const charge = new Charge(1, 1, 1, 10);
const service = new Service(1, "Услуга", 100);

validation.handle(charge, service);
// 1. ValidationChargeHandler.handle() - проверяет данные
// 2. Если ОК, вызывает discount.handle() (через _processNext)
// 3. DiscountChargeHandler.handle() - применяет скидку или передает дальше
// 4. StandardChargeHandler.handle() - вычисляет стоимость
```

---

#### Класс ChargeProcessor (композиция)

```javascript
export class ChargeProcessor {
  #handler;

  constructor() {
    const validation = new ValidationChargeHandler();
    const discount = new DiscountChargeHandler(5000.0, 5.0);
    const standard = new StandardChargeHandler();

    validation.setNext(discount).setNext(standard);
    this.#handler = validation;
  }

  processCharge(charge, service) {
    const result = this.#handler.handle(charge, service);
    if (result === null) {
      throw new Error(`Не удалось обработать начисление`);
    }
    return result;
  }
}
```

**Построчное объяснение:**

1. **`#handler;`**

   - Приватное поле для хранения первого обработчика в цепочке

2. **`constructor() {`**

   - В конструкторе создаются и настраиваются обработчики
   - Демонстрирует КОМПОЗИЦИЮ: класс содержит другие объекты

3. **`const validation = new ValidationChargeHandler();`**

   - Создание объекта (экземпляра класса)
   - `new` - оператор создания объекта
   - Вызывает конструктор класса

4. **`validation.setNext(discount).setNext(standard);`**

   - Цепочка вызовов (Fluent Interface)
   - `validation.setNext(discount)` возвращает `discount`
   - Затем `discount.setNext(standard)` устанавливает следующий

5. **`this.#handler = validation;`**

   - Сохраняет первый обработчик как точку входа

6. **`processCharge(charge, service) {`**

   - Публичный метод для обработки начисления
   - Делегирует работу объекту `#handler`

7. **`const result = this.#handler.handle(charge, service);`**
   - Вызывает метод `handle()` первого обработчика
   - Запускается цепочка обработчиков
   - Полиморфизм: не важно, какой именно обработчик, главное - есть метод `handle()`

**Почему это важно?**

- Демонстрирует КОМПОЗИЦИЮ (Composition over Inheritance)
- Показывает делегирование
- Упрощает использование: не нужно знать детали цепочки

---

### Файл: main.js

#### Функция initDatabase()

```javascript
function initDatabase() {
  const db = new Database();

  // Улицы
  const streets = [
    new Street(1, "Ленина"),
    new Street(2, "Пушкина"),
    new Street(3, "Гагарина"),
  ];
  for (const street of streets) {
    db.addStreet(street);
  }

  return db;
}
```

**Построчное объяснение:**

1. **`function initDatabase() {`**

   - Обычная функция (не метод класса)
   - Создает и заполняет базу данных

2. **`const db = new Database();`**

   - Создание объекта класса Database
   - `new` вызывает конструктор класса
   - `db` - ссылка на созданный объект

3. **`const streets = [ new Street(1, "Ленина"), ... ]`**

   - Массив объектов класса Street
   - Каждый `new Street(...)` создает новый объект

4. **`for (const street of streets) {`**

   - Цикл по массиву объектов
   - `const street` - переменная для текущего элемента

5. **`db.addStreet(street);`**
   - Вызов метода объекта `db`
   - Передача объекта `street` в метод
   - Инкапсуляция: данные добавляются через публичный метод

---

#### Функция createPaymentNotice()

```javascript
function createPaymentNotice(db, accountCode, periodMonth, periodYear) {
  const account = db.getAccount(accountCode);
  if (!account) {
    throw new Error(`Лицевой счет ${accountCode} не найден`);
  }

  const street = db.getStreet(account.streetCode);
  if (!street) {
    throw new Error(`Улица ${account.streetCode} не найдена`);
  }

  const charges = db.getChargesByAccount(accountCode);
  const chargeServicePairs = charges
    .map((charge) => {
      const service = db.getService(charge.serviceCode);
      return service ? [charge, service] : null;
    })
    .filter((pair) => pair !== null);

  return new PaymentNotice(
    account,
    street,
    chargeServicePairs,
    periodMonth,
    periodYear,
    0.0
  );
}
```

**Построчное объяснение:**

1. **`const account = db.getAccount(accountCode);`**

   - Вызов метода объекта `db`
   - Получение объекта `PersonalAccount` по коду

2. **`if (!account) { throw ... }`**

   - Проверка на существование объекта
   - Если не найден, выбрасывает ошибку
   - Защитное программирование

3. **`account.streetCode`**

   - Доступ к свойству объекта
   - Используется для поиска улицы

4. **`const charges = db.getChargesByAccount(accountCode);`**

   - Получение массива начислений
   - Возвращает массив объектов `Charge`

5. **`.map(charge => { ... })`**

   - Метод массива для преобразования элементов
   - Для каждого `charge` находит соответствующий `service`
   - Возвращает пару `[charge, service]` или `null`

6. **`.filter(pair => pair !== null)`**

   - Метод массива для фильтрации
   - Удаляет `null` значения (когда услуга не найдена)

7. **`new PaymentNotice(...)`**
   - Создание объекта класса PaymentNotice
   - Передача всех необходимых параметров

---

## Типичные вопросы экзамена

### Вопрос 1: "Что такое класс в ООП?"

**Ответ:**
Класс - это шаблон (чертеж) для создания объектов. Класс определяет:

- Какие свойства будут у объектов (поля)
- Какие действия могут выполнять объекты (методы)

**Пример из проекта:**

```javascript
class Street {
  constructor(streetCode, name) {
    this.streetCode = streetCode; // Свойство
    this.name = name; // Свойство
  }
}

// Использование класса для создания объектов
const street1 = new Street(1, "Ленина");
const street2 = new Street(2, "Пушкина");
```

**Ключевые моменты:**

- Класс - это определение, объект - это конкретный экземпляр
- `new` - оператор создания объекта
- Один класс может создавать множество объектов

---

### Вопрос 2: "Что такое конструктор класса?"

**Ответ:**
Конструктор - это специальный метод класса, который вызывается при создании объекта через `new`. Конструктор используется для инициализации объекта (установки начальных значений свойств).

**Пример из проекта:**

```javascript
class Service {
  constructor(serviceCode, name, tariff) {
    // Инициализация свойств объекта
    this.serviceCode = serviceCode;
    this.name = name;
    this.tariff = tariff;
  }
}

// При создании объекта автоматически вызывается constructor
const service = new Service(1, "Вода", 45.5);
// Внутри: constructor(1, "Вода", 45.50)
// this.serviceCode = 1
// this.name = "Вода"
// this.tariff = 45.50
```

---

### Вопрос 3: "Объясните принцип инкапсуляции"

**Ответ:**
Инкапсуляция - это объединение данных и методов в одном объекте и скрытие внутренней реализации от внешнего кода.

**Примеры:**

1. **Приватные поля:**

```javascript
class Database {
  #streets = new Map(); // Приватное поле - недоступно извне

  addStreet(street) {
    // Публичный метод - единственный способ доступа
    this.#streets.set(street.streetCode, street);
  }
}

const db = new Database();
db.addStreet(street); // ✅ Работает
db.#streets; // ❌ Ошибка: приватное поле недоступно
```

2. **Методы класса:**

```javascript
class Service {
  constructor(serviceCode, name, tariff) {
    this.tariff = tariff; // Данные
  }

  calculateCost(quantity) {
    // Метод работает с данными
    return this.tariff * quantity;
  }
}

// Логика расчета инкапсулирована внутри класса
const cost = service.calculateCost(10);
```

**Преимущества:**

- Защита данных от неправильного использования
- Упрощение изменения внутренней реализации
- Улучшение читаемости кода

---

### Вопрос 4: "Что такое наследование? Покажите пример"

**Ответ:**
Наследование - это создание нового класса на основе существующего класса. Дочерний класс наследует свойства и методы родительского класса и может их расширять или переопределять.

**Пример из проекта:**

```javascript
// Родительский (базовый) класс
class ChargeHandler {
  #nextHandler = null;

  setNext(handler) {
    this.#nextHandler = handler;
  }

  handle(charge, service) {
    throw new Error("Метод должен быть переопределен");
  }
}

// Дочерний класс (наследуется от ChargeHandler)
class ValidationChargeHandler extends ChargeHandler {
  // Наследует метод setNext() из родительского класса

  // Переопределяет метод handle()
  handle(charge, service) {
    if (charge.quantity < 0) {
      throw new Error("Отрицательное количество");
    }
    return this._processNext(charge, service);
  }
}
```

**Ключевые моменты:**

- `extends` - ключевое слово для наследования
- Дочерний класс может использовать методы родителя
- Дочерний класс может переопределять методы родителя
- Избегаем дублирования кода

---

### Вопрос 5: "Объясните полиморфизм"

**Ответ:**
Полиморфизм - это способность объектов разных классов отвечать на один и тот же метод по-разному. "Один интерфейс, много реализаций".

**Пример из проекта:**

```javascript
// Все три класса имеют метод handle() с одинаковой сигнатурой,
// но реализуют его по-разному

class ValidationChargeHandler extends ChargeHandler {
  handle(charge, service) {
    // Реализация 1: проверка данных
    if (charge.quantity < 0) throw new Error("...");
    return this._processNext(charge, service);
  }
}

class DiscountChargeHandler extends ChargeHandler {
  handle(charge, service) {
    // Реализация 2: применение скидки
    const cost = service.calculateCost(charge.quantity);
    if (cost >= this.discountThreshold) {
      return cost - discount;
    }
    return this._processNext(charge, service);
  }
}

class StandardChargeHandler extends ChargeHandler {
  handle(charge, service) {
    // Реализация 3: стандартный расчет
    return service.calculateCost(charge.quantity);
  }
}

// Полиморфизм в действии:
let handler = new ValidationChargeHandler();
handler.handle(charge, service); // Вызовет реализацию 1

handler = new DiscountChargeHandler();
handler.handle(charge, service); // Вызовет реализацию 2

handler = new StandardChargeHandler();
handler.handle(charge, service); // Вызовет реализацию 3
```

**Преимущества:**

- Можно работать с разными объектами через единый интерфейс
- Легко добавлять новые типы обработчиков
- Код становится более гибким

---

### Вопрос 6: "Что такое абстракция?"

**Ответ:**
Абстракция - это выделение общих характеристик объектов и создание абстрактных описаний, которые определяют ЧТО должно быть, но не КАК это реализовано.

**Пример из проекта:**

```javascript
// Абстрактный класс определяет интерфейс, но не реализацию
class ChargeHandler {
  handle(charge, service) {
    // Абстрактный метод: мы знаем ЧТО он должен делать,
    // но не знаем КАК (реализация в дочерних классах)
    throw new Error("Метод должен быть переопределен");
  }
}

// Конкретные классы реализуют абстракцию
class ValidationChargeHandler extends ChargeHandler {
  handle(charge, service) {
    // Конкретная реализация
    // ...
  }
}
```

**Ключевые моменты:**

- Абстракция скрывает детали реализации
- Позволяет работать на более высоком уровне
- Упрощает понимание и использование

---

### Вопрос 7: "Что такое this в JavaScript?"

**Ответ:**
`this` - это ключевое слово, которое ссылается на текущий объект, в контексте которого выполняется код.

**Примеры:**

1. **В методах класса:**

```javascript
class Service {
  constructor(tariff) {
    this.tariff = tariff; // this ссылается на создаваемый объект
  }

  calculateCost(quantity) {
    // this ссылается на объект, у которого вызван метод
    return this.tariff * quantity;
  }
}

const service = new Service(45.5);
service.calculateCost(10);
// Внутри метода: this = service
// this.tariff = service.tariff = 45.50
```

2. **В конструкторе:**

```javascript
class Street {
  constructor(streetCode, name) {
    // this ссылается на новый объект, который создается
    this.streetCode = streetCode;
    this.name = name;
  }
}

const street = new Street(1, "Ленина");
// Внутри constructor: this = новый объект {}
// this.streetCode = 1
// this.name = "Ленина"
// Возвращается объект { streetCode: 1, name: "Ленина" }
```

**Важно понимать:**

- `this` всегда зависит от контекста вызова
- В методах объекта `this` = объект, у которого вызван метод
- В конструкторе `this` = создаваемый объект

---

### Вопрос 8: "Что такое приватные поля (#)?"

**Ответ:**
Приватные поля - это поля класса, которые доступны только внутри самого класса. В JavaScript они обозначаются символом `#`.

**Пример:**

```javascript
class Database {
  #streets = new Map(); // Приватное поле

  addStreet(street) {
    // Внутри класса можно использовать
    this.#streets.set(street.streetCode, street);
  }

  getStreet(code) {
    // Внутри класса можно использовать
    return this.#streets.get(code);
  }
}

const db = new Database();

// ✅ Можно: через публичные методы
db.addStreet(new Street(1, "Ленина"));

// ❌ Нельзя: прямое обращение к приватному полю
db.#streets; // SyntaxError: Private field '#streets' must be declared
```

**Зачем нужны:**

- Инкапсуляция: скрытие внутренней реализации
- Защита данных от случайного изменения
- Обеспечение контроля доступа к данным

---

### Вопрос 9: "Объясните паттерн Chain of Responsibility"

**Ответ:**
Chain of Responsibility (цепочка ответственности) - это поведенческий паттерн проектирования, который позволяет передавать запрос по цепочке обработчиков. Каждый обработчик может либо обработать запрос, либо передать его следующему обработчику.

**Пример из проекта:**

```javascript
// Создание цепочки обработчиков
const validation = new ValidationChargeHandler(); // 1. Валидация
const discount = new DiscountChargeHandler(5000, 5); // 2. Скидка
const standard = new StandardChargeHandler(); // 3. Стандартный расчет

// Построение цепочки
validation.setNext(discount).setNext(standard);
// validation -> discount -> standard

// Обработка запроса
validation.handle(charge, service);
// 1. ValidationChargeHandler обрабатывает (валидирует)
// 2. Если ОК, передает DiscountChargeHandler
// 3. DiscountChargeHandler проверяет порог скидки
// 4. Если скидка не применима, передает StandardChargeHandler
// 5. StandardChargeHandler вычисляет стандартную стоимость
```

**Преимущества:**

- Разделение ответственности
- Гибкость: легко добавлять/удалять обработчики
- Открыт для расширения, закрыт для изменения

---

### Вопрос 10: "Что такое композиция в ООП?"

**Ответ:**
Композиция - это включение объектов других классов внутрь класса (отношение "имеет" или "содержит"). Альтернатива наследованию.

**Пример из проекта:**

```javascript
class ChargeProcessor {
  #handler; // Композиция: содержит объект ChargeHandler

  constructor() {
    // Создание и настройка объектов других классов
    const validation = new ValidationChargeHandler();
    const discount = new DiscountChargeHandler(5000, 5);
    const standard = new StandardChargeHandler();

    validation.setNext(discount).setNext(standard);
    this.#handler = validation; // Сохранение ссылки на объект
  }

  processCharge(charge, service) {
    // Использование составного объекта
    return this.#handler.handle(charge, service);
  }
}
```

**Композиция vs Наследование:**

- **Наследование**: "является" (ValidationChargeHandler IS-A ChargeHandler)
- **Композиция**: "имеет" (ChargeProcessor HAS-A ChargeHandler)

**Преимущества композиции:**

- Более гибкая архитектура
- Легче изменять поведение во время выполнения
- Избегание проблем множественного наследования

---

## Практические задания для подготовки

### Задание 1: Создать новый класс

Создайте класс `Apartment` (Квартира) со следующими свойствами:

- `apartmentNumber` - номер квартиры
- `area` - площадь
- `residents` - количество жильцов

И методами:

- `getAreaPerPerson()` - возвращает площадь на одного человека

**Решение:**

```javascript
export class Apartment {
  constructor(apartmentNumber, area, residents) {
    this.apartmentNumber = apartmentNumber;
    this.area = area;
    this.residents = residents;
  }

  getAreaPerPerson() {
    if (this.residents === 0) {
      return 0;
    }
    return this.area / this.residents;
  }
}

// Использование
const apt = new Apartment("15", 45.5, 2);
console.log(apt.getAreaPerPerson()); // 22.75
```

---

### Задание 2: Реализовать наследование

Создайте класс `PremiumService` (Премиум услуга), который наследуется от `Service` и:

- Имеет дополнительное свойство `premiumFee` (премиум сбор)
- Переопределяет метод `calculateCost()`, добавляя премиум сбор к стоимости

**Решение:**

```javascript
export class PremiumService extends Service {
  constructor(serviceCode, name, tariff, premiumFee) {
    super(serviceCode, name, tariff); // Вызов конструктора родителя
    this.premiumFee = premiumFee;
  }

  calculateCost(quantity) {
    // Вызываем метод родителя и добавляем премиум сбор
    const baseCost = super.calculateCost(quantity);
    return baseCost + this.premiumFee;
  }
}

// Использование
const premium = new PremiumService(1, "Премиум вода", 45.5, 100);
const cost = premium.calculateCost(10);
// baseCost = 45.50 * 10 = 455
// cost = 455 + 100 = 555
```

---

### Задание 3: Добавить новый обработчик

Создайте класс `TaxChargeHandler`, который применяет налог 20% к стоимости.

**Решение:**

```javascript
export class TaxChargeHandler extends ChargeHandler {
  constructor(taxPercent) {
    super();
    this.taxPercent = taxPercent;
  }

  handle(charge, service) {
    const baseCost = service.calculateCost(charge.quantity);
    const tax = baseCost * (this.taxPercent / 100);
    return baseCost + tax; // Добавляем налог
  }
}

// Использование в цепочке
const taxHandler = new TaxChargeHandler(20);
validation.setNext(discount).setNext(taxHandler).setNext(standard);
```

---

## Чек-лист для экзамена

Перед экзаменом убедитесь, что вы можете:

- [ ] Объяснить, что такое класс и объект
- [ ] Показать, как создать класс и объект
- [ ] Объяснить роль конструктора
- [ ] Показать пример использования `this`
- [ ] Объяснить принцип инкапсуляции с примерами
- [ ] Показать использование приватных полей
- [ ] Объяснить принцип наследования
- [ ] Показать использование `extends` и `super`
- [ ] Объяснить принцип полиморфизма
- [ ] Показать переопределение методов
- [ ] Объяснить принцип абстракции
- [ ] Различить композицию и наследование
- [ ] Объяснить паттерны проектирования (Chain of Responsibility)
- [ ] Написать простой класс с нуля
- [ ] Реализовать наследование для нового класса
- [ ] Добавить новый метод в существующий класс

---

## Заключение

Этот проект демонстрирует все основные концепции ООП:

1. **Классы и объекты** - основа ООП
2. **Инкапсуляция** - приватные поля, публичные методы
3. **Наследование** - иерархия обработчиков
4. **Полиморфизм** - разные реализации одного метода
5. **Абстракция** - абстрактные методы и классы
6. **Композиция** - включение объектов в классы
7. **Паттерны проектирования** - Chain of Responsibility

Изучив этот проект построчно и поняв каждый принцип, вы будете готовы к экзамену по ООП!

**Удачи на экзамене! 🎓**
