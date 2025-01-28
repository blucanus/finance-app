import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './Layout'
import IncomePage from './IncomePage'
import DashboardPage from './DashboardPage'
import ExpensePage from './ExpensePage';




export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<IncomePage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="expenses" element={<ExpensePage />} />
        </Route>
      </Routes>
    </Router>
  )
}