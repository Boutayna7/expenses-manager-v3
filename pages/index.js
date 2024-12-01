import { useState } from 'react'

export default function Home() {
  const [userType, setUserType] = useState('')
  const [expenses, setExpenses] = useState([])
  const [newExpense, setNewExpense] = useState({
    driverName: '',
    driverFirstName: '',
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
    setNewExpense({ driverName: '', driverFirstName: '', amount: '', reason: '', date: '' })
  }

  if (!userType) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-between py-12 sm:px-6 lg:px-8">
        {/* Section des boutons en haut */}
        <div className="sm:mx-auto sm:w-full sm:max-w-md mt-8">
          <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-8">
            Gestion des dépenses
          </h2>
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="space-y-6">
              <button
                onClick={() => setUserType('driver')}
                className="w-full flex justify-center py-6 px-8 border border-transparent rounded-lg shadow-sm text-xl font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Je suis chauffeur
              </button>
              <button
                onClick={() => setUserType('admin')}
                className="w-full flex justify-center py-6 px-8 border border-gray-300 rounded-lg shadow-sm text-xl font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Je suis administrateur
              </button>
            </div>
          </div>
        </div>

        {/* Logo en bas */}
        <div className="sm:mx-auto sm:w-full sm:max-w-md mt-12">
          <img
            className="mx-auto w-auto max-h-48 max-w-[80%]"
            src="/logo.png"
            alt="Logo entreprise"
          />
        </div>
      </div>
    )
  }

  const ExpenseForm = () => (
    <div className="bg-white p-8 rounded-lg shadow mb-8">
      <h2 className="text-2xl font-bold mb-6">Nouvelle dépense</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block mb-2 text-lg">Nom</label>
            <input
              type="text"
              className="w-full p-3 border rounded-lg text-lg"
              value={newExpense.driverName}
              onChange={(e) => setNewExpense({...newExpense, driverName: e.target.value})}
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-lg">Prénom</label>
            <input
              type="text"
              className="w-full p-3 border rounded-lg text-lg"
              value={newExpense.driverFirstName}
              onChange={(e) => setNewExpense({...newExpense, driverFirstName: e.target.value})}
              required
            />
          </div>
        </div>
        <div>
          <label className="block mb-2 text-lg">Montant (DH)</label>
          <input
            type="number"
            className="w-full p-3 border rounded-lg text-lg"
            value={newExpense.amount}
            onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
            required
          />
        </div>
        <div>
          <label className="block mb-2 text-lg">Motif</label>
          <input
            type="text"
            className="w-full p-3 border rounded-lg text-lg"
            value={newExpense.reason}
            onChange={(e) => setNewExpense({...newExpense, reason: e.target.value})}
            required
          />
        </div>
        <div>
          <label className="block mb-2 text-lg">Date</label>
          <input
            type="date"
            className="w-full p-3 border rounded-lg text-lg"
            value={newExpense.date}
            onChange={(e) => setNewExpense({...newExpense, date: e.target.value})}
            required
          />
        </div>
        <button 
          type="submit"
          className="w-full bg-blue-500 text-white p-4 rounded-lg text-lg font-medium hover:bg-blue-600"
        >
          Enregistrer la dépense
        </button>
      </form>
    </div>
  )

  const ExpensesList = ({ showAll = false }) => (
    <div className="bg-white p-8 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">
        {showAll ? 'Toutes les dépenses' : 'Vos dernières dépenses'}
      </h2>
      <div className="space-y-6">
        {expenses
          .filter(expense => showAll || (
            expense.driverName === newExpense.driverName && 
            expense.driverFirstName === newExpense.driverFirstName
          ))
          .slice(0, showAll ? undefined : 5)
          .map(expense => (
            <div key={expense.id} className="border p-6 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold text-lg mb-1">
                    {expense.driverFirstName} {expense.driverName}
                  </p>
                  <p className="text-gray-600 mb-2">{expense.date}</p>
                  <p className="text-lg mb-2">{expense.reason}</p>
                  <p className="font-bold text-xl">{expense.amount} DH</p>
                </div>
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      setExpenses(expenses.map(e => 
                        e.id === expense.id 
                          ? {...e, approved: !e.approved, status: !e.approved ? 'Approuvé' : 'En attente'}
                          : e
                      ))
                    }}
                    className={`block w-full px-6 py-3 rounded-lg text-lg ${
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
                      className="block w-full px-6 py-3 rounded-lg border border-gray-300 text-lg"
                    >
                      Marquer remboursé
                    </button>
                  )}
                </div>
              </div>
              <div className="mt-4">
                <span className={`px-4 py-2 text-lg rounded-full ${
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
  )

  const pageContent = (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          {userType === 'driver' ? 'Espace Chauffeur' : 'Espace Administrateur'}
        </h1>
        <button
          onClick={() => setUserType('')}
          className="text-gray-600 hover:text-gray-800 text-lg"
        >
          Déconnexion
        </button>
      </div>

      <ExpenseForm />
      <ExpensesList showAll={userType === 'admin'} />

      <div className="mt-12 text-center">
        <img
          className="mx-auto max-h-24 w-auto"
          src="/logo.png"
          alt="Logo entreprise"
        />
      </div>
    </div>
  )

  return pageContent
}
