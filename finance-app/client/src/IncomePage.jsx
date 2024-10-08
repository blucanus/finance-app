import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

export default function IncomePage() {
  const [incomes, setIncomes] = useState([])
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [type, setType] = useState('efectivo')

  useEffect(() => {
    fetchIncomes()
  }, [])

  const fetchIncomes = async () => {    
    const response = await fetch('/api/incomes')
    const data = await response.json()
    setIncomes(data)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const response = await fetch('/api/incomes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, amount: parseFloat(amount), type, date: new Date() }),
    })
    if (response.ok) {
      setName('')
      setAmount('')
      setType('efectivo')
      fetchIncomes()
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

      <Card>
        <CardHeader>
          <CardTitle>Últimos Ingresos</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {incomes.map((income) => (
              <li key={income._id} className="flex justify-between items-center border-b pb-2">
                <span className="font-medium">{income.name}</span>
                <span className="text-muted-foreground">${income.amount.toFixed(2)} - {income.type}</span>
                <span className="text-sm text-muted-foreground">{new Date(income.date).toLocaleDateString()}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}