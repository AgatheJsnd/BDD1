import React, { useState } from 'react';

const LoginModal = ({ isOpen, onClose, onLogin }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (firstName && lastName && email) {
      onLogin({ firstName, lastName, email });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center min-h-screen">
      <div className="w-full max-w-2xl px-8 py-12">
        {/* Icône utilisateur centrée */}
        <div className="flex justify-center mb-8">
          <div className="p-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full border-2 border-blue-200 shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        </div>

        {/* Titre */}
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Bienvenue
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Veuillez remplir vos informations pour commencer
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex gap-6">
            <div className="space-y-2 flex-1">
              <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700">Prénom</label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Votre prénom"
                required
                className="w-full px-5 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-lg bg-white/90"
              />
            </div>

            <div className="space-y-2 flex-1">
              <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700">Nom</label>
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Votre nom"
                required
                className="w-full px-5 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-lg bg-white/90"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              required
              className="w-full px-5 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-lg bg-white/90"
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transition duration-200 font-bold text-lg shadow-lg hover:shadow-xl transform active:scale-98 mt-8"
          >
            Commencer
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;

