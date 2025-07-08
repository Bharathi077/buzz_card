import React, { useState } from 'react';
import { VCardData } from '../types';
import CardForm from '../components/CardForm';
import QrCodeDisplay from '../components/QrCodeDisplay';
import { GithubIcon } from '../components/icons';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../hooks/useAuth';

function Dashboard() {
  const { user } = useAuth();

  // With the key on ProtectedRoute, this component will remount when the user changes.
  // This means `useState`'s initializer will run again with the new user's data,
  // making it the perfect place to set the initial state.
  // The `!` non-null assertion is safe here because ProtectedRoute guarantees `user` exists.
  const [cardData, setCardData] = useState<VCardData>({
    firstName: user!.firstName,
    lastName: user!.lastName,
    title: 'Director',
    company: 'Smartificia Technologies',
    phone: '+1234567890',
    email: user!.email,
    website: 'https://smartificia.com',
    address: '123 Tech Park, Bangalore, India',
    photo: '',
    companyLogo: '',
  });

  return (
    <div className="flex h-screen bg-slate-100 font-sans">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800">Welcome, {user?.firstName}!</h1>
                <p className="mt-1 text-slate-500">Design and generate your digital business card.</p>
            </header>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <CardForm cardData={cardData} setCardData={setCardData} />
              <QrCodeDisplay cardData={cardData} />
            </div>
        </div>
         <footer className="text-center p-4 text-slate-500 text-sm bg-slate-100">
            <p>Powered by Smartificia Technologies</p>
        </footer>
      </main>
    </div>
  );
}

export default Dashboard;