/**
 * Модуль для работы с базой данных.
 */

import { Street, PersonalAccount, Service, Charge } from './models.js';

/**
 * Класс База данных.
 */
export class Database {
    constructor() {
        /** @type {Map<number, Street>} */
        this._streets = new Map();
        
        /** @type {Map<number, PersonalAccount>} */
        this._accounts = new Map();
        
        /** @type {Map<number, Service>} */
        this._services = new Map();
        
        /** @type {Map<number, Charge>} */
        this._charges = new Map();
    }

    /**
     * Добавляет улицу.
     * @param {Street} street - Улица
     */
    addStreet(street) {
        this._streets.set(street.streetCode, street);
    }

    /**
     * Получает улицу по коду.
     * @param {number} streetCode - Код улицы
     * @returns {Street|undefined} Улица
     */
    getStreet(streetCode) {
        return this._streets.get(streetCode);
    }

    /**
     * Добавляет лицевой счет.
     * @param {PersonalAccount} account - Лицевой счет
     */
    addAccount(account) {
        this._accounts.set(account.accountCode, account);
    }

    /**
     * Получает лицевой счет по коду.
     * @param {number} accountCode - Код счета
     * @returns {PersonalAccount|undefined} Лицевой счет
     */
    getAccount(accountCode) {
        return this._accounts.get(accountCode);
    }

    /**
     * Добавляет услугу.
     * @param {Service} service - Услуга
     */
    addService(service) {
        this._services.set(service.serviceCode, service);
    }

    /**
     * Получает услугу по коду.
     * @param {number} serviceCode - Код услуги
     * @returns {Service|undefined} Услуга
     */
    getService(serviceCode) {
        return this._services.get(serviceCode);
    }

    /**
     * Добавляет начисление.
     * @param {Charge} charge - Начисление
     */
    addCharge(charge) {
        this._charges.set(charge.chargeCode, charge);
    }

    /**
     * Получает начисления по коду счета.
     * @param {number} accountCode - Код счета
     * @returns {Charge[]} Массив начислений
     */
    getChargesByAccount(accountCode) {
        return Array.from(this._charges.values())
            .filter(charge => charge.accountCode === accountCode);
    }
}

