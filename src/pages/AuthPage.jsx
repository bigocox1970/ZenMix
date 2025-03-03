import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import AuthForm from '../components/AuthForm.jsx';

const AuthPage = () => {
  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4">
          <AuthForm />
          
          <div className="mt-8 text-center">
            <Link to="/" className="text-gray-400 hover:text-white text-sm">
              ← Back to Home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default AuthPage;