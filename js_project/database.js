/**
 * Модуль для работы с базой данных.
 */

import { Street, PersonalAccount, Service, Charge } from './models.js';

/**
 * Класс База данных.
 * Демонстрирует принцип ИНКАПСУЛЯЦИИ: приватные поля (#) скрывают внутреннюю реализацию,
 * доступ к данным происходит только через публичные методы.
 */
export class Database {
    // Приватные поля - демонстрация инкапсуляции (private fields в JavaScript)
    #streets = new Map();
    #accounts = new Map();
    #services = new Map();
    #charges = new Map();

    constructor() {
        // Конструктор класса - инициализация объекта
        // В данном случае приватные поля уже инициализированы при объявлении
    }

    /**
     * Добавляет улицу.
     * Публичный метод для работы с инкапсулированными данными.
     * @param {Street} street - Улица
     */
    addStreet(street) {
        this.#streets.set(street.streetCode, street);
    }

    /**
     * Получает улицу по коду.
     * @param {number} streetCode - Код улицы
     * @returns {Street|undefined} Улица
     */
    getStreet(streetCode) {
        return this.#streets.get(streetCode);
    }

    /**
     * Добавляет лицевой счет.
     * @param {PersonalAccount} account - Лицевой счет
     */
    addAccount(account) {
        this.#accounts.set(account.accountCode, account);
    }

    /**
     * Получает лицевой счет по коду.
     * @param {number} accountCode - Код счета
     * @returns {PersonalAccount|undefined} Лицевой счет
     */
    getAccount(accountCode) {
        return this.#accounts.get(accountCode);
    }

    /**
     * Добавляет услугу.
     * @param {Service} service - Услуга
     */
    addService(service) {
        this.#services.set(service.serviceCode, service);
    }

    /**
     * Получает услугу по коду.
     * @param {number} serviceCode - Код услуги
     * @returns {Service|undefined} Услуга
     */
    getService(serviceCode) {
        return this.#services.get(serviceCode);
    }

    /**
     * Добавляет начисление.
     * @param {Charge} charge - Начисление
     */
    addCharge(charge) {
        this.#charges.set(charge.chargeCode, charge);
    }

    /**
     * Получает начисления по коду счета.
     * @param {number} accountCode - Код счета
     * @returns {Charge[]} Массив начислений
     */
    getChargesByAccount(accountCode) {
        return Array.from(this.#charges.values())
            .filter(charge => charge.accountCode === accountCode);
    }
}

