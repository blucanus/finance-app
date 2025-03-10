const API_BASE_URL = 'http://localhost:4000/api';

// Funciones para Ingresos
export const fetchIncomes = async () => {
  const response = await fetch(`${API_BASE_URL}/incomes`);
  if (!response.ok) throw new Error('Error fetching incomes');
  return response.json();
};

export const createIncome = async (incomeData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/incomes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(incomeData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error creating income');
    }
    
    return response.json();
  } catch (error) {
    console.error('Error in createIncome:', error);
    throw error;
  }
};

export const fetchReport = async (reportType, startDate, endDate) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/reports/${reportType}?startDate=${startDate}&endDate=${endDate}`
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error generating report');
    }
    
    return response.json();
  } catch (error) {
    console.error('Error in fetchReport:', error);
    throw error;
  }
};

export const fetchBalance = async (startDate, endDate) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/reports/balance?startDate=${startDate}&endDate=${endDate}`
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error fetching balance');
    }
    
    return response.json();
  } catch (error) {
    console.error('Error in fetchBalance:', error);
    throw error;
  }
};

// Funciones para Gastos (si las necesitas)
export const fetchExpenses = async () => {
  const response = await fetch(`${API_BASE_URL}/expenses`);
  if (!response.ok) throw new Error('Error fetching expenses');
  return response.json();
};

export const createExpense = async (expenseData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/expenses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(expenseData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error creating expense');
    }
    
    return response.json();
  } catch (error) {
    console.error('Error in createExpense:', error);
    throw error;
  }
};

export const fetchDetailedIncomes = async (startDate, endDate) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/reports/detailed-incomes?startDate=${startDate}&endDate=${endDate}`
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error fetching detailed incomes');
    }
    
    return response.json();
  } catch (error) {
    console.error('Error in fetchDetailedIncomes:', error);
    throw error;
  }
};

export const fetchDetailedExpenses = async (startDate, endDate) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/reports/detailed-expenses?startDate=${startDate}&endDate=${endDate}`
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error fetching detailed expenses');
    }
    
    return response.json();
  } catch (error) {
    console.error('Error in fetchDetailedExpenses:', error);
    throw error;
  }
};