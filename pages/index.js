import { useState } from 'react'

export default function Home() {
  const [expenses, setExpenses] = useState([])
  const [newExpense, setNewExpense] = useState({
    driverId: '',
    amount: '',
    reason: '',
    date: '',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    const expense = {
      ...newExpense,
      id: Date.now(),
      status: 'En attente',
      approved: false,
      reimbursed: false,
    }
    setExpenses([expense, ...expenses])
    setNewExpense({ driverId: '', amount: '', reason: '', date: '' })
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Gestion des dépenses chauffeurs</h1>
      
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-bold mb-4">Nouvelle dépense</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">ID Chauffeur</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={newExpense.driverId}
                onChange={(e) => setNewExpense({...newExpense, driverId: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block mb-1">Montant (€)</label>
              <input
                type="number"
                className="w-full p-2 border rounded"
                value={newExpense.amount}
                onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                required
              />
            </div>
          </div>
          <div>
            <label className="block mb-1">Motif</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={newExpense.reason}
              onChange={(e) => setNewExpense({...newExpense, reason: e.target.value})}
              required
            />
          </div>
          <div>
            <label className="block mb-1">Date</label>
            <input
              type="date"
              className="w-full p-2 border rounded"
              value={newExpense.date}
              onChange={(e) => setNewExpense({...newExpense, date: e.target.value})}
              required
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Enregistrer la dépense
          </button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Liste des dépenses</h2>
        <div className="space-y-4">
          {expenses.map(expense => (
            <div key={expense.id} className="border p-4 rounded">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold">Chauffeur #{expense.driverId}</p>
                  <p className="text-sm text-gray-600">{expense.date}</p>
                  <p>{expense.reason}</p>
                  <p className="font-bold">{expense.amount}€</p>
                </div>
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setExpenses(expenses.map(e => 
                        e.id === expense.id 
                          ? {...e, approved: !e.approved, status: !e.approved ? 'Approuvé' : 'En attente'}
                          : e
                      ))
                    }}
                    className={`block w-full px-4 py-2 rounded ${
                      expense.approved 
                        ? 'bg-green-100 text-green-800' 
                        : 'border border-gray-300'
                    }`}
                  >
                    {expense.approved ? 'Approuvé' : 'Approuver'}
                  </button>
                  {expense.approved && !expense.reimbursed && (
                    <button
                      onClick={() => {
                        setExpenses(expenses.map(e => 
                          e.id === expense.id 
                            ? {...e, reimbursed: true, status: 'Remboursé'}
                            : e
                        ))
                      }}
                      className="block w-full px-4 py-2 rounded border border-gray-300"
                    >
                      Marquer remboursé
                    </button>
                  )}
                </div>
              </div>
              <div className="mt-2">
                <span className={`px-2 py-1 text-sm rounded-full ${
                  expense.status === 'Remboursé'
                    ? 'bg-green-100 text-green-800'
                    : expense.status === 'Approuvé'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {expense.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
