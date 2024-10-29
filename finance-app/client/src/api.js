const API_BASE_URL = 'http://localhost:4000/api';



export const fetchIncomes = async () => {
  const response = await fetch(`${API_BASE_URL}/incomes`);
  if (!response.ok) {
    throw new Error('Error fetching incomes');
  }
  return response.json();
};

export const createIncome = async (incomeData) => {

  const amount = parseFloat(incomeData.amount);
  if (isNaN(amount)) {
    throw new Error('El monto debe ser un número válido');
  }

  const response = await fetch(`${API_BASE_URL}/incomes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(incomeData),
  });
  if (!response.ok) {
    throw new Error('Error creating income');
  }
  return response.json();
};

export const fetchReport = async (reportType, startDate, endDate) => {
  const params = new URLSearchParams({
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
  });
  const response = await fetch(`${API_BASE_URL}/reports/${reportType}?${params}`);
  if (!response.ok) {
    throw new Error(`Error fetching ${reportType} report`);
  }
  return response.json();
};