import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function DashboardPage() {
  const [dateRange, setDateRange] = useState({ from: new Date(), to: new Date() })
  const [reportType, setReportType] = useState('date')
  const [reportData, setReportData] = useState([])

  const generateReport = async () => {
    const response = await fetch(`/api/report?type=${reportType}&from=${dateRange.from.toISOString()}&to=${dateRange.to.toISOString()}`)
    const data = await response.json()
    setReportData(data)
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Generar Reporte</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label>Rango de Fechas</Label>
              <DatePickerWithRange date={dateRange} setDate={setDateRange} />
            </div>
            <div>
              <Label htmlFor="reportType">Tipo de Reporte</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione el tipo de reporte" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Por Fecha</SelectItem>
                  <SelectItem value="type">Por Tipo</SelectItem>
                  <SelectItem value="name">Por Nombre</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={generateReport}>Generar Reporte</Button>
          </div>
        </CardContent>
      </Card>
      
      {reportData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Reporte</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={reportData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="total" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  )
}