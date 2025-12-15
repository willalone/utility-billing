import React, { useState, useEffect } from 'react';
import { FiZap } from 'react-icons/fi';
import Dashboard from './components/Dashboard';
import AccountDetails from './components/AccountDetails';
import dataService from './services/dataService';
import './App.css';

function App() {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [accountDetails, setAccountDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = () => {
    try {
      const accountsData = dataService.getAllAccounts();
      setAccounts(accountsData);
      setLoading(false);
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
      setLoading(false);
    }
  };

  const handleAccountSelect = (accountCode) => {
    setSelectedAccount(accountCode);
    const details = dataService.getAccountDetails(accountCode);
    setAccountDetails(details);
  };

  const handleBack = () => {
    setSelectedAccount(null);
    setAccountDetails(null);
  };

  if (loading) {
    return (
      <div className="app-loading">
        <div className="spinner"></div>
        <p>Загрузка данных...</p>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="container">
          <h1>
            <FiZap className="icon" />
            Система управления начислениями
          </h1>
          <p className="subtitle">Коммунальные услуги</p>
        </div>
      </header>

      <main className="app-main">
        <div className="container">
          {!selectedAccount ? (
            <Dashboard
              accounts={accounts}
              onAccountSelect={handleAccountSelect}
            />
          ) : (
            <AccountDetails
              accountDetails={accountDetails}
              onBack={handleBack}
            />
          )}
        </div>
      </main>

      <footer className="app-footer">
        <div className="container">
          <p>&copy; 2024 Система управления начислениями</p>
        </div>
      </footer>
    </div>
  );
}

export default App;

