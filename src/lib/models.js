export class Street {
  constructor(streetCode, name) {
    this.streetCode = streetCode;
    this.name = name;
  }
}

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

export class PersonalAccount {
  constructor(accountCode, accountNumber, streetCode, house, building, apartment, fullName) {
    this.accountCode = accountCode;
    this.accountNumber = accountNumber;
    this.streetCode = streetCode;
    this.house = house;
    this.building = building;
    this.apartment = apartment;
    this.fullName = fullName;
  }

  getAddress(street = null) {
    const streetName = street ? street.name : `Улица #${this.streetCode}`;
    const buildingStr = this.building ? `, корп. ${this.building}` : "";
    return `${streetName}, д. ${this.house}${buildingStr}, кв. ${this.apartment}`;
  }
}

export class Charge {
  constructor(chargeCode, accountCode, serviceCode, quantity) {
    this.chargeCode = chargeCode;
    this.accountCode = accountCode;
    this.serviceCode = serviceCode;
    this.quantity = quantity;
  }
}

export class PaymentNotice {
  constructor(account, street, charges, periodMonth, periodYear, totalAmount) {
    this.account = account;
    this.street = street;
    this.charges = charges;
    this.periodMonth = periodMonth;
    this.periodYear = periodYear;
    this.totalAmount = totalAmount;
  }
}
