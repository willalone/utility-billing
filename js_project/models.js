/**
 * Модуль с классами для работы с базой данных.
 */

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

/**
 * Класс Услуга.
 * Демонстрирует инкапсуляцию: данные (свойства) и поведение (методы) объединены в одном классе.
 * Метод calculateCost демонстрирует ПОВЕДЕНИЕ объекта.
 */
export class Service {
    /**
     * Конструктор класса Service.
     * @param {number} serviceCode - Код услуги
     * @param {string} name - Название услуги
     * @param {number} tariff - Тариф
     */
    constructor(serviceCode, name, tariff) {
        this.serviceCode = serviceCode; // Публичные свойства класса
        this.name = name;
        this.tariff = tariff;
    }

    /**
     * Вычисляет стоимость услуги.
     * Метод класса - это функция, связанная с объектом.
     * Демонстрирует инкапсуляцию: метод работает с данными объекта (this.tariff).
     * @param {number} quantity - Количество
     * @returns {number} Стоимость
     */
    calculateCost(quantity) {
        // this.tariff - обращение к свойству объекта через this
        return this.tariff * quantity;
    }
}

/**
 * Класс Лицевой счет.
 * Демонстрирует методы класса: getAddress - это метод, который работает с данными объекта.
 * Методы позволяют инкапсулировать логику работы с данными внутри класса.
 */
export class PersonalAccount {
    /**
     * Конструктор класса PersonalAccount.
     * @param {number} accountCode - Код счета
     * @param {string} accountNumber - Номер счета
     * @param {number} streetCode - Код улицы
     * @param {string} house - Дом
     * @param {string|null} building - Корпус
     * @param {string} apartment - Квартира
     * @param {string} fullName - ФИО
     */
    constructor(accountCode, accountNumber, streetCode, house, building, apartment, fullName) {
        this.accountCode = accountCode;
        this.accountNumber = accountNumber;
        this.streetCode = streetCode;
        this.house = house;
        this.building = building; // Может быть null (нет корпуса)
        this.apartment = apartment;
        this.fullName = fullName;
    }

    /**
     * Возвращает адрес в виде строки.
     * Это пример метода, который инкапсулирует логику форматирования адреса.
     * @param {Street|null} street - Улица (опционально)
     * @returns {string} Адрес
     */
    getAddress(street = null) {
        // Тернарный оператор: если street существует, используем street.name, иначе формируем строку
        const streetName = street ? street.name : `Улица #${this.streetCode}`;
        // Если есть корпус, добавляем его к строке, иначе пустая строка
        const buildingStr = this.building ? `, корп. ${this.building}` : "";
        // Шаблонная строка (template literal) для формирования результата
        return `${streetName}, д. ${this.house}${buildingStr}, кв. ${this.apartment}`;
    }
}

/**
 * Класс Начисление.
 */
export class Charge {
    /**
     * @param {number} chargeCode - Код начисления
     * @param {number} accountCode - Код счета
     * @param {number} serviceCode - Код услуги
     * @param {number} quantity - Количество
     */
    constructor(chargeCode, accountCode, serviceCode, quantity) {
        this.chargeCode = chargeCode;
        this.accountCode = accountCode;
        this.serviceCode = serviceCode;
        this.quantity = quantity;
    }
}

/**
 * Класс Извещение на оплату.
 */
export class PaymentNotice {
    /**
     * @param {PersonalAccount} account - Лицевой счет
     * @param {Street} street - Улица
     * @param {Array<[Charge, Service]>} charges - Массив пар [начисление, услуга]
     * @param {number} periodMonth - Месяц периода
     * @param {number} periodYear - Год периода
     * @param {number} totalAmount - Общая сумма
     */
    constructor(account, street, charges, periodMonth, periodYear, totalAmount) {
        this.account = account;
        this.street = street;
        this.charges = charges;
        this.periodMonth = periodMonth;
        this.periodYear = periodYear;
        this.totalAmount = totalAmount;
    }
}

