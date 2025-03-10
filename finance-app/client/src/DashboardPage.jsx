import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DataTable } from '@/components/DataTable';
import { fetchReport, fetchBalance, fetchDetailedIncomes, fetchDetailedExpenses } from './api';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value);
};

const CustomTooltip = ({ active, payload, label, reportType }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border border-gray-300 rounded shadow">
        <p className="font-bold">{label}</p>
        <p>{`Total: ${formatCurrency(payload[0].value)}`}</p>
        {reportType === 'by-name' && payload[0].payload && (
          <>
            <p>{`Tipo: ${payload[0].payload.type || 'N/A'}`}</p>
            <p>{`Fecha: ${payload[0].payload.date || 'N/A'}`}</p>
          </>
        )}
      </div>
    );
  }
  return null;
};

const MetricCard = ({ title, value, className }) => (
  <Card className={`${className} transition-all duration-300 hover:shadow-md`}>
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className={`text-2xl font-bold ${
        title.includes('Gastos') ? 'text-red-600' : 
        title.includes('Ingresos') ? 'text-green-600' : 
        value.startsWith('-') ? 'text-red-600' : 'text-blue-600'
      }`}>
        {value}
      </div>
    </CardContent>
  </Card>
);

const DetailsTable = ({ data, columns, title }) => (
  <Card className="h-full">
    <CardHeader>
      <CardTitle className="text-lg">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <DataTable
        data={data}
        columns={columns}
        pagination={true}
        itemsPerPage={5}
        searchKey="name"
      />
    </CardContent>
  </Card>
);

export default function DashboardPage() {
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [reportType, setReportType] = useState('by-type');
  const [reportData, setReportData] = useState([]);
  const [balanceData, setBalanceData] = useState(null);
  const [incomesData, setIncomesData] = useState([]);
  const [expensesData, setExpensesData] = useState([]);
  const [error, setError] = useState(null);
  const [noDataMessage, setNoDataMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (noDataMessage) {
      const timer = setTimeout(() => setNoDataMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [noDataMessage]);

  // Reemplaza completamente tu función formatDate actual con esta versión
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  
  try {
    // Crear objeto Date a partir del string
    const date = new Date(dateString);
    
    // Verificar si es una fecha válida
    if (isNaN(date.getTime())) {
      return 'Fecha inválida';
    }
    
    // Configurar opciones para formatear a zona horaria de Argentina
    const formatter = new Intl.DateTimeFormat('es-AR', {
      timeZone: 'America/Argentina/Buenos_Aires',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
    
    // Obtener las partes de la fecha formateada
    const parts = formatter.formatToParts(date);
    
    // Crear un objeto con las partes de la fecha
    const dateObj = parts.reduce((acc, part) => {
      acc[part.type] = part.value;
      return acc;
    }, {});
    
    // Construir el formato deseado: DD - MM - YYYY, HH:MM
    return `${dateObj.day} - ${dateObj.month} - ${dateObj.year}, ${dateObj.hour}:${dateObj.minute}`;
  } catch (error) {
    console.error('Error al formatear fecha:', error);
    return 'Error de formato';
  }
};
  
// Columnas para Ingresos
const incomeColumns = [
  { 
    key: 'date', 
    label: 'Fecha y Hora',
    format: (value) => formatDate(value)
  },
  { key: 'name', label: 'Nombre' },
  { 
    key: 'amount', 
    label: 'Monto', 
    format: formatCurrency 
  },
  { key: 'type', label: 'Método' }
];

// Columnas para Gastos
const expenseColumns = [
  { 
    key: 'date', 
    label: 'Fecha y Hora',
    format: (value) => formatDate(value)
  },
  { key: 'name', label: 'Descripción' },
  { 
    key: 'amount', 
    label: 'Monto', 
    format: formatCurrency 
  },
  { key: 'category', label: 'Categoría' }
];
  const generateReport = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setBalanceData(null);
      setIncomesData([]);
      setExpensesData([]);
      
      const [reportResponse, balanceResponse, incomesResponse, expensesResponse] = await Promise.all([
        fetchReport(reportType, startDate, endDate),
        fetchBalance(startDate, endDate),
        fetchDetailedIncomes(startDate, endDate),
        fetchDetailedExpenses(startDate, endDate)
      ]);

      const formattedData = reportResponse.data.map(item => ({
        name: item._id,
        total: Number(item.total),
        formattedTotal: formatCurrency(item.total),
        type: item.type || 'N/A',
        date: item.date ? new Date(item.date).toLocaleDateString() : 'N/A'
      }));

      setReportData(formattedData);
      setBalanceData(balanceResponse.data);
      setIncomesData(incomesResponse.data);
      setExpensesData(expensesResponse.data);
      
      if (formattedData.length === 0 && incomesResponse.data.length === 0 && expensesResponse.data.length === 0) {
        setNoDataMessage("No hay registros cargados para el rango de fechas seleccionado.");
      }
      
    } catch (error) {
      console.error('Error generating report:', error);
      setError(error.message || 'Error al generar el reporte');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Panel de Control Financiero</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="startDate">Fecha Inicio</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  max={endDate}
                />
              </div>
              <div>
                <Label htmlFor="endDate">Fecha Fin</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate}
                />
              </div>
              <div>
                <Label htmlFor="reportType">Tipo de Reporte</Label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione el tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="by-type">Por Tipo</SelectItem>
                    <SelectItem value="by-name">Por Nombre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Button onClick={generateReport} disabled={isLoading}>
              {isLoading ? 'Generando Reporte...' : 'Generar Reporte'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {noDataMessage && (
        <Alert>
          <AlertTitle>Información</AlertTitle>
          <AlertDescription>{noDataMessage}</AlertDescription>
        </Alert>
      )}

      {balanceData && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricCard
            title="Total Ingresos"
            value={formatCurrency(balanceData.incomeTotal)}
            className="border-green-200 bg-green-50/50"
          />
          <MetricCard
            title="Total Gastos"
            value={formatCurrency(balanceData.expenseTotal)}
            className="border-red-200 bg-red-50/50"
          />
          <MetricCard
            title="Balance General"
            value={formatCurrency(balanceData.balance)}
            className={balanceData.balance >= 0 
              ? 'border-blue-200 bg-blue-50/50' 
              : 'border-orange-200 bg-orange-50/50'}
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DetailsTable
          data={incomesData}
          columns={incomeColumns}
          title="📈 Detalle de Ingresos"
        />
        <DetailsTable
          data={expensesData}
          columns={expenseColumns}
          title="📉 Detalle de Gastos"
        />
      </div>

      {reportData.length > 0 && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Análisis Gráfico</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={reportData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 12 }}
                      interval="preserveStartEnd"
                    />
                    <YAxis
                      tickFormatter={(value) => formatCurrency(value)}
                      width={100}
                    />
                    <Tooltip content={<CustomTooltip reportType={reportType} />} />
                    <Legend />
                    <Bar
                      dataKey="total"
                      fill="#4f46e5"
                      name="Total"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Resumen Consolidado</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                data={reportData}
                columns={[
                  { key: 'name', label: reportType === 'by-type' ? 'Tipo' : 'Nombre' },
                  { key: 'formattedTotal', label: 'Total' },
                  ...(reportType === 'by-name' ? [
                    { key: 'type', label: 'Tipo' },
                    { key: 'date', label: 'Fecha' }
                  ] : [])
                ]}
                searchKey="name"
                pagination={true}
                itemsPerPage={5}
              />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}