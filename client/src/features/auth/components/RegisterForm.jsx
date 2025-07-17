import { useState } from 'react'
import authServices from '../services/authServices.js'
import { Link, useNavigate } from 'react-router-dom'
import { setUser } from '../authSlice'
import { Button, InputField, Logo } from '../../../shared/components/index.js'
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import LoadOverLay from '../../../shared/components/LoadOverLay.jsx'
import { FiUpload, FiUser, FiMail, FiLock, FiImage, FiX ,FiEyeOff, FiEye} from 'react-icons/fi'

function RegisterForm() {
  const [loading, setLoading] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [coverPreview, setCoverPreview] = useState(null)  
  const [showPassword, setShowPassword] = useState(false);
  
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm()

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCoverChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setCoverPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeAvatar = () => {
    setAvatarPreview(null)
    setValue('avatar', null)
  }

  const removeCover = () => {
    setCoverPreview(null)
    setValue('coverImage', null)
  }

  const createAccount = async (data) => {
    if (!data.avatar?.[0]) {
      setError('Profile picture is required')
      return
    }

    setError('')
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('username', data.username)
      formData.append('email', data.email)
      formData.append('fullname', data.fullname)
      formData.append('password', data.password)
      formData.append('avatar', data.avatar[0]) // Required
      
      if (data.coverImage?.[0]) {
        formData.append('coverImage', data.coverImage[0]) // Optional
      }

      const accountCreated = await authServices.registerUser(formData)
      if (accountCreated) {
        const userData = await authServices.getCurrentUser()
        if (userData) {
          dispatch(setUser({ user: userData.data.user }))
        }
        navigate('/')
      }
    } catch (err) {
      setError(err?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }
  
  const onFormError = (formErrors) => {
    console.log('Validation Errors:', formErrors)
    if(formErrors.password.message)setError(formErrors.password.message);
    else setError('Please fix the highlighted fields')
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

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(createAccount, onFormError)} className="space-y-4">
            <div className="flex flex-col items-start justify-center gap-y-3">
              <InputField
                label="Username"
                placeholder="john_doe"
                error={errors.username}
                {...register('username', { required: 'Username is required' })}
                icon={<FiUser className="text-gray-400" />}
              />

              <InputField
                label="Email"
                type="email"
                placeholder="john@example.com"
                error={errors.email}
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                    message: 'Invalid email address'
                  }
                })}
                icon={<FiMail className="text-gray-400" />}
              />

              <InputField
                label="Full Name"
                placeholder="John Doe"
                error={errors.fullname}
                {...register('fullname', { required: 'Full name is required' })}
                icon={<FiUser className="text-gray-400" />}
              />

                 <InputField
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    error={errors.password}
                    {...register('password', {
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters',
                      },
                    })}
                    icon={<FiLock className="text-gray-400" />}
                />
                <button
                    type="button"
                    className="right-3 top-9 text-gray-500 hover:text-gray-700 focus:outline-none"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <FiEyeOff size={18}/> : <FiEye size={18}/>}
                </button>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Profile Picture <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    {avatarPreview ? (
                      <>
                        <img
                          src={avatarPreview}
                          alt="Avatar preview"
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={removeAvatar}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                          aria-label="Remove avatar"
                        >
                          <FiX className="w-3 h-3" />
                        </button>
                      </>
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                        <FiUser className="text-gray-400" />
                      </div>
                    )}
                  </div>
                  <label className="flex-1">
                    <div className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
                      <FiUpload className="mr-2" />
                      {avatarPreview ? 'Change' : 'Choose file'}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      {...register('avatar', { required: 'Profile picture is required' })}
                      onChange={handleAvatarChange}
                    />
                  </label>
                </div>
                {errors.avatar && (
                  <p className="mt-1 text-sm text-red-600">{errors.avatar.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Cover Image (Optional)
                </label>
                <div className="flex flex-col space-y-2">
                  <div className="relative">
                    {coverPreview ? (
                      <>
                        <img
                          src={coverPreview}
                          alt="Cover preview"
                          className="w-full h-32 rounded-md object-cover"
                        />
                        <button
                          type="button"
                          onClick={removeCover}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                          aria-label="Remove cover"
                        >
                          <FiX className="w-3 h-3" />
                        </button>
                      </>
                    ) : (
                      <div className="w-full h-32 rounded-md bg-gray-200 flex items-center justify-center">
                        <FiImage className="text-gray-400 text-2xl" />
                      </div>
                    )}
                  </div>
                  <label>
                    <div className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
                      <FiUpload className="mr-2" />
                      {coverPreview ? 'Change' : 'Choose file'}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      {...register('coverImage')}
                      onChange={handleCoverChange}
                    />
                  </label>
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

export default RegisterForm