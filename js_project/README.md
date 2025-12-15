# Система управления начислениями за коммунальные услуги (JavaScript)

Система для работы с базой данных граждан, пользующихся коммунальными услугами, с генерацией извещений на оплату в формате Excel.

## Установка и запуск

### Консольная версия

```bash
# Установка зависимостей
npm install

# Запуск программы
npm start
# или
node main.js
```

### React интерфейс

```bash
# Перейти в папку react-app
cd react-app

# Установить зависимости
npm install

# Запустить dev-сервер
npm run dev
```

Приложение будет доступно по адресу `http://localhost:3000`

## Структура проекта

### Основные модули

- `main.js` - Главный модуль (консольная версия)
- `models.js` - Модели данных (Street, PersonalAccount, Service, Charge, PaymentNotice)
- `database.js` - Класс для работы с базой данных
- `dateTimeUtils.js` - Утилиты для работы с датой и временем
- `chainOfResponsibility.js` - Паттерн Chain of Responsibility для обработки начислений
- `excelGenerator.js` - Генератор Excel-файлов
- `package.json` - Конфигурация проекта и зависимости

### React интерфейс

- `react-app/` - React приложение с современным веб-интерфейсом
  - `src/components/` - React компоненты (Dashboard, AccountDetails)
  - `src/services/` - Сервисы для работы с данными и Excel
  - Подробнее см. `react-app/README.md`

## Функциональность

### 1. Классы для работы с датой и временем

Класс `DateTimeHandler` предоставляет методы для:

- Получения текущей даты
- Форматирования дат в различные форматы
- Получения названий месяцев на русском языке

### 2. Модели данных

Реализованы следующие классы:

- **Street** - Улица (код, название)
- **PersonalAccount** - Лицевой счет (код, номер, адрес, ФИО)
- **Service** - Услуга (код, название, тариф)
- **Charge** - Начисление (код, код счета, код услуги, количество)
- **PaymentNotice** - Извещение на оплату

### 3. База данных

Класс `Database` реализует хранение и поиск данных:

- Улицы
- Лицевые счета
- Услуги
- Начисления

### 4. Паттерн Chain of Responsibility

Реализована цепочка обработчиков начислений:

- **ValidationChargeHandler** - Валидация данных (проверка на отрицательные значения)
- **DiscountChargeHandler** - Применение скидки (5% при сумме > 5000 руб.)
- **StandardChargeHandler** - Стандартный расчет стоимости

### 5. Генерация Excel-файлов

Класс `ExcelGenerator` создает красиво оформленные Excel-файлы с извещениями на оплату, включающие:

- Заголовок
- Информацию о лицевом счете
- Таблицу начислений
- Итоговую сумму к оплате

## Пример использования

```javascript
import { Database } from "./database.js";
import { Street, PersonalAccount, Service, Charge } from "./models.js";
import { ChargeProcessor } from "./chainOfResponsibility.js";
import { ExcelGenerator } from "./excelGenerator.js";
import { DateTimeHandler } from "./dateTimeUtils.js";

// Инициализация базы данных
const db = new Database();
// ... добавление данных ...

// Создание процессора начислений
const processor = new ChargeProcessor();

// Создание генератора Excel
const excelGen = new ExcelGenerator();

// Получение текущей даты
const today = DateTimeHandler.getCurrentDate();
const periodMonth = today.getMonth() + 1;
const periodYear = today.getFullYear();

// Создание и обработка извещения
const notice = createPaymentNotice(
  db,
  (accountCode = 1),
  periodMonth,
  periodYear
);
const processedNotice = processor.processNotice(notice);
await excelGen.generatePaymentNotice(processedNotice, "извещение.xlsx");
```

## Особенности реализации

1. **ООП подход**: Все компоненты реализованы как классы с инкапсуляцией и полиморфизмом
2. **ES6 модули**: Использование современного синтаксиса import/export
3. **Паттерн Chain of Responsibility**: Демонстрация поведенческого паттерна проектирования
4. **Работа с Excel**: Использование библиотеки ExcelJS для генерации файлов

## Зависимости

- **exceljs** (^4.4.0) - Библиотека для работы с Excel файлами

## Контекстная диаграмма

Система поддерживает три типа пользователей:

- **Абонент** - просматривает свои начисления
- **Бухгалтер** - формирует извещения на оплату
- **Руководитель** - анализирует общую статистику
