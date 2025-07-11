// Auth/Login.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../stores/authSlice';
import { useNavigate } from 'react-router-dom';
import { PlusIcon } from '@heroicons/react/24/solid';
import { fetchCompanies } from '../stores/companySlice';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [company , setCompany] = useState('');
  const [error, setError] = useState('');
  const [companyImage, setCompanyImage] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { status, error: authError } = useSelector((state) => state.auth);
  const {companies} = useSelector((state) => state.company);
  const fileInputRef = useRef(null);

 


    useEffect(() => {
    const savedImage = localStorage.getItem('companyImage');
    if (savedImage) {
      setCompanyImage(savedImage);
    }
  }, []);
  const handleClick = () => {
    fileInputRef.current.click();
  };
 
 const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setCompanyImage(base64String);
        localStorage.setItem('companyImage', base64String);
        
        
      };
      reader.readAsDataURL(file);
    }
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const result = await dispatch(loginUser({ email, password,company}));
      if (loginUser.fulfilled.match(result)) {
        navigate('/admin');
      } else {
        setError(authError || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Unexpected login error:', err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 via-blue-200 to-blue-300">
      <form
        onSubmit={handleLogin}
        className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md transition-all"
      >
         <div className="flex justify-center mb-6">
      <div
        className="w-24 h-24 rounded-full border-2 border-dashed border-blue-400 flex items-center justify-center cursor-pointer relative group hover:bg-blue-50 transition"
        onClick={handleClick}
      >
        {companyImage ? (
          <img
            src={companyImage}
            alt="Selected"
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
          <PlusIcon className="w-8 h-8 text-blue-400 group-hover:scale-110 transition" />
        )}

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={fileInputRef}
          style={{ display: 'none' }}
        />
      </div>
    </div>

        <h2 className="text-3xl font-bold text-center text-blue-600 mb-2">
          Dental Clinic Login
        </h2>
        <p className="text-center text-gray-500 text-sm mb-6">
          Please enter your credentials to access the admin panel.
        </p>

        {error && (
          <div className="text-red-500 text-sm text-center mb-4">{error}</div>
        )}

        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Email</label>
          <input
            type="text"
            name='email'
            className="w-full px-4 py-2 border rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Company</label>
          <input
            type="text"
            name='company'
            className="w-full px-4 py-2 border rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter your company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-medium">Password</label>
          <input
            type="password"
            name='password'
            className="w-full px-4 py-2 border rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
          disabled={status === 'loading'}
        >
          {status === 'loading' ? 'Logging in...' : 'Login'}
        </button>

        <div className="mt-4 text-sm text-center text-gray-500">
          Don't have an account?{' '}
          <a href="#" className="text-blue-600 hover:underline">
            Register
          </a>
        </div>
      </form>
    </div>
  );
};

export default Login;