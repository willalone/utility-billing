import { Charge, Service, PaymentNotice } from './models.js';

export class ChargeHandler {
  #nextHandler = null;

  setNext(handler) {
    this.#nextHandler = handler;
    return handler;
  }

  handle(charge, service) {
    throw new Error("Метод handle должен быть переопределен в дочернем классе");
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

export class ValidationChargeHandler extends ChargeHandler {
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

export class DiscountChargeHandler extends ChargeHandler {
  constructor(discountThreshold, discountPercent) {
    super();
    this.discountThreshold = discountThreshold;
    this.discountPercent = discountPercent;
  }

  handle(charge, service) {
    const baseCost = service.calculateCost(charge.quantity);
    if (baseCost >= this.discountThreshold) {
      const discount = baseCost * (this.discountPercent / 100);
      return baseCost - discount;
    }
    return this._processNext(charge, service);
  }
}

export class StandardChargeHandler extends ChargeHandler {
  handle(charge, service) {
    return service.calculateCost(charge.quantity);
  }
}

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
      throw new Error(`Не удалось обработать начисление #${charge.chargeCode}`);
    }
    return result;
  }

  processNotice(notice) {
    let totalAmount = 0.0;
    for (const [charge, service] of notice.charges) {
      totalAmount += this.processCharge(charge, service);
    }
    notice.totalAmount = totalAmount;
    return notice;
  }
}
