import { useState, useRef } from 'react'
import { validators, successChecks } from '../utils/validateRegistration.jsx';
import InputField from './FormInputField.jsx';
import authServices from '../services/authServices.js'
import { Link, useNavigate } from 'react-router-dom'
import { setUser } from '../authSlice'
import { Button, Logo } from '../../../shared/components/index.js'
import { useDispatch } from 'react-redux'
import LoadOverLay from '../../../shared/components/LoadOverLay.jsx'
import { FiUpload, FiUser, FiX} from 'react-icons/fi'

function RegisterForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [avatarPreview, setAvatarPreview] = useState(null) 
  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  const usernameRef = useRef(null);
  const emailRef = useRef(null);
  const fullnameRef = useRef(null);
  const passwordRef = useRef(null);
  const avatarRef = useRef(null);

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    const errors = validators.avatar(file);
    setFieldErrors(prev => ({...prev, avatar: errors.join(', ')}));
    
    if (file && !errors.length) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setAvatarPreview(null);
    }
  }

  const removeAvatar = () => {
    setAvatarPreview(null);
    avatarRef.current.value = ''; 
    setFieldErrors(prev => ({...prev, avatar: ''}));
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const usernameErrors = validators.username(usernameRef.current.value);
    const emailErrors = validators.email(emailRef.current.value);
    const fullnameErrors = validators.fullName(fullnameRef.current.value);
    const passwordErrors = validators.password(passwordRef.current.value);
    const avatarErrors = validators.avatar(avatarRef.current.files?.[0]);

    if (usernameErrors.length || emailErrors.length || fullnameErrors.length || passwordErrors.length || avatarErrors.length) {
      setFieldErrors({
        username: usernameErrors.join(', '),
        email: emailErrors.join(', '),
        fullname: fullnameErrors.join(', '),
        password: passwordErrors.join(', '),
        avatar: avatarErrors.join(', ')
      });
      return;
    }

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('username', usernameRef.current.value)
      formData.append('email', emailRef.current.value)
      formData.append('fullname', fullnameRef.current.value)
      formData.append('password', passwordRef.current.value)
      formData.append('avatar', avatarRef.current.files[0])

      const accountCreated = await authServices.registerUser(formData)
      if (accountCreated) {
        const userData = await authServices.getCurrentUser()
        if (userData) {
          dispatch(setUser({ user: userData.data.user }))
        }
        navigate('/')
      }
    } catch (err) {
      console.log(err);
      setError(err?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <LoadOverLay loading={loading}>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 space-y-6">
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 mb-4">
              <Logo width="100%" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 text-center">Create your account</h2>
            <p className="text-sm text-gray-600 mt-2">
              Already have an account?{' '}
              <Link to="/login" className="text-indigo-600 hover:text-indigo-500 font-medium">
                Sign in
              </Link>
            </p>
          </div>
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col items-start justify-center gap-y-3">
               <InputField
                label="Username"
                inputRef={usernameRef}
                validate={validators.username}
                successCheck={successChecks.username}
                placeholder="john_doe"
                error={fieldErrors.username}
              />

              <InputField
                label="Email"
                type="email"
                inputRef={emailRef}
                validate={validators.email}
                successCheck={successChecks.email}
                placeholder="john@example.com"
                error={fieldErrors.email}
              />

              <InputField
                label="Full Name"
                inputRef={fullnameRef}
                validate={validators.fullName}
                successCheck={successChecks.fullName}
                placeholder="John Doe"
                error={fieldErrors.fullname}
              />

              <InputField
                label="Password"
                type="password"
                inputRef={passwordRef}
                validate={validators.password}
                successCheck={successChecks.password}
                error={fieldErrors.password}
              />
              
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Profile Picture
                </label>
                <div className="flex items-center gap-4">
                  
                  {avatarPreview ? (
                    <div className="relative">
                      <img 
                        src={avatarPreview} 
                        alt="Avatar preview" 
                        className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={removeAvatar}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <FiX size={14} />
                      </button>
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                      <FiUser size={24} className="text-gray-400" />
                    </div>
                  )}
                  
                  
                  <div className="flex flex-col">
                    <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md text-sm font-medium">
                      <FiUpload className="inline mr-2" />
                      {avatarPreview ? 'Change' : 'Upload'}
                      <input
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        ref={avatarRef}
                        onChange={handleAvatarChange}
                      />
                    </label>
                    {fieldErrors.avatar && (
                      <span className="text-red-500 text-xs mt-1">{fieldErrors.avatar}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <Button type="submit" className="w-full py-2 px-4">
              Create Account
            </Button>
          </form>
        </div>
      </div>
    </LoadOverLay>
  )
}

export default RegisterForm;