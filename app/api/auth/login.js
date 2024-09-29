import AuthForm from '@/components/AuthForm';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebase';
import { useState } from 'react';

export default function Login() {
  const [error, setError] = useState(null);

  const handleLogin = async ({ email, password }) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Redirect or show success message
    } catch (err) {
      setError(err.message);
    }
  };

  return <AuthForm formType="login" onSubmit={handleLogin} errorMessage={error} />;
}
