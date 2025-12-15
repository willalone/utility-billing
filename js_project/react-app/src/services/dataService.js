/**
 * Сервис для работы с данными
 */

import { Database } from '../lib/database.js';
import { Street, PersonalAccount, Service, Charge, PaymentNotice } from '../lib/models.js';
import { ChargeProcessor } from '../lib/chainOfResponsibility.js';
import { DateTimeHandler } from '../lib/dateTimeUtils.js';

class DataService {
  constructor() {
    this.db = this.initDatabase();
    this.processor = new ChargeProcessor();
  }

  initDatabase() {
    const db = new Database();

    // Улицы
    const streets = [
      new Street(1, "Ленина"),
      new Street(2, "Пушкина"),
      new Street(3, "Гагарина")
    ];
    for (const street of streets) {
      db.addStreet(street);
    }

    // Услуги
    const services = [
      new Service(1, "Холодное водоснабжение", 45.50),
      new Service(2, "Горячее водоснабжение", 180.30),
      new Service(3, "Электроэнергия", 4.65),
      new Service(4, "Отопление", 2200.00),
      new Service(5, "Газоснабжение", 6.40),
    ];
    for (const service of services) {
      db.addService(service);
    }

    // Лицевые счета
    const accounts = [
      new PersonalAccount(1, "ЛС-001", 1, "10", "А", "15", "Иванов Иван Иванович"),
      new PersonalAccount(2, "ЛС-002", 2, "25", null, "42", "Петрова Мария Сергеевна"),
      new PersonalAccount(3, "ЛС-003", 3, "5", "Б", "8", "Сидоров Петр Александрович"),
    ];
    for (const account of accounts) {
      db.addAccount(account);
    }

    // Начисления
    const charges = [
      new Charge(1, 1, 1, 15.5),
      new Charge(2, 1, 2, 12.3),
      new Charge(3, 1, 3, 350.0),
      new Charge(4, 2, 1, 10.0),
      new Charge(5, 2, 3, 280.0),
      new Charge(6, 2, 4, 2.5),
      new Charge(7, 3, 1, 18.0),
      new Charge(8, 3, 2, 14.5),
      new Charge(9, 3, 3, 420.0),
      new Charge(10, 3, 5, 25.0),
    ];
    for (const charge of charges) {
      db.addCharge(charge);
    }

    return db;
  }

  getAllAccounts() {
    const accounts = [];
    for (let i = 1; i <= 3; i++) {
      const account = this.db.getAccount(i);
      if (account) {
        const street = this.db.getStreet(account.streetCode);
        accounts.push({ account, street });
      }
    }
    return accounts;
  }

  getAccountDetails(accountCode) {
    const account = this.db.getAccount(accountCode);
    if (!account) return null;

    const street = this.db.getStreet(account.streetCode);
    const charges = this.db.getChargesByAccount(accountCode);
    const chargeServicePairs = charges
      .map(charge => {
        const service = this.db.getService(charge.serviceCode);
        return service ? { charge, service, cost: service.calculateCost(charge.quantity) } : null;
      })
      .filter(pair => pair !== null);

    return { account, street, charges: chargeServicePairs };
  }

  createPaymentNotice(accountCode) {
    const account = this.db.getAccount(accountCode);
    if (!account) {
      throw new Error(`Лицевой счет ${accountCode} не найден`);
    }

    const street = this.db.getStreet(account.streetCode);
    if (!street) {
      throw new Error(`Улица ${account.streetCode} не найдена`);
    }

    const charges = this.db.getChargesByAccount(accountCode);
    const chargeServicePairs = charges
      .map(charge => {
        const service = this.db.getService(charge.serviceCode);
        return service ? [charge, service] : null;
      })
      .filter(pair => pair !== null);

    if (chargeServicePairs.length === 0) {
      throw new Error(`Начисления для ЛС ${accountCode} не найдены`);
    }

    const today = DateTimeHandler.getCurrentDate();
    const periodMonth = today.getMonth() + 1;
    const periodYear = today.getFullYear();

    const notice = new PaymentNotice(account, street, chargeServicePairs, periodMonth, periodYear, 0.0);
    return this.processor.processNotice(notice);
  }

  getCurrentPeriod() {
    const today = DateTimeHandler.getCurrentDate();
    return {
      month: today.getMonth() + 1,
      year: today.getFullYear(),
      monthName: DateTimeHandler.getMonthName(today.getMonth() + 1),
      formattedDate: DateTimeHandler.formatDate(today)
    };
  }
}

export default new DataService();

