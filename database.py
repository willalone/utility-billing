"""Модуль для работы с базой данных."""

from typing import Optional, Dict, List
from models import Street, PersonalAccount, Service, Charge


class Database:
    """База данных."""

    def __init__(self):
        self._streets: Dict[int, Street] = {}
        self._accounts: Dict[int, PersonalAccount] = {}
        self._services: Dict[int, Service] = {}
        self._charges: Dict[int, Charge] = {}

    def add_street(self, street: Street) -> None:
        self._streets[street.street_code] = street

    def get_street(self, street_code: int) -> Optional[Street]:
        return self._streets.get(street_code)

    def add_account(self, account: PersonalAccount) -> None:
        self._accounts[account.account_code] = account

    def get_account(self, account_code: int) -> Optional[PersonalAccount]:
        return self._accounts.get(account_code)

    def add_service(self, service: Service) -> None:
        self._services[service.service_code] = service

    def get_service(self, service_code: int) -> Optional[Service]:
        return self._services.get(service_code)

    def add_charge(self, charge: Charge) -> None:
        self._charges[charge.charge_code] = charge

    def get_charges_by_account(self, account_code: int) -> List[Charge]:
        return [c for c in self._charges.values() if c.account_code == account_code]

