import React, { useState } from 'react';
import { Upload, Check, X, ChevronDown } from 'lucide-react';

const ExpensesManager = () => {
  const [userType, setUserType] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    firstName: '',
    amount: '',
    reason: '',
    date: '',
    justificatifImage: null,
  });
  const [expenses, setExpenses] = useState([]);

  const ADMIN_PASSWORD = '123456';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          justificatifImage: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.justificatifImage) {
      alert('Veuillez ajouter une image justificative');
      return;
    }
    const expense = {
      id: Date.now(),
      ...formData,
      status: 'En attente',
      approved: false,
      reimbursed: false,
    };
    setExpenses([expense, ...expenses.sort((a, b) => b.id - a.id)]);
    setFormData((prev) => ({
      ...prev,
      amount: '',
      reason: '',
      date: '',
      justificatifImage: null,
    }));
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = '';
  };

  if (!userType) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-between p-6">
        <div className="w-full mx-auto mt-8">
          <h2 className="text-center text-4xl font-bold text-gray-900 mb-10">
            Gestion des dépenses
          </h2>
          <div className="bg-white p-6 shadow rounded-2xl">
            <div className="space-y-6">
              <button
                onClick={() => setUserType('driver')}
                className="w-full py-8 rounded-2xl text-2xl font-medium text-white bg-blue-600 active:bg-blue-700"
              >
                Je suis chauffeur
              </button>
              <button
                onClick={() => {
                  const password = prompt('Entrez le mot de passe administrateur:');
                  if (password === ADMIN_PASSWORD) {
                    setIsAdmin(true);
                    setUserType('admin');
                  } else {
                    alert('Mot de passe incorrect');
                  }
                }}
                className="w-full py-8 rounded-2xl text-2xl font-medium text-gray-700 bg-gray-100 active:bg-gray-200"
              >
                Je suis administrateur
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <img
            className="mx-auto w-48"
            src="/logo.png"
            alt="Logo entreprise"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          {userType === 'driver' ? 'Espace Chauffeur' : 'Espace Administrateur'}
        </h1>
        <button
          onClick={() => {
            setUserType('');
            setIsAdmin(false);
          }}
          className="text-xl text-gray-600 bg-gray-100 px-6 py-4 rounded-xl active:bg-gray-200"
        >
          Déconnexion
        </button>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow mb-8">
        <h2 className="text-2xl font-bold mb-6">Nouvelle dépense</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 text-xl font-medium">Nom</label>
            <input
              type="text"
              name="name"
              className="w-full p-4 text-xl border rounded-xl"
              value={formData.name}
              onChange={handleChange}
              required
              style={{ height: '60px' }}
            />
          </div>
          <div>
            <label className="block mb-2 text-xl font-medium">Prénom</label>
            <input
              type="text"
              name="firstName"
              className="w-full p-4 text-xl border rounded-xl"
              value={formData.firstName}
              onChange={handleChange}
              required
              style={{ height: '60px' }}
            />
          </div>
          <div>
            <label className="block mb-2 text-xl font-medium">Montant (DH)</label>
            <input
              type="number"
              name="amount"
              className="w-full p-4 text-xl border rounded-xl"
              value={formData.amount}
              onChange={handleChange}
              required
              style={{ height: '60px' }}
            />
          </div>
          <div>
            <label className="block mb-2 text-xl font-medium">Motif</label>
            <input
              type="text"
              name="reason"
              className="w-full p-4 text-xl border rounded-xl"
              value={formData.reason}
              onChange={handleChange}
              required
              style={{ height: '60px' }}
            />
          </div>
          <div>
            <label className="block mb-2 text-xl font-medium">Date</label>
            <input
              type="date"
              name="date"
              className="w-full p-4 text-xl border rounded-xl"
              value={formData.date}
              onChange={handleChange}
              required
              style={{ height: '60px' }}
            />
          </div>
          <div>
            <label className="block mb-2 text-xl font-medium">Photo du justificatif</label>
            <div className="flex items-center space-x-4">
              <label
                htmlFor="justificatifImage"
                className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 cursor-pointer"
              >
                <Upload size={24} />
                <span>Ajouter une image</span>
              </label>
              <input
                type="file"
                id="justificatifImage"
                accept="image/*"
                capture="environment"
                onChange={handleImageUpload}
                className="hidden"
              />
              {formData.justificatifImage && (
                <div className="border rounded-xl p-4">
                  <img
                    src={formData.justificatifImage}
                    alt="Aperçu"
                    className="w-full rounded-xl"
                  />
                </div>
              )}
            </div>
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
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            {userType === 'admin' ? 'Toutes les dépenses' : 'Vos dépenses'}
          </h2>
          {isAdmin && (
            <div className="relative">
              <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-800">
                <span>Filtrer</span>
                <ChevronDown size={18} />
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md p-4">
                <ul className="space-y-2">
                  <li>
                    <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-800">
                      <Check size={18} />
                      <span>Approuvées</span>
                    </button>
                  </li>
                  <li>
                    <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-800">
                      <X size={18} />
                      <span>En attente</span>
                    </button>
                  </li>
                  <li>
                    <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-800">
                      <Check size={18} />
                      <span>Remboursées</span>
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
        <div className="space-y-6">
          {expenses.map((expense) => (
            <div key={expense.id} className="border rounded-2xl p-6">
              <div>
                <p className="text-2xl font-medium">
                  {expense.firstName} {expense.name}
                </p>
                <p className="text-xl text-gray-600 mt-2">{expense.date}</p>
                <p className="text-xl mt-2">{expense.reason}</p>
                <p className="text-3xl font-bold mt-2">{expense.amount} DH</p>
                {expense.justificatifImage && (
                  <div className="mt-4">
                    <img
                      src={expense.justificatifImage}
                      alt="Justificatif"
                      className="w-full rounded-xl cursor-pointer"
                      onClick={() => {
                        // Afficher le justificatif en plein écran
                      }}
                    />
                  </div>
                )}
                <div className="mt-4">
                  <span
                    className={`inline-block px-6 py-3 rounded-xl text-xl font-medium ${
                      expense.status === 'Remboursé'
                        ? 'bg-green-100 text-green-800'
                        : expense.status === 'Approuvé'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {expense.status}
                  </span>
                </div>
                {isAdmin && (
                  <div className="mt-6 space-y-4">
                    <button
                      onClick={() => {
                        setExpenses(
                          expenses.map((e) =>
                            e.id === expense.id
                              ? { ...e, approved: !e.approved, status: !e.approved ? 'Approuvé' : 'En attente' }
                              : e
                          )
                        );
                      }}
                      className={`w-full py-4 rounded-xl text-xl font-medium ${
                        expense.approved
                          ? 'bg-green-100 text-green-800'
                          : 'border text-gray-700'
                      }`}
                      style={{ height: '60px' }}
                    >
                      {expense.approved ? 'Approuvé' : 'Approuver'}
                    </button>
                    {expense.approved && !expense.reimbursed && (
                      <button
                        onClick={() => {
                          setExpenses(
                            expenses.map((e) =>
                              e.id === expense.id
                                ? { ...e, reimbursed: true, status: 'Remboursé' }
                                : e
                            )
                          );
                        }}
                        className="w-full py-4 rounded-xl text-xl font-medium border text-gray-700"
                        style={{ height: '60px' }}
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

      <div className="mt-12 mb-6 text-center">
        <img
          className="mx-auto h-24 w-auto"
          src="/logo.png"
          alt="Logo entreprise"
        />
      </div>
    </div>
  );
};

export default ExpensesManager;
