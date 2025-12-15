import { Street, PersonalAccount, Service, Charge } from './models.js';

export class Database {
  #streets = new Map();
  #accounts = new Map();
  #services = new Map();
  #charges = new Map();

  addStreet(street) {
    this.#streets.set(street.streetCode, street);
  }

  getStreet(streetCode) {
    return this.#streets.get(streetCode);
  }

  addAccount(account) {
    this.#accounts.set(account.accountCode, account);
  }

  getAccount(accountCode) {
    return this.#accounts.get(accountCode);
  }

  addService(service) {
    this.#services.set(service.serviceCode, service);
  }

  getService(serviceCode) {
    return this.#services.get(serviceCode);
  }

  addCharge(charge) {
    this.#charges.set(charge.chargeCode, charge);
  }

  getChargesByAccount(accountCode) {
    return Array.from(this.#charges.values())
      .filter(charge => charge.accountCode === accountCode);
  }
}
