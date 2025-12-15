"""Паттерн Chain of Responsibility для обработки начислений."""

from abc import ABC, abstractmethod
from typing import Optional
from models import Charge, Service, PaymentNotice


class ChargeHandler(ABC):
    """Абстрактный обработчик начислений."""

    def __init__(self):
        self._next_handler: Optional['ChargeHandler'] = None

    def set_next(self, handler: 'ChargeHandler') -> 'ChargeHandler':
        self._next_handler = handler
        return handler

    @abstractmethod
    def handle(self, charge: Charge, service: Service) -> Optional[float]:
        pass

    def _process_next(self, charge: Charge, service: Service) -> Optional[float]:
        if self._next_handler:
            return self._next_handler.handle(charge, service)
        return None


class ValidationChargeHandler(ChargeHandler):
    """Валидация данных."""

    def handle(self, charge: Charge, service: Service) -> Optional[float]:
        if charge.quantity < 0:
            raise ValueError(f"Отрицательное количество для начисления #{charge.charge_code}")
        if service.tariff < 0:
            raise ValueError(f"Отрицательный тариф для услуги #{service.service_code}")
        return self._process_next(charge, service)


class DiscountChargeHandler(ChargeHandler):
    """Применение скидки."""

    def __init__(self, discount_threshold: float, discount_percent: float):
        super().__init__()
        self.discount_threshold = discount_threshold
        self.discount_percent = discount_percent

    def handle(self, charge: Charge, service: Service) -> Optional[float]:
        base_cost = service.calculate_cost(charge.quantity)
        if base_cost >= self.discount_threshold:
            discount = base_cost * (self.discount_percent / 100)
            return base_cost - discount
        return self._process_next(charge, service)


class StandardChargeHandler(ChargeHandler):
    """Стандартный расчет."""

    def handle(self, charge: Charge, service: Service) -> Optional[float]:
        return service.calculate_cost(charge.quantity)


class ChargeProcessor:
    """Процессор начислений."""

    def __init__(self):
        validation = ValidationChargeHandler()
        discount = DiscountChargeHandler(discount_threshold=5000.0, discount_percent=5.0)
        standard = StandardChargeHandler()
        validation.set_next(discount).set_next(standard)
        self._handler = validation

    def process_charge(self, charge: Charge, service: Service) -> float:
        result = self._handler.handle(charge, service)
        if result is None:
            raise ValueError(f"Не удалось обработать начисление #{charge.charge_code}")
        return result

    def process_notice(self, notice: PaymentNotice) -> PaymentNotice:
        total_amount = 0.0
        for charge, service in notice.charges:
            total_amount += self.process_charge(charge, service)
        notice.total_amount = total_amount
        return notice

