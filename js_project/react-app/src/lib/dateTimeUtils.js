/**
 * Модуль для работы с датой и временем.
 */

export class DateTimeHandler {
    /**
     * Возвращает текущую дату.
     * @returns {Date} Текущая дата
     */
    static getCurrentDate() {
        return new Date();
    }

    /**
     * Форматирует дату в строку.
     * @param {Date} date - Дата для форматирования
     * @param {string} format - Формат (по умолчанию "DD.MM.YYYY")
     * @returns {string} Отформатированная дата
     */
    static formatDate(date, format = "DD.MM.YYYY") {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        
        return format
            .replace('DD', day)
            .replace('MM', month)
            .replace('YYYY', year);
    }

    /**
     * Возвращает название месяца на русском языке.
     * @param {number} month - Номер месяца (1-12)
     * @returns {string} Название месяца
     */
    static getMonthName(month) {
        const months = {
            1: "Январь",
            2: "Февраль",
            3: "Март",
            4: "Апрель",
            5: "Май",
            6: "Июнь",
            7: "Июль",
            8: "Август",
            9: "Сентябрь",
            10: "Октябрь",
            11: "Ноябрь",
            12: "Декабрь"
        };
        return months[month] || "Неизвестно";
    }
}

