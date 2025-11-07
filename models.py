"""Модуль с классами для работы с базой данных."""

from dataclasses import dataclass
from typing import Optional, List, Tuple


@dataclass
class Street:
    """Улица."""
    street_code: int
    name: str


@dataclass
class Service:
    """Услуга."""
    service_code: int
    name: str
    tariff: float

    def calculate_cost(self, quantity: float) -> float:
        """Вычисляет стоимость услуги."""
        return self.tariff * quantity


@dataclass
class PersonalAccount:
    """Лицевой счет."""
    account_code: int
    account_number: str
    street_code: int
    house: str
    building: Optional[str]
    apartment: str
    full_name: str

    def get_address(self, street: Optional[Street] = None) -> str:
        """Возвращает адрес."""
        street_name = street.name if street else f"Улица #{self.street_code}"
        building_str = f", корп. {self.building}" if self.building else ""
        return f"{street_name}, д. {self.house}{building_str}, кв. {self.apartment}"


@dataclass
class Charge:
    """Начисление."""
    charge_code: int
    account_code: int
    service_code: int
    quantity: float


@dataclass
class PaymentNotice:
    """Извещение на оплату."""
    account: PersonalAccount
    street: Street
    charges: List[Tuple[Charge, Service]]
    period_month: int
    period_year: int
    total_amount: float

