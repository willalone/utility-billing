# Система управления начислениями за коммунальные услуги

Система для работы с базой данных граждан, пользующихся коммунальными услугами, с генерацией извещений на оплату в формате Excel.

## Установка и запуск

```bash
pip install -r requirements.txt
python main.py
```

## Структура проекта

- `main.py` - Главный модуль
- `models.py` - Модели данных (Street, PersonalAccount, Service, Charge, PaymentNotice)
- `database.py` - Класс для работы с базой данных
- `date_time_utils.py` - Утилиты для работы с датой и временем
- `chain_of_responsibility.py` - Паттерн Chain of Responsibility для обработки начислений
- `excel_generator.py` - Генератор Excel-файлов

## Функциональность

1. **Классы для работы с датой и временем** - форматирование дат, получение названий месяцев
2. **Модели данных** - улицы, лицевые счета, услуги, начисления
3. **Паттерн Chain of Responsibility** - цепочка обработчиков:
   - Валидация данных
   - Применение скидки (5% при сумме > 5000 руб.)
   - Стандартный расчет
4. **Генерация Excel-файлов** - автоматическое создание извещений на оплату

## Контекстная диаграмма

См. файл `context_diagram.txt`

## Пример использования

```python
from database import Database
from main import init_database, create_payment_notice
from chain_of_responsibility import ChargeProcessor
from excel_generator import ExcelGenerator
from datetime import date

db = init_database()
processor = ChargeProcessor()
excel_gen = ExcelGenerator()

today = date.today()
notice = create_payment_notice(db, account_code=1, period_month=today.month, period_year=today.year)
notice = processor.process_notice(notice)
excel_gen.generate_payment_notice(notice, "извещение.xlsx")
```
