import React, { useState } from 'react';
import { FiArrowLeft, FiDownload, FiCalendar, FiUser, FiMapPin, FiFileText } from 'react-icons/fi';
import { ExcelService } from '../services/excelService.js';
import dataService from '../services/dataService';
import './AccountDetails.css';

function AccountDetails({ accountDetails, onBack }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStatus, setGenerationStatus] = useState(null);

  if (!accountDetails) {
    return null;
  }

  const { account, street, charges } = accountDetails;
  const period = dataService.getCurrentPeriod();
  const totalAmount = charges.reduce((sum, item) => sum + item.cost, 0);

  const handleGenerateExcel = async () => {
    setIsGenerating(true);
    setGenerationStatus(null);

    try {
      const notice = dataService.createPaymentNotice(account.accountCode);
      const excelService = new ExcelService();
      const fileName = `извещение_ЛС_${account.accountNumber}.xlsx`;
      
      await excelService.generateAndDownload(notice, fileName);
      
      setGenerationStatus({ type: 'success', message: 'Файл успешно скачан!' });
    } catch (error) {
      console.error('Ошибка генерации Excel:', error);
      setGenerationStatus({ type: 'error', message: error.message });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="account-details">
      <button className="back-button" onClick={onBack}>
        <FiArrowLeft />
        <span>Назад к списку</span>
      </button>

      <div className="details-header">
        <div className="details-title">
          <FiFileText className="title-icon" />
          <h2>Извещение на оплату</h2>
        </div>
        <button
          className="generate-button"
          onClick={handleGenerateExcel}
          disabled={isGenerating}
        >
          <FiDownload />
          <span>{isGenerating ? 'Генерация...' : 'Скачать Excel'}</span>
        </button>
      </div>

      {generationStatus && (
        <div className={`status-message ${generationStatus.type}`}>
          {generationStatus.message}
        </div>
      )}

      <div className="details-card">
        <div className="account-info-section">
          <h3 className="section-title">Информация о лицевом счете</h3>
          
          <div className="info-grid">
            <div className="info-item">
              <div className="info-item-header">
                <FiFileText className="info-item-icon" />
                <span className="info-item-label">Лицевой счет</span>
              </div>
              <span className="info-item-value">{account.accountNumber}</span>
            </div>

            <div className="info-item">
              <div className="info-item-header">
                <FiUser className="info-item-icon" />
                <span className="info-item-label">ФИО</span>
              </div>
              <span className="info-item-value">{account.fullName}</span>
            </div>

            <div className="info-item">
              <div className="info-item-header">
                <FiMapPin className="info-item-icon" />
                <span className="info-item-label">Адрес</span>
              </div>
              <span className="info-item-value">{account.getAddress(street)}</span>
            </div>

            <div className="info-item">
              <div className="info-item-header">
                <FiCalendar className="info-item-icon" />
                <span className="info-item-label">Период</span>
              </div>
              <span className="info-item-value">
                {period.monthName} {period.year}
              </span>
            </div>
          </div>
        </div>

        <div className="charges-section">
          <h3 className="section-title">Начисления</h3>
          
          <div className="charges-table-wrapper">
            <table className="charges-table">
              <thead>
                <tr>
                  <th>№</th>
                  <th>Услуга</th>
                  <th>Количество</th>
                  <th>Тариф</th>
                  <th>Сумма</th>
                </tr>
              </thead>
              <tbody>
                {charges.map((item, index) => (
                  <tr key={item.charge.chargeCode}>
                    <td className="text-center">{index + 1}</td>
                    <td>{item.service.name}</td>
                    <td className="text-right">{item.charge.quantity.toFixed(2)}</td>
                    <td className="text-right">{item.service.tariff.toFixed(2)} руб.</td>
                    <td className="text-right amount-cell">{item.cost.toFixed(2)} руб.</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="total-row">
                  <td colSpan="4" className="total-label">ИТОГО К ОПЛАТЕ:</td>
                  <td className="total-amount">{totalAmount.toFixed(2)} руб.</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountDetails;

