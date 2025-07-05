import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { setUser as authLogin } from '../authSlice.js';
import { Button, InputField, Logo } from '../../../shared/components';
import { useDispatch } from 'react-redux';
import authServices from '../services/authServices.js';
import { useForm } from 'react-hook-form';
import LoadOverLay from '../../../shared/components/LoadOverLay.jsx'

function Login() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const login = async (data) => {
    setLoading(true);
    setError('');
    try {
      const session = await authServices.loginUser(data);
    
      if (session) {
        const userData = await authServices.getCurrentUser();
        if (userData) dispatch(authLogin({ user: userData.user }));
        navigate('/');
      }
    } catch (error) {
      const message =
        error?.response?.data?.message || error.message || 'Something went wrong';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
   <LoadOverLay loading={loading}> 
    <div className="flex items-center justify-center w-full">
        <div className="mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10">
          <div className="mb-2 flex justify-center">
            <span className="inline-block w-full max-w-[100px]">
              <Logo width="100%" />
            </span>
          </div>
          <h2 className="text-center text-2xl font-bold leading-tight">Sign in to your account</h2>
          <p className="mt-2 text-center text-base text-black/60">
            Don&apos;t have an account?{' '}
            <Link
              to="/signup"
              className="font-medium text-primary transition-all duration-200 hover:underline"
            >
              Sign Up
            </Link>
          </p>
          {error && <p className="text-red-600 mt-8 text-center">{error}</p>}
          <form onSubmit={handleSubmit(login)} className="mt-8 space-y-5" noValidate>
            <div>
              <InputField                
                label="Username or Email"
                type="text"
                placeholder="Enter your username or email"
                {...register('identifier', {
                  required: 'Username or Email is required',
                })}
              />
              {errors.identifier && (
                <p className="text-red-500 text-sm mt-1">{errors.identifier.message}</p>
              )}
            </div>

            <div>
              <InputField
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                {...register('password', {
                  required: 'Password is required',
                })}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="text-sm text-blue-600 underline mt-1"
              >
                {showPassword ? 'Hide' : 'Show'} Password
              </button>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in ...' : 'Sign in'}
            </Button>
          </form>
        </div>
      </div>
   </LoadOverLay>

  );
}

export default Login;
