"""Модуль для работы с датой и временем."""

from datetime import date


class DateTimeHandler:
    """Класс для работы с датой и временем."""

    @staticmethod
    def get_current_date() -> date:
        """Возвращает текущую дату."""
        return date.today()

    @staticmethod
    def format_date(d: date, fmt: str = "%d.%m.%Y") -> str:
        """Форматирует дату в строку."""
        return d.strftime(fmt)

    @staticmethod
    def get_month_name(month: int) -> str:
        """Возвращает название месяца на русском языке."""
        months = {
            1: "Январь", 2: "Февраль", 3: "Март", 4: "Апрель",
            5: "Май", 6: "Июнь", 7: "Июль", 8: "Август",
            9: "Сентябрь", 10: "Октябрь", 11: "Ноябрь", 12: "Декабрь"
        }
        return months.get(month, "Неизвестно")


