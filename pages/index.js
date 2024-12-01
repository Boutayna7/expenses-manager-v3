import { useState } from 'react'

export default function Home() {
  const [userType, setUserType] = useState('')
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

  if (!userType) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <img
            className="mx-auto h-24 w-auto"
            src="/api/placeholder/200/100"
            alt="Logo entreprise"
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Gestion des dépenses
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="space-y-4">
              <button
                onClick={() => setUserType('driver')}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Je suis chauffeur
              </button>
              <button
                onClick={() => setUserType('admin')}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Je suis administrateur
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (userType === 'driver') {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex justify-between items-center mb-8">
          <img
            className="h-12 w-auto"
            src="/api/placeholder/200/100"
            alt="Logo entreprise"
          />
          <button
            onClick={() => setUserType('')}
            className="text-gray-600 hover:text-gray-800"
          >
            Déconnexion
          </button>
        </div>

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
                <label className="block mb-1">Montant (DH)</label>
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
          <h2 className="text-xl font-bold mb-4">Vos dernières dépenses</h2>
          <div className="space-y-4">
            {expenses
              .filter(expense => expense.driverId === newExpense.driverId)
              .slice(0, 5)
              .map(expense => (
                <div key={expense.id} className="border p-4 rounded">
                  <p className="font-bold">{expense.amount} DH</p>
                  <p>{expense.reason}</p>
                  <p className="text-sm text-gray-600">{expense.date}</p>
                  <span className={`mt-2 inline-block px-2 py-1 text-sm rounded-full ${
                    expense.status === 'Remboursé'
                      ? 'bg-green-100 text-green-800'
                      : expense.status === 'Approuvé'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {expense.status}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <img
          className="h-12 w-auto"
          src="/api/placeholder/200/100"
          alt="Logo entreprise"
        />
        <button
          onClick={() => setUserType('')}
          className="text-gray-600 hover:text-gray-800"
        >
          Déconnexion
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Toutes les dépenses</h2>
        <div className="space-y-4">
          {expenses.map(expense => (
            <div key={expense.id} className="border p-4 rounded">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold">Chauffeur #{expense.driverId}</p>
                  <p className="text-sm text-gray-600">{expense.date}</p>
                  <p>{expense.reason}</p>
                  <p className="font-bold">{expense.amount} DH</p>
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
