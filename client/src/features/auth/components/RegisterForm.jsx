import React, {useState} from 'react'
import authServices from '../services/authServices.js'
import {Link, useNavigate} from 'react-router-dom'
import {setUser} from '../authSlice'
import {Button, InputField, Logo} from '../../../shared/components/index.js'
import {useDispatch, useSelector} from 'react-redux'
import { useForm} from 'react-hook-form'


function RegisterForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState('');  
  const {register, handleSubmit, formState: {errors}} = useForm();
  
  const createAccount = async (data) => {
    setError('');
    try {
      const formData = new FormData();
      formData.append("username", data.username);
      formData.append("email", data.email);
      formData.append("fullname", data.fullname);

      if(data.avatar && data.avatar.length > 0) {
        formData.append("avatar", data.avatar[0]);
      }
      if(data.coverImage && data.coverImage.length > 0) {
        formData.append("coverImage", data.coverImage[0]);
      }
      formData.append("password", data.password);
      const accountCreated = await authServices.registerUser(formData);
      if(accountCreated){
        const userData = await authServices.getCurrentUser();
        if(userData) {
        dispatch(setUser({user: userData.user}));}
        navigate("/");
      }
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="flex items-center justify-center">
            <div className={`mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10`}>
                <div className="mb-2 flex justify-center">
                    <span className="inline-block w-full max-w-[100px]">
                        <Logo width="100%" />
                    </span>
                </div>
                <h2 className="text-center text-2xl font-bold leading-tight">Sign up to create account</h2>
                 <p className="mt-2 text-center text-base text-black/60">
                    Already have an account?&nbsp;
                    <Link
                        to="/login"
                        className="font-medium text-primary transition-all duration-200 hover:underline"
                    >
                        Sign In
                    </Link>
                </p>
                {error && <p className="text-red-600 mt-8 text-center">{error}</p>}

                <form onSubmit={handleSubmit(createAccount)}>
                    <div className="space-y-5">
                        <InputField
                        label="username: "
                        placeholder="Enter your username"
                        {...register("username", {
                            required: true,
                        })}
                        />
                        <InputField
                        label="Email: "
                        placeholder="Enter your email"
                        type="email"
                        {...register("email", {
                            required: true,
                            validate: {
                                matchPatern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                                "Email address must be a valid address",
                            }
                        })}
                        />
                        <InputField
                        label="fullname: "
                        placeholder="Enter your fullname"
                        {...register("fullname", {
                            required: true,
                        })}
                        />
                        <InputField
                        label="avatar: "
                        placeholder="avatar"
                        type ="file"
                        {...register("avatar", {
                            required: true,
                        })}
                        />
                        <InputField
                        label="coverImage: "
                        placeholder="coverImage"
                        type ="file"
                        {...register("coverImage")}
                        />
                        <InputField
                        label="Password: "
                        type="password"
                        placeholder="Enter your password"
                        {...register("password", {
                            required: true,})}
                        />
                        <Button type="submit" className="w-full">
                            Create Account
                        </Button>
                    </div>
                </form>
            </div>
    </div>
  )
}

export default RegisterForm;