/**
 * Паттерн Chain of Responsibility для обработки начислений.
 */

import { Charge, Service, PaymentNotice } from './models.js';

/**
 * Абстрактный базовый класс обработчика начислений.
 * 
 * Демонстрирует принципы ООП:
 * 1. НАСЛЕДОВАНИЕ - этот класс будет базовым для других обработчиков
 * 2. АБСТРАКЦИЯ - метод handle не реализован, должен быть переопределен в дочерних классах
 * 3. ИНКАПСУЛЯЦИЯ - приватное поле #nextHandler скрывает детали реализации цепочки
 * 4. ПОЛИМОРФИЗМ - разные наследники реализуют handle по-разному
 * 
 * Паттерн Chain of Responsibility: каждый обработчик может либо обработать запрос,
 * либо передать его следующему обработчику в цепочке.
 */
export class ChargeHandler {
    // Приватное поле для следующего обработчика в цепочке
    #nextHandler = null;

    constructor() {
        // Конструктор базового класса
        // Может быть пустым или содержать общую инициализацию
    }

    /**
     * Устанавливает следующий обработчик в цепочке.
     * Демонстрирует паттерн Fluent Interface (возвращает handler для цепочки вызовов).
     * @param {ChargeHandler} handler - Следующий обработчик
     * @returns {ChargeHandler} Следующий обработчик (для цепочки вызовов)
     */
    setNext(handler) {
        this.#nextHandler = handler;
        return handler; // Возвращаем handler для возможности цепочки: obj.setNext(a).setNext(b)
    }

    /**
     * Обрабатывает начисление.
     * АБСТРАКТНЫЙ МЕТОД - должен быть переопределен в дочерних классах.
     * Демонстрирует абстракцию: мы знаем ЧТО должен делать метод, но не знаем КАК.
     * @param {Charge} charge - Начисление
     * @param {Service} service - Услуга
     * @returns {number|null} Результат обработки или null
     * @throws {Error} Если метод не переопределен
     */
    handle(charge, service) {
        // Абстрактный метод выбрасывает ошибку, если не переопределен
        // В языках с поддержкой абстрактных классов это было бы abstract method
        throw new Error("Метод handle должен быть переопределен в дочернем классе");
    }

    /**
     * Передает обработку следующему обработчику в цепочке.
     * Приватный метод - используется внутри класса (инкапсуляция).
     * Демонстрирует паттерн Chain of Responsibility: передача запроса по цепочке.
     * @param {Charge} charge - Начисление
     * @param {Service} service - Услуга
     * @returns {number|null} Результат обработки или null
     */
    #processNext(charge, service) {
        // Проверяем, есть ли следующий обработчик в цепочке
        if (this.#nextHandler) {
            // Рекурсивный вызов метода handle следующего обработчика (полиморфизм)
            return this.#nextHandler.handle(charge, service);
        }
        // Если следующего обработчика нет, возвращаем null
        return null;
    }

    /**
     * Публичный метод для доступа к #processNext из дочерних классов.
     * В JavaScript приватные методы не доступны в наследниках,
     * поэтому нужен protected метод (через соглашение именования или публичный метод).
     */
    _processNext(charge, service) {
        return this.#processNext(charge, service);
    }
}

/**
 * Обработчик валидации данных.
 * 
 * Демонстрирует НАСЛЕДОВАНИЕ: extends ChargeHandler означает, что этот класс наследует
 * все свойства и методы базового класса.
 * 
 * Демонстрирует ПОЛИМОРФИЗМ: переопределяет метод handle(), реализуя свою логику,
 * но сохраняя тот же интерфейс (сигнатуру метода).
 */
export class ValidationChargeHandler extends ChargeHandler {
    // Ключевое слово extends означает наследование от ChargeHandler
    
    /**
     * Валидирует данные начисления.
     * ПЕРЕОПРЕДЕЛЕНИЕ МЕТОДА (method overriding) - демонстрирует полиморфизм.
     * Каждый обработчик реализует handle() по-своему, но все они имеют одинаковую сигнатуру.
     * @param {Charge} charge - Начисление
     * @param {Service} service - Услуга
     * @returns {number|null} Результат обработки
     * @throws {Error} Если данные невалидны
     */
    handle(charge, service) {
        // Валидация: проверяем, что количество не отрицательное
        if (charge.quantity < 0) {
            throw new Error(`Отрицательное количество для начисления #${charge.chargeCode}`);
        }
        // Валидация: проверяем, что тариф не отрицательный
        if (service.tariff < 0) {
            throw new Error(`Отрицательный тариф для услуги #${service.serviceCode}`);
        }
        // Если валидация прошла, передаем обработку следующему обработчику в цепочке
        // this._processNext - вызов метода родительского класса (через соглашение именования)
        return this._processNext(charge, service);
    }
}

/**
 * Обработчик применения скидки.
 * 
 * Демонстрирует НАСЛЕДОВАНИЕ с параметризацией: конструктор принимает параметры
 * для настройки поведения обработчика.
 * 
 * Демонстрирует ПОЛИМОРФИЗМ: свой вариант реализации метода handle().
 */
export class DiscountChargeHandler extends ChargeHandler {
    // Свойства класса для хранения параметров скидки
    discountThreshold;
    discountPercent;

    /**
     * Конструктор класса DiscountChargeHandler.
     * super() - вызов конструктора родительского класса (обязателен при наследовании).
     * @param {number} discountThreshold - Порог для применения скидки
     * @param {number} discountPercent - Процент скидки
     */
    constructor(discountThreshold, discountPercent) {
        super(); // Вызов конструктора базового класса ChargeHandler
        this.discountThreshold = discountThreshold; // Устанавливаем порог скидки
        this.discountPercent = discountPercent; // Устанавливаем процент скидки
    }

    /**
     * Применяет скидку, если сумма превышает порог.
     * Демонстрирует условную логику в полиморфном методе.
     * @param {Charge} charge - Начисление
     * @param {Service} service - Услуга
     * @returns {number|null} Результат обработки
     */
    handle(charge, service) {
        // Вычисляем базовую стоимость, используя метод объекта service (инкапсуляция)
        const baseCost = service.calculateCost(charge.quantity);
        
        // Если базовая стоимость >= порога, применяем скидку
        if (baseCost >= this.discountThreshold) {
            // Вычисляем размер скидки
            const discount = baseCost * (this.discountPercent / 100);
            // Возвращаем стоимость со скидкой (обработка завершена, не передаем дальше)
            return baseCost - discount;
        }
        
        // Если условие не выполнилось, передаем обработку следующему обработчику
        return this._processNext(charge, service);
    }
}

/**
 * Обработчик стандартного расчета.
 * 
 * Демонстрирует НАСЛЕДОВАНИЕ и ПОЛИМОРФИЗМ: последний обработчик в цепочке,
 * который всегда выполняет стандартный расчет (не передает дальше).
 * 
 * Это пример терминального обработчика - он не вызывает _processNext(),
 * так как является последним звеном в цепочке ответственности.
 */
export class StandardChargeHandler extends ChargeHandler {
    /**
     * Выполняет стандартный расчет стоимости.
     * ПОЛИМОРФИЗМ: своя реализация метода handle().
     * Этот обработчик всегда завершает цепочку (не вызывает _processNext()).
     * @param {Charge} charge - Начисление
     * @param {Service} service - Услуга
     * @returns {number} Стоимость (всегда возвращает число, не null)
     */
    handle(charge, service) {
        // Вызываем метод объекта service для вычисления стоимости
        // Используем инкапсуляцию: логика расчета инкапсулирована в методе calculateCost
        return service.calculateCost(charge.quantity);
    }
}

/**
 * Процессор начислений.
 * 
 * Демонстрирует КОМПОЗИЦИЮ (Composition over Inheritance): класс содержит и использует
 * другие объекты (обработчики), но не наследуется от них.
 * 
 * Демонстрирует паттерн Chain of Responsibility: создает и настраивает цепочку обработчиков.
 * 
 * Демонстрирует ИНКАПСУЛЯЦИЮ: скрывает детали создания и работы цепочки обработчиков,
 * предоставляя простой интерфейс (processCharge, processNotice).
 */
export class ChargeProcessor {
    // Приватное поле для хранения первого обработчика в цепочке
    #handler;

    constructor() {
        // СОЗДАНИЕ ОБЪЕКТОВ (экземпляров классов)
        // Каждый обработчик - это объект, созданный через new
        
        // 1. Создаем обработчик валидации (проверяет данные)
        const validation = new ValidationChargeHandler();
        
        // 2. Создаем обработчик скидок с параметрами: порог 5000 руб., скидка 5%
        const discount = new DiscountChargeHandler(5000.0, 5.0);
        
        // 3. Создаем стандартный обработчик (последний в цепочке)
        const standard = new StandardChargeHandler();
        
        // СОЗДАНИЕ ЦЕПОЧКИ ОБРАБОТЧИКОВ (Chain of Responsibility)
        // Fluent Interface: метод setNext() возвращает handler, что позволяет цепочку вызовов
        validation.setNext(discount).setNext(standard);
        // validation -> discount -> standard (порядок обработки)
        
        // Сохраняем первый обработчик как точку входа в цепочку
        this.#handler = validation;
    }

    /**
     * Обрабатывает одно начисление.
     * Демонстрирует делегирование: передает работу объекту #handler,
     * не зная деталей реализации цепочки обработчиков (инкапсуляция).
     * @param {Charge} charge - Начисление
     * @param {Service} service - Услуга
     * @returns {number} Стоимость
     * @throws {Error} Если обработка не удалась
     */
    processCharge(charge, service) {
        // ДЕЛЕГИРОВАНИЕ: передаем обработку первому обработчику в цепочке
        // Полиморфизм: мы не знаем, какой именно обработчик сработает,
        // но знаем, что все они реализуют метод handle()
        const result = this.#handler.handle(charge, service);
        
        // Проверка результата: если null, значит ни один обработчик не смог обработать
        if (result === null) {
            throw new Error(`Не удалось обработать начисление #${charge.chargeCode}`);
        }
        
        return result;
    }

    /**
     * Обрабатывает извещение на оплату.
     * Демонстрирует работу с коллекциями объектов и накопление результата.
     * @param {PaymentNotice} notice - Извещение на оплату
     * @returns {PaymentNotice} Обработанное извещение (с установленным totalAmount)
     */
    processNotice(notice) {
        let totalAmount = 0.0; // Инициализация переменной для накопления суммы
        
        // Цикл по всем парам [начисление, услуга] в извещении
        // Деструктуризация массива: [charge, service] извлекает два элемента
        for (const [charge, service] of notice.charges) {
            // Обрабатываем каждое начисление и добавляем к общей сумме
            totalAmount += this.processCharge(charge, service);
        }
        
        // Устанавливаем итоговую сумму в объекте notice (мутация объекта)
        notice.totalAmount = totalAmount;
        
        // Возвращаем обработанное извещение
        return notice;
    }
}

