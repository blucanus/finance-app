// ExpensePage.jsx (nuevo archivo)
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { fetchExpenses, createExpense } from './api';

export default function ExpensePage() {
  const [expenses, setExpenses] = useState([]);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('otros');
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    const loadExpenses = async () => {
      try {
        const data = await fetchExpenses();
        setExpenses(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error loading expenses:', err);
      }
    };
    loadExpenses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newExpense = await createExpense({
        name,
        amount: parseFloat(amount),
        category
      });
      setExpenses([newExpense, ...expenses]);
      setName('');
      setAmount('');
      setCategory('otros');
      setSuccessMessage('Gasto registrado correctamente');
    } catch (err) {
      console.error('Error creating expense:', err);
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Nuevo Gasto</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Descripción</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="amount">Monto</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="category">Categoría</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="comida">Comida</SelectItem>
                  <SelectItem value="transporte">Transporte</SelectItem>
                  <SelectItem value="vivienda">Vivienda</SelectItem>
                  <SelectItem value="entretenimiento">Entretenimiento</SelectItem>
                  <SelectItem value="salud">Salud</SelectItem>
                  <SelectItem value="otros">Otros</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit">Registrar Gasto</Button>
          </form>
        </CardContent>
      </Card>

      {/* Lista de gastos similar a IncomePage */}
    </div>
  );
}