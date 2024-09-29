// app/signup.js
import AuthForm from '@/components/AuthForm';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebase';
import { useState } from 'react';

export default function Signup() {
  const [error, setError] = useState(null);

  const handleSignup = async ({ email, password }) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // Redirect or show success message
    } catch (err) {
      setError(err.message);
    }
  };

  return <AuthForm formType="signup" onSubmit={handleSignup} errorMessage={error} />;
}
