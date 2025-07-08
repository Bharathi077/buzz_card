import React from 'react';
import { SmartificiaIcon } from './icons';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <SmartificiaIcon className="w-16 h-16" />
          <h2 className="mt-4 text-center text-3xl font-bold tracking-tight text-slate-900">
            {title}
          </h2>
        </div>
        <div className="bg-white py-8 px-4 shadow-xl rounded-2xl sm:px-10 border border-slate-200">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
