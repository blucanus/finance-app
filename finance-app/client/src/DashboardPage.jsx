import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { DataTable } from '@/components/DataTable'
import { fetchReport } from './api'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { fetchBalance } from './api'

// Función auxiliar para formatear moneda
const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value);
}

const MetricCard = ({ title, value, className }) => (
  <Card className={className}>
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
    </CardContent>
  </Card>
);

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

export default function DashboardPage() {
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0])
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0])
  const [reportType, setReportType] = useState('date-range')
  const [reportData, setReportData] = useState([])
  const [error, setError] = useState(null)
  const [noDataMessage, setNoDataMessage] = useState(null)
  const [balanceData, setBalanceData] = useState(null);

  useEffect(() => {
    if (noDataMessage) {
      const timer = setTimeout(() => {
        setNoDataMessage(null)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [noDataMessage])

  const generateReport = async () => {
    try {
      setError(null);
      const [reportResponse, balanceResponse] = await Promise.all([
        fetchReport(reportType, new Date(startDate), new Date(endDate)),
        fetchBalance(new Date(startDate), new Date(endDate))
      ]);
      
      const formattedData = reportResponse.data.map(item => ({
        name: item._id,
        total: Number(item.total),
        formattedTotal: formatCurrency(item.total),
        type: item.type || 'N/A',
        date: item.date ? new Date(item.date).toLocaleDateString() : 'N/A'
      }))
      setReportData(formattedData);
    setBalanceData(balanceResponse.data);
    
    if (formattedData.length === 0) {
      setNoDataMessage("No hay registros cargados...");
    }
    
  } catch (error) {
    console.error('Error generating report:', error);
    setError(error.message || 'Error al generar el reporte');
  }
};

  const columns = [
    { key: 'name', label: reportType === 'by-type' ? 'Tipo' : 'Nombre' },
    { key: 'formattedTotal', label: 'Total' },
    ...(reportType === 'by-name' ? [
      { key: 'type', label: 'Tipo' },
      { key: 'date', label: 'Fecha' }
    ] : [])
  ]

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Generar Reporte</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex space-x-4">
              <div className="flex-1">
                <Label htmlFor="startDate">Fecha Inicio</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="flex-1">
                <Label htmlFor="endDate">Fecha Fin</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="reportType">Tipo de Reporte</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione el tipo de reporte" />
                </SelectTrigger>
                <SelectContent>
                  {/* <SelectItem value="date-range">Por Fecha</SelectItem> */}
                  <SelectItem value="by-type">Por Tipo</SelectItem>
                  <SelectItem value="by-name">Por Nombre</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={generateReport}>Generar Reporte</Button>
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
      className="bg-green-50 border-green-200"
    />
    <MetricCard
      title="Total Gastos"
      value={formatCurrency(balanceData.expenseTotal)}
      className="bg-red-50 border-red-200"
    />
    <MetricCard
      title="Balance General"
      value={formatCurrency(balanceData.balance)}
      className={balanceData.balance >= 0 ? 'bg-blue-50 border-blue-200' : 'bg-orange-50 border-orange-200'}
    />
  </div>
)}
      {reportData.length > 0 && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Gráfico del Reporte</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={reportData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    interval="preserveStartEnd"
                    tickFormatter={(value) => value.length > 10 ? `${value.substr(0, 10)}...` : value}
                  />
                  <YAxis tickFormatter={(value) => formatCurrency(value)} />
                  <Tooltip content={<CustomTooltip reportType={reportType} />} />
                  <Legend />
                  <Bar dataKey="total" fill="#8884d8" name="Total" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tabla del Reporte</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable data={reportData} columns={columns} />
            </CardContent>
          </Card>
        </>
      )}

    </div>
  )
}