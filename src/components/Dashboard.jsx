import React from 'react';
import { FiHome, FiUser, FiMapPin, FiDollarSign, FiArrowRight } from 'react-icons/fi';
import './Dashboard.css';

function Dashboard({ accounts, onAccountSelect }) {
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Лицевые счета</h2>
        <p className="dashboard-subtitle">Выберите лицевой счет для просмотра начислений</p>
      </div>

      <div className="accounts-grid">
        {accounts.map(({ account, street }) => (
          <div
            key={account.accountCode}
            className="account-card"
            onClick={() => onAccountSelect(account.accountCode)}
          >
            <div className="account-card-header">
              <div className="account-number">
                <FiHome className="account-icon" />
                <span>{account.accountNumber}</span>
              </div>
              <FiArrowRight className="arrow-icon" />
            </div>

            <div className="account-card-body">
              <div className="account-info-item">
                <FiUser className="info-icon" />
                <span className="info-label">ФИО:</span>
                <span className="info-value">{account.fullName}</span>
              </div>

              <div className="account-info-item">
                <FiMapPin className="info-icon" />
                <span className="info-label">Адрес:</span>
                <span className="info-value">{account.getAddress(street)}</span>
              </div>
            </div>

            <div className="account-card-footer">
              <span className="view-details">Просмотреть начисления</span>
            </div>
          </div>
        ))}
      </div>

      {accounts.length === 0 && (
        <div className="empty-state">
          <FiHome className="empty-icon" />
          <p>Нет доступных лицевых счетов</p>
        </div>
      )}
    </div>
  );
}

export default Dashboard;

