/**
 * Паттерн Chain of Responsibility для обработки начислений.
 */

import { Charge, Service, PaymentNotice } from './models.js';

/**
 * Абстрактный обработчик начислений.
 */
export class ChargeHandler {
    constructor() {
        /** @type {ChargeHandler|null} */
        this._nextHandler = null;
    }

    /**
     * Устанавливает следующий обработчик в цепочке.
     * @param {ChargeHandler} handler - Следующий обработчик
     * @returns {ChargeHandler} Следующий обработчик (для цепочки вызовов)
     */
    setNext(handler) {
        this._nextHandler = handler;
        return handler;
    }

    /**
     * Обрабатывает начисление.
     * @param {Charge} charge - Начисление
     * @param {Service} service - Услуга
     * @returns {number|null} Результат обработки или null
     */
    handle(charge, service) {
        throw new Error("Метод handle должен быть переопределен");
    }

    /**
     * Передает обработку следующему обработчику в цепочке.
     * @param {Charge} charge - Начисление
     * @param {Service} service - Услуга
     * @returns {number|null} Результат обработки или null
     */
    _processNext(charge, service) {
        if (this._nextHandler) {
            return this._nextHandler.handle(charge, service);
        }
        return null;
    }
}

/**
 * Обработчик валидации данных.
 */
export class ValidationChargeHandler extends ChargeHandler {
    /**
     * Валидирует данные начисления.
     * @param {Charge} charge - Начисление
     * @param {Service} service - Услуга
     * @returns {number|null} Результат обработки
     */
    handle(charge, service) {
        if (charge.quantity < 0) {
            throw new Error(`Отрицательное количество для начисления #${charge.chargeCode}`);
        }
        if (service.tariff < 0) {
            throw new Error(`Отрицательный тариф для услуги #${service.serviceCode}`);
        }
        return this._processNext(charge, service);
    }
}

/**
 * Обработчик применения скидки.
 */
export class DiscountChargeHandler extends ChargeHandler {
    /**
     * @param {number} discountThreshold - Порог для применения скидки
     * @param {number} discountPercent - Процент скидки
     */
    constructor(discountThreshold, discountPercent) {
        super();
        this.discountThreshold = discountThreshold;
        this.discountPercent = discountPercent;
    }

    /**
     * Применяет скидку, если сумма превышает порог.
     * @param {Charge} charge - Начисление
     * @param {Service} service - Услуга
     * @returns {number|null} Результат обработки
     */
    handle(charge, service) {
        const baseCost = service.calculateCost(charge.quantity);
        if (baseCost >= this.discountThreshold) {
            const discount = baseCost * (this.discountPercent / 100);
            return baseCost - discount;
        }
        return this._processNext(charge, service);
    }
}

/**
 * Обработчик стандартного расчета.
 */
export class StandardChargeHandler extends ChargeHandler {
    /**
     * Выполняет стандартный расчет стоимости.
     * @param {Charge} charge - Начисление
     * @param {Service} service - Услуга
     * @returns {number} Стоимость
     */
    handle(charge, service) {
        return service.calculateCost(charge.quantity);
    }
}

/**
 * Процессор начислений.
 */
export class ChargeProcessor {
    constructor() {
        const validation = new ValidationChargeHandler();
        const discount = new DiscountChargeHandler(5000.0, 5.0);
        const standard = new StandardChargeHandler();
        
        validation.setNext(discount).setNext(standard);
        this._handler = validation;
    }

    /**
     * Обрабатывает одно начисление.
     * @param {Charge} charge - Начисление
     * @param {Service} service - Услуга
     * @returns {number} Стоимость
     */
    processCharge(charge, service) {
        const result = this._handler.handle(charge, service);
        if (result === null) {
            throw new Error(`Не удалось обработать начисление #${charge.chargeCode}`);
        }
        return result;
    }

    /**
     * Обрабатывает извещение на оплату.
     * @param {PaymentNotice} notice - Извещение на оплату
     * @returns {PaymentNotice} Обработанное извещение
     */
    processNotice(notice) {
        let totalAmount = 0.0;
        for (const [charge, service] of notice.charges) {
            totalAmount += this.processCharge(charge, service);
        }
        notice.totalAmount = totalAmount;
        return notice;
    }
}

