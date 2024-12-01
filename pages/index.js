import React, { useState } from 'react'

export default function Home() {
  // States de base
  const [userType, setUserType] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    firstName: '',
    amount: '',
    reason: '',
    date: '',
    justificatifNumero: '',
    justificatif: ''
  })
  const [expenses, setExpenses] = useState([])

  // Mot de passe admin - À changer
  const ADMIN_PASSWORD = '123456'

  // Gestion des changements de formulaire
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault()
    const expense = {
      id: Date.now(),
      ...formData,
      status: 'En attente',
      approved: false,
      reimbursed: false
    }
    setExpenses([expense, ...expenses])
    // Reset seulement les champs de dépense, pas le nom et prénom
    setFormData(prev => ({
      ...prev,
      amount: '',
      reason: '',
      date: '',
      justificatifNumero: '',
      justificatif: ''
    }))
  }

  // Page de connexion
  if (!userType) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-between py-12 sm:px-6 lg:px-8">
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
                onClick={() => {
                  const password = prompt('Entrez le mot de passe administrateur:')
                  if (password === ADMIN_PASSWORD) {
                    setIsAdmin(true)
                    setUserType('admin')
                  } else {
                    alert('Mot de passe incorrect')
                  }
                }}
                className="w-full flex justify-center py-6 px-8 border border-gray-300 rounded-lg shadow-sm text-xl font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Je suis administrateur
              </button>
            </div>
          </div>
        </div>

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

  // Page principale
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          {userType === 'driver' ? 'Espace Chauffeur' : 'Espace Administrateur'}
        </h1>
        <button
          onClick={() => {
            setUserType('')
            setIsAdmin(false)
          }}
          className="text-gray-600 hover:text-gray-800 text-lg"
        >
          Déconnexion
        </button>
      </div>

      <div className="bg-white p-8 rounded-lg shadow mb-8">
        <h2 className="text-2xl font-bold mb-6">Nouvelle dépense</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 text-lg">Nom</label>
              <input
                type="text"
                name="name"
                className="w-full p-3 border rounded-lg text-lg"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block mb-2 text-lg">Prénom</label>
              <input
                type="text"
                name="firstName"
                className="w-full p-3 border rounded-lg text-lg"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div>
            <label className="block mb-2 text-lg">Montant (DH)</label>
            <input
              type="number"
              name="amount"
              className="w-full p-3 border rounded-lg text-lg"
              value={formData.amount}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-lg">Motif</label>
            <input
              type="text"
              name="reason"
              className="w-full p-3 border rounded-lg text-lg"
              value={formData.reason}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-lg">Date</label>
            <input
              type="date"
              name="date"
              className="w-full p-3 border rounded-lg text-lg"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-lg">Numéro de la pièce justificative</label>
            <input
              type="text"
              name="justificatifNumero"
              className="w-full p-3 border rounded-lg text-lg"
              value={formData.justificatifNumero}
              onChange={handleChange}
              required
              placeholder="ex: Facture-123 ou Ticket-456"
            />
          </div>
          <div>
            <label className="block mb-2 text-lg">Description de la pièce justificative</label>
            <textarea
              name="justificatif"
              className="w-full p-3 border rounded-lg text-lg"
              value={formData.justificatif}
              onChange={handleChange}
              required
              placeholder="Description de la pièce justificative (type de document, détails, etc.)"
              rows="3"
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

      <div className="bg-white p-8 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-6">
          {userType === 'admin' ? 'Toutes les dépenses' : 'Vos dernières dépenses'}
        </h2>
        <div className="space-y-6">
          {expenses
            .filter(expense => userType === 'admin' || (
              expense.name === formData.name && 
              expense.firstName === formData.firstName
            ))
            .slice(0, userType === 'admin' ? undefined : 5)
            .map(expense => (
              <div key={expense.id} className="border p-6 rounded-lg">
                <div className="flex justify-between items-center">
                  <div className="flex-grow">
                    <p className="font-bold text-lg mb-1">
                      {expense.firstName} {expense.name}
                    </p>
                    <p className="text-gray-600 mb-2">{expense.date}</p>
                    <p className="text-lg mb-2">{expense.reason}</p>
                    <p className="font-bold text-xl mb-3">{expense.amount} DH</p>
                    <div className="bg-gray-50 p-3 rounded-lg mb-3">
                      <p className="text-gray-700"><strong>N° Justificatif:</strong> {expense.justificatifNumero}</p>
                      <p className="text-gray-700"><strong>Description:</strong> {expense.justificatif}</p>
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
                  {isAdmin && (
                    <div className="space-y-3 ml-4">
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
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>

      <div className="mt-12 text-center">
        <img
          className="mx-auto max-h-24 w-auto"
          src="/logo.png"
          alt="Logo entreprise"
        />
      </div>
    </div>
  )
}
