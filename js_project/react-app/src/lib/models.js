/**
 * Модуль с классами для работы с базой данных.
 */

/**
 * Класс Улица.
 */
export class Street {
    /**
     * @param {number} streetCode - Код улицы
     * @param {string} name - Название улицы
     */
    constructor(streetCode, name) {
        this.streetCode = streetCode;
        this.name = name;
    }
}

/**
 * Класс Услуга.
 */
export class Service {
    /**
     * @param {number} serviceCode - Код услуги
     * @param {string} name - Название услуги
     * @param {number} tariff - Тариф
     */
    constructor(serviceCode, name, tariff) {
        this.serviceCode = serviceCode;
        this.name = name;
        this.tariff = tariff;
    }

    /**
     * Вычисляет стоимость услуги.
     * @param {number} quantity - Количество
     * @returns {number} Стоимость
     */
    calculateCost(quantity) {
        return this.tariff * quantity;
    }
}

/**
 * Класс Лицевой счет.
 */
export class PersonalAccount {
    /**
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
        this.building = building;
        this.apartment = apartment;
        this.fullName = fullName;
    }

    /**
     * Возвращает адрес.
     * @param {Street|null} street - Улица (опционально)
     * @returns {string} Адрес
     */
    getAddress(street = null) {
        const streetName = street ? street.name : `Улица #${this.streetCode}`;
        const buildingStr = this.building ? `, корп. ${this.building}` : "";
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

