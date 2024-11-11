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
  try {
    const response = await fetch(`${API_BASE_URL}/reports/${reportType}?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`);
    
    if (!response.ok) {
      const text = await response.text();
      console.error('Server response:', text);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      console.error('Unexpected content type:', contentType);
      console.error('Server response:', text);
      throw new Error("Oops, we haven't got JSON!");
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error in fetchReport:', error);
    throw error;
  }
};