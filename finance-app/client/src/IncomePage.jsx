import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/Alert"
import { fetchIncomes, createIncome } from './api'

export default function IncomePage() {
  const [incomes, setIncomes] = useState([])
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [type, setType] = useState('efectivo')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  useEffect(() => {
    const loadIncomes = async () => {
      try {
        setIsLoading(true)
        const data = await fetchIncomes()
        setIncomes(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error('Error fetching incomes:', err)
        setError('Error al cargar los ingresos. Por favor, intenta de nuevo más tarde.')
      } finally {
        setIsLoading(false)
      }
    }

    loadIncomes()
  }, [])

  useEffect(() => {
    let timer
    if (successMessage) {
      timer = setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
    }
    return () => clearTimeout(timer)
  }, [successMessage])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const newIncome = await createIncome({ name, amount: parseFloat(amount), type })
      setIncomes(prevIncomes => [newIncome, ...prevIncomes])
      setName('')
      setAmount('')
      setType('efectivo')
      setSuccessMessage('Ingreso registrado correctamente')
    } catch (err) {
      console.error('Error creating income:', err)
      setError('Error al crear el ingreso. Por favor, intenta de nuevo.')
    }
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Nuevo Ingreso</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Nombre</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="amount">Monto</Label>
              <Input id="amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="type">Tipo</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione el tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="efectivo">Efectivo</SelectItem>
                  <SelectItem value="digital">Digital</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit">Registrar Ingreso</Button>
          </form>
        </CardContent>
      </Card>

      {successMessage && (
        <Alert variant="success" onClose={() => setSuccessMessage(null)}>
          <AlertTitle>Éxito</AlertTitle>
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      {/* <Card>
        <CardHeader>
          <CardTitle>Últimos Ingresos</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Cargando ingresos...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : incomes.length === 0 ? (
            <p>No hay ingresos registrados.</p>
          ) : (
            <ul className="space-y-2">
              {incomes.map((income) => (
                <li key={income._id || income.id} className="flex justify-between items-center border-b pb-2">
                  <span className="font-medium">{income.name}</span>
                  <span className="text-muted-foreground">
                    ${typeof income.amount === 'number' ? income.amount.toFixed(2) : 'N/A'} - {income.type}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {income.date ? new Date(income.date).toLocaleDateString() : 'Fecha no disponible'}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card> */}
    </div>
  )
}