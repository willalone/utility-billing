/**
 * Сервис для генерации Excel файлов в браузере
 */

import ExcelJS from 'exceljs';
import { DateTimeHandler } from '../lib/dateTimeUtils.js';

export class ExcelService {
  constructor() {
    this._dateHandler = DateTimeHandler;
  }

  /**
   * Генерирует Excel-файл с извещением на оплату и скачивает его
   * @param {PaymentNotice} notice - Извещение на оплату
   * @param {string} fileName - Имя файла
   * @returns {Promise<void>}
   */
  async generateAndDownload(notice, fileName) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Извещение на оплату');

    // Стили
    const headerFont = {
      name: 'Arial',
      size: 14,
      bold: true,
      color: { argb: 'FFFFFFFF' }
    };
    const headerFill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF366092' }
    };
    const labelFont = {
      name: 'Arial',
      bold: true
    };
    const border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };

    // Заголовок
    worksheet.mergeCells('A1:E1');
    const headerCell = worksheet.getCell('A1');
    headerCell.value = 'ИЗВЕЩЕНИЕ НА ОПЛАТУ';
    headerCell.font = headerFont;
    headerCell.fill = headerFill;
    headerCell.alignment = { horizontal: 'center', vertical: 'middle' };
    headerCell.border = border;

    // Информация о лицевом счете
    let row = 3;
    const info = [
      ['Лицевой счет:', notice.account.accountNumber],
      ['ФИО:', notice.account.fullName],
      ['Адрес:', notice.account.getAddress(notice.street)],
      ['Период:', `${this._dateHandler.getMonthName(notice.periodMonth)} ${notice.periodYear}`],
      ['Дата формирования:', this._dateHandler.formatDate(this._dateHandler.getCurrentDate())]
    ];

    for (const [label, value] of info) {
      const labelCell = worksheet.getCell(`A${row}`);
      labelCell.value = label;
      labelCell.font = labelFont;
      
      const valueCell = worksheet.getCell(`B${row}`);
      valueCell.value = value;
      row++;
    }

    // Таблица начислений
    row++;
    const headers = ['№', 'Услуга', 'Количество', 'Тариф', 'Сумма'];
    for (let col = 1; col <= headers.length; col++) {
      const cell = worksheet.getCell(row, col);
      cell.value = headers[col - 1];
      cell.font = headerFont;
      cell.fill = headerFill;
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = border;
    }

    // Данные начислений
    row++;
    for (let idx = 0; idx < notice.charges.length; idx++) {
      const [charge, service] = notice.charges[idx];
      const cost = service.calculateCost(charge.quantity);

      // №
      const numCell = worksheet.getCell(row, 1);
      numCell.value = idx + 1;
      numCell.border = border;
      numCell.alignment = { horizontal: 'center' };

      // Услуга
      const serviceCell = worksheet.getCell(row, 2);
      serviceCell.value = service.name;
      serviceCell.border = border;

      // Количество
      const quantityCell = worksheet.getCell(row, 3);
      quantityCell.value = charge.quantity;
      quantityCell.border = border;
      quantityCell.alignment = { horizontal: 'right' };

      // Тариф
      const tariffCell = worksheet.getCell(row, 4);
      tariffCell.value = service.tariff;
      tariffCell.border = border;
      tariffCell.alignment = { horizontal: 'right' };

      // Сумма
      const costCell = worksheet.getCell(row, 5);
      costCell.value = cost;
      costCell.border = border;
      costCell.alignment = { horizontal: 'right' };

      row++;
    }

    // Итого
    worksheet.mergeCells(`A${row}:D${row}`);
    const totalLabelCell = worksheet.getCell(`A${row}`);
    totalLabelCell.value = 'ИТОГО К ОПЛАТЕ:';
    totalLabelCell.font = { name: 'Arial', size: 12, bold: true };
    totalLabelCell.alignment = { horizontal: 'right', vertical: 'middle' };
    totalLabelCell.border = border;

    const totalAmountCell = worksheet.getCell(`E${row}`);
    totalAmountCell.value = notice.totalAmount;
    totalAmountCell.font = { name: 'Arial', size: 12, bold: true };
    totalAmountCell.alignment = { horizontal: 'right', vertical: 'middle' };
    totalAmountCell.border = border;
    totalAmountCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFFFF00' }
    };

    // Ширина столбцов
    worksheet.getColumn(1).width = 8;
    worksheet.getColumn(2).width = 40;
    worksheet.getColumn(3).width = 15;
    worksheet.getColumn(4).width = 15;
    worksheet.getColumn(5).width = 15;

    // Генерация blob и скачивание
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
}

