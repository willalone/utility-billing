/**
 * Главный модуль программы.
 */

import { Database } from './database.js';
import { Street, PersonalAccount, Service, Charge, PaymentNotice } from './models.js';
import { ChargeProcessor } from './chainOfResponsibility.js';
import { ExcelGenerator } from './excelGenerator.js';
import { DateTimeHandler } from './dateTimeUtils.js';

/**
 * Инициализирует базу данных тестовыми данными.
 * @returns {Database} База данных
 */
function initDatabase() {
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

/**
 * Создает извещение на оплату.
 * @param {Database} db - База данных
 * @param {number} accountCode - Код счета
 * @param {number} periodMonth - Месяц периода
 * @param {number} periodYear - Год периода
 * @returns {PaymentNotice} Извещение на оплату
 */
function createPaymentNotice(db, accountCode, periodMonth, periodYear) {
    const account = db.getAccount(accountCode);
    if (!account) {
        throw new Error(`Лицевой счет ${accountCode} не найден`);
    }

    const street = db.getStreet(account.streetCode);
    if (!street) {
        throw new Error(`Улица ${account.streetCode} не найдена`);
    }

    const charges = db.getChargesByAccount(accountCode);
    const chargeServicePairs = charges
        .map(charge => {
            const service = db.getService(charge.serviceCode);
            return service ? [charge, service] : null;
        })
        .filter(pair => pair !== null);

    if (chargeServicePairs.length === 0) {
        throw new Error(`Начисления для ЛС ${accountCode} не найдены`);
    }

    return new PaymentNotice(account, street, chargeServicePairs, periodMonth, periodYear, 0.0);
}

/**
 * Главная функция.
 */
async function main() {
    console.log("Генерация извещений на оплату\n" + "=".repeat(40));

    const db = initDatabase();
    const processor = new ChargeProcessor();
    const excelGen = new ExcelGenerator();

    const today = DateTimeHandler.getCurrentDate();
    const periodMonth = today.getMonth() + 1;
    const periodYear = today.getFullYear();

    // Создание извещений для всех счетов
    for (const accountCode of [1, 2, 3]) {
        try {
            let notice = createPaymentNotice(db, accountCode, periodMonth, periodYear);
            notice = processor.processNotice(notice);
            const filePath = `извещение_ЛС_${notice.account.accountNumber}.xlsx`;
            await excelGen.generatePaymentNotice(notice, filePath);
            console.log(`✓ ЛС ${notice.account.accountNumber}: ${notice.totalAmount.toFixed(2)} руб. → ${filePath}`);
        } catch (error) {
            console.log(`✗ Ошибка для ЛС ${accountCode}: ${error.message}`);
        }
    }

    console.log("\n" + "=".repeat(40));
    console.log("Готово!");
}

// Запуск программы
main().catch(error => {
    console.error("Критическая ошибка:", error);
    process.exit(1);
});

