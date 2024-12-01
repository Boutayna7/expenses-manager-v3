import React, { useState } from 'react'

export default function Home() {
  const [userType, setUserType] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    firstName: '',
    amount: '',
    reason: '',
    date: '',
    justificatifImage: null
  })
  const [expenses, setExpenses] = useState([])

  const ADMIN_PASSWORD = '123456'

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          justificatifImage: reader.result
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.justificatifImage) {
      alert('Veuillez ajouter une image justificative')
      return
    }
    const expense = {
      id: Date.now(),
      ...formData,
      status: 'En attente',
      approved: false,
      reimbursed: false
    }
    setExpenses([expense, ...expenses])
    setFormData(prev => ({
      ...prev,
      amount: '',
      reason: '',
      date: '',
      justificatifImage: null
    }))
    const fileInput = document.querySelector('input[type="file"]')
    if (fileInput) fileInput.value = ''
  }

  if (!userType) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-between p-4">
        <div className="w-full max-w-sm mx-auto mt-8">
          <h2 className="text-center text-2xl font-bold text-gray-900 mb-6">
            Gestion des dépenses
          </h2>
          <div className="bg-white p-4 shadow rounded-xl">
            <div className="space-y-4">
              <button
                onClick={() => setUserType('driver')}
                className="w-full py-4 rounded-xl text-lg font-medium text-white bg-blue-600 active:bg-blue-700"
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
                className="w-full py-4 rounded-xl text-lg font-medium text-gray-700 bg-gray-100 active:bg-gray-200"
              >
                Je suis administrateur
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <img
            className="mx-auto w-32"
            src="/logo.png"
            alt="Logo entreprise"
          />
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 max-w-lg mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">
          {userType === 'driver' ? 'Espace Chauffeur' : 'Espace Administrateur'}
        </h1>
        <button
          onClick={() => {
            setUserType('')
            setIsAdmin(false)
          }}
          className="text-sm text-gray-600 bg-gray-100 px-3 py-2 rounded-lg active:bg-gray-200"
        >
          Déconnexion
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow mb-6">
        <h2 className="text-lg font-bold mb-4">Nouvelle dépense</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Nom</label>
            <input
              type="text"
              name="name"
              className="w-full p-3 border rounded-xl text-base"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Prénom</label>
            <input
              type="text"
              name="firstName"
              className="w-full p-3 border rounded-xl text-base"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Montant (DH)</label>
            <input
              type="number"
              name="amount"
              className="w-full p-3 border rounded-xl text-base"
              value={formData.amount}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Motif</label>
            <input
              type="text"
              name="reason"
              className="w-full p-3 border rounded-xl text-base"
              value={formData.reason}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Date</label>
            <input
              type="date"
              name="date"
              className="w-full p-3 border rounded-xl text-base"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Photo du justificatif</label>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleImageUpload}
              className="w-full p-3 border rounded-xl text-base"
              required
            />
            {formData.justificatifImage && (
              <div className="mt-2 border rounded-xl p-2">
                <img 
                  src={formData.justificatifImage} 
                  alt="Aperçu" 
                  className="w-full rounded-lg"
                />
              </div>
            )}
          </div>
          <button 
            type="submit"
            className="w-full bg-blue-600 text-white p-4 rounded-xl text-lg font-medium active:bg-blue-700"
          >
            Enregistrer
          </button>
        </form>
      </div>

      <div className="bg-white p-4 rounded-xl shadow">
        <h2 className="text-lg font-bold mb-4">
          {userType === 'admin' ? 'Toutes les dépenses' : 'Vos dépenses'}
        </h2>
        <div className="space-y-4">
          {expenses
            .filter(expense => userType === 'admin' || (
              expense.name === formData.name && 
              expense.firstName === formData.firstName
            ))
            .slice(0, userType === 'admin' ? undefined : 5)
            .map(expense => (
              <div key={expense.id} className="border rounded-xl p-4">
                <div>
                  <p className="font-medium">
                    {expense.firstName} {expense.name}
                  </p>
                  <p className="text-sm text-gray-600">{expense.date}</p>
                  <p className="mt-1">{expense.reason}</p>
                  <p className="text-lg font-bold mt-1">{expense.amount} DH</p>
                  {expense.justificatifImage && (
                    <div className="mt-2">
                      <img 
                        src={expense.justificatifImage} 
                        alt="Justificatif" 
                        className="w-full rounded-lg"
                      />
                    </div>
                  )}
                  <div className="mt-3">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                      expense.status === 'Remboursé'
                        ? 'bg-green-100 text-green-800'
                        : expense.status === 'Approuvé'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {expense.status}
                    </span>
                  </div>
                  {isAdmin && (
                    <div className="mt-3 space-y-2">
                      <button
                        onClick={() => {
                          setExpenses(expenses.map(e => 
                            e.id === expense.id 
                              ? {...e, approved: !e.approved, status: !e.approved ? 'Approuvé' : 'En attente'}
                              : e
                          ))
                        }}
                        className={`w-full py-2 rounded-lg text-center ${
                          expense.approved 
                            ? 'bg-green-100 text-green-800' 
                            : 'border text-gray-700'
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
                          className="w-full py-2 rounded-lg border text-gray-700"
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

      <div className="mt-8 mb-4 text-center">
        <img
          className="mx-auto h-12 w-auto"
          src="/logo.png"
          alt="Logo entreprise"
        />
      </div>
    </div>
  )
}
