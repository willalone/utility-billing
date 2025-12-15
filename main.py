"""Главный модуль программы."""

from datetime import date
from database import Database
from models import Street, PersonalAccount, Service, Charge, PaymentNotice
from chain_of_responsibility import ChargeProcessor
from excel_generator import ExcelGenerator


def init_database() -> Database:
    """Инициализирует базу данных тестовыми данными."""
    db = Database()

    # Улицы
    for street in [Street(1, "Ленина"), Street(2, "Пушкина"), Street(3, "Гагарина")]:
        db.add_street(street)

    # Услуги
    services = [
        Service(1, "Холодное водоснабжение", 45.50),
        Service(2, "Горячее водоснабжение", 180.30),
        Service(3, "Электроэнергия", 4.65),
        Service(4, "Отопление", 2200.00),
        Service(5, "Газоснабжение", 6.40),
    ]
    for service in services:
        db.add_service(service)

    # Лицевые счета
    accounts = [
        PersonalAccount(1, "ЛС-001", 1, "10", "А", "15", "Иванов Иван Иванович"),
        PersonalAccount(2, "ЛС-002", 2, "25", None, "42", "Петрова Мария Сергеевна"),
        PersonalAccount(3, "ЛС-003", 3, "5", "Б", "8", "Сидоров Петр Александрович"),
    ]
    for account in accounts:
        db.add_account(account)

    # Начисления
    charges = [
        Charge(1, 1, 1, 15.5), Charge(2, 1, 2, 12.3), Charge(3, 1, 3, 350.0),
        Charge(4, 2, 1, 10.0), Charge(5, 2, 3, 280.0), Charge(6, 2, 4, 2.5),
        Charge(7, 3, 1, 18.0), Charge(8, 3, 2, 14.5), Charge(9, 3, 3, 420.0),
        Charge(10, 3, 5, 25.0),
    ]
    for charge in charges:
        db.add_charge(charge)

    return db


def create_payment_notice(db: Database, account_code: int, period_month: int, period_year: int) -> PaymentNotice:
    """Создает извещение на оплату."""
    account = db.get_account(account_code)
    if not account:
        raise ValueError(f"Лицевой счет {account_code} не найден")

    street = db.get_street(account.street_code)
    if not street:
        raise ValueError(f"Улица {account.street_code} не найдена")

    charges = db.get_charges_by_account(account_code)
    charge_service_pairs = [(c, db.get_service(c.service_code)) for c in charges if db.get_service(c.service_code)]

    if not charge_service_pairs:
        raise ValueError(f"Начисления для ЛС {account_code} не найдены")

    return PaymentNotice(account, street, charge_service_pairs, period_month, period_year, 0.0)


def main():
    """Главная функция."""
    print("Генерация извещений на оплату\n" + "=" * 40)

    db = init_database()
    processor = ChargeProcessor()
    excel_gen = ExcelGenerator()

    today = date.today()
    period_month, period_year = today.month, today.year

    # Создание извещений для всех счетов
    for account_code in [1, 2, 3]:
        try:
            notice = create_payment_notice(db, account_code, period_month, period_year)
            notice = processor.process_notice(notice)
            file_path = f"извещение_ЛС_{notice.account.account_number}.xlsx"
            excel_gen.generate_payment_notice(notice, file_path)
            print(f"✓ ЛС {notice.account.account_number}: {notice.total_amount:.2f} руб. → {file_path}")
        except ValueError as e:
            print(f"✗ Ошибка для ЛС {account_code}: {e}")

    print("\n" + "=" * 40)
    print("Готово!")


if __name__ == "__main__":
    main()

