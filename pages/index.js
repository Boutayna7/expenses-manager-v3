import React, { useState } from 'react'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableRow,
  Pagination,
  Input,
  Select,
  Button,
  Modal,
  Checkbox
} from '@/components/ui'
import { Download, Search, Filter } from 'lucide-react'

export default function Home() {
  const [userType, setUserType] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    firstName: '',
    amount: '',
    reason: '',
    date: '',
    justificatifFile: null
  })
  const [expenses, setExpenses] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const ADMIN_PASSWORD = '123456'

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFileUpload = (e) => {
    setFormData(prev => ({
      ...prev,
      justificatifFile: e.target.files[0]
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.justificatifFile) {
      alert('Veuillez ajouter une pièce justificative')
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
      justificatifFile: null
    }))
    const fileInput = document.querySelector('input[type="file"]')
    if (fileInput) fileInput.value = ''
  }

  const handleApprove = (expenseId) => {
    setExpenses(expenses.map(e => 
      e.id === expenseId 
        ? {...e, approved: !e.approved, status: !e.approved ? 'Approuvé' : 'En attente'}
        : e
    ))
  }

  const handleReimburse = (expenseId) => {
    setExpenses(expenses.map(e => 
      e.id === expenseId 
        ? {...e, reimbursed: true, status: 'Remboursé'}
        : e
    ))
  }

  const filteredExpenses = expenses.filter(expense => {
    if (searchQuery && 
      !(expense.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        expense.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        expense.reason.toLowerCase().includes(searchQuery.toLowerCase()))) {
      return false
    }
    if (filterStatus !== 'all' && expense.status !== filterStatus) {
      return false
    }
    return true
  })

  const expensesPerPage = 10
  const totalPages = Math.ceil(filteredExpenses.length / expensesPerPage)
  const currentExpenses = filteredExpenses.slice((currentPage - 1) * expensesPerPage, currentPage * expensesPerPage)

  if (!userType) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-between p-6">
        {/* ... */}
      </div>
    )
  }

  return (
    <div className="p-6 mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          {userType === 'driver' ? 'Espace Chauffeur' : 'Espace Administrateur'}
        </h1>
        <button
          onClick={() => {
            setUserType('')
            setIsAdmin(false)
          }}
          className="text-xl text-gray-600 bg-gray-100 px-6 py-4 rounded-xl active:bg-gray-200"
        >
          Déconnexion
        </button>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow mb-8">
        <h2 className="text-2xl font-bold mb-6">Nouvelle dépense</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ... */}
          <div>
            <label className="block mb-2 text-xl font-medium">Pièce justificative</label>
            <input
              type="file"
              accept="application/pdf,image/*"
              onChange={handleFileUpload}
              className="w-full p-4 text-xl border rounded-xl"
              required
              style={{ height: '60px' }}
            />
            {formData.justificatifFile && (
              <div className="mt-4 border rounded-xl p-4">
                {formData.justificatifFile.type.startsWith('image/') ? (
                  <img 
                    src={URL.createObjectURL(formData.justificatifFile)} 
                    alt="Aperçu" 
                    className="w-full rounded-xl"
                  />
                ) : (
                  <p className="text-xl">Pièce justificative PDF</p>
                )}
              </div>
            )}
          </div>
          <button 
            type="submit"
            className="w-full bg-blue-600 text-white py-6 rounded-xl text-2xl font-medium active:bg-blue-700"
            style={{ height: '70px' }}
          >
            Enregistrer
          </button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">
            {userType === 'admin' ? 'Toutes les dépenses' : 'Vos dépenses'}
          </h2>
          <div className="flex items-center space-x-4">
            <Input
              placeholder="Rechercher"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              prefix={<Search className="h-5 w-5 text-gray-400" />}
            />
            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              options={[
                { value: 'all', label: 'Tous les statuts' },
                { value: 'En attente', label: 'En attente' },
                { value: 'Approuvé', label: 'Approuvé' },
                { value: 'Remboursé', label: 'Remboursé' }
              ]}
              prefix={<Filter className="h-5 w-5 text-gray-400" />}
            />
            <Button
              onClick={() => {
                // Fonction pour exporter les dépenses filtrées
                exportExpenses(filteredExpenses)
              }}
              size="sm"
              variant="outline"
              color="gray"
            >
              <Download className="h-5 w-5 mr-2" />
              Exporter
            </Button>
          </div>
        </div>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nom</TableCell>
              <TableCell>Prénom</TableCell>
              <TableCell>Montant</TableCell>
              <TableCell>Motif</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Statut</TableCell>
              {isAdmin && <TableCell>Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {currentExpenses.map(expense => (
              <TableRow key={expense.id}>
                <TableCell>{expense.name}</TableCell>
                <TableCell>{expense.firstName}</TableCell>
                <TableCell>{expense.amount} DH</TableCell>
                <TableCell>{expense.reason}</TableCell>
                <TableCell>{expense.date}</TableCell>
                <TableCell>
                  <span className={`inline-block px-6 py-3 rounded-xl text-xl font-medium ${
                    expense.status === 'Remboursé'
                      ? 'bg-green-100 text-green-800'
                      : expense.status === 'Approuvé'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {expense.status}
                  </span>
                </TableCell>
                {isAdmin && (
                  <TableCell>
                    <div className="space-x-4">
                      <Button
                        onClick={() => handleApprove(expense.id)}
                        size="sm"
                        variant={expense.approved ? 'outline' : 'solid'}
                        color={expense.approved ? 'gray' : 'blue'}
                      >
                        {expense.approved ? 'Désapprouver' : 'Approuver'}
                      </Button>
                      {expense.approved && !expense.reimbursed && (
                        <Button
                          onClick={() => handleReimburse(expense.id)}
                          size="sm"
                          variant="solid"
                          color="green"
                        >
                          Marquer remboursé
                        </Button>
                      )}
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {filteredExpenses.length > expensesPerPage && (
          <div className="mt-6 flex justify-end">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      <div className="mt-12 mb-6 text-center">
        <img
          className="mx-auto h-24 w-auto"
          src="/logo.png"
          alt="Logo entreprise"
        />
      </div>
    </div>
  )
}
