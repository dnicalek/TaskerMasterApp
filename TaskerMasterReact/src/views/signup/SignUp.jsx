import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { registrationSchema } from './validationSchema';
import axios, { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/navbar';


const errorsTable = {
    "An error occurred while checking the username.": "username",
    "Username is already taken.": "username",
    "An error occurred while checking the email.": "email",
    "Email is already taken.": "email",
    "An error occurred while hashing the password.": "password",
    "An error occurred while registering the user.": "username"
};


export default function SignUp() {
    const [isButtonHovered, setButtonHovered] = useState(false);
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(registrationSchema),
    });

    const onSubmit = async (data) => {
        console.log("Data: ", data);
        try {
            await axios.post("http://localhost:3000/register", data);
            navigate("/");
        } catch (error) {
            if (error && error instanceof AxiosError) {
                if (error.response) {
                    setError(errorsTable[error.response.data], { message: error.response.data });
                    console.log(error)
                } else {
                    setError("username", { message: "An error occurred. Please try again later." });
                    setError("password", { message: "An error occurred. Please try again later." });
                    setError("confirmPassword", { message: "An error occurred. Please try again later." });
                    setError("email", { message: "An error occurred. Please try again later." });
                }
            }
        }
    };

    return (
        <>
            <Navbar mode="unauth" />
            <div style={formContainerStyle}>
                <form onSubmit={handleSubmit(onSubmit)} style={formStyle}>
                    <h1 style={formHeadingStyle}>Sign Up</h1>
                    <div style={fieldStyle}>
                        <label htmlFor="username">Username:</label>
                        <input
                            type="text"
                            style={{
                                ...inputStyle,
                                ...(errors.username ? errorInputStyle : {}),
                            }}
                            id="username"
                            {...register("username")}
                        />
                        {errors.username && (
                            <span style={errorTextStyle}>{errors.username.message}</span>
                        )}
                    </div>
                    <div style={fieldStyle}>
                        <label htmlFor="email">Email:</label>
                        <input
                            style={{
                                ...inputStyle,
                                ...(errors.email ? errorInputStyle : {}),
                            }}
                            id="email"
                            {...register("email", {
                            })}
                        />
                        {errors.email && (
                            <span style={errorTextStyle}>{errors.email.message}</span>
                        )}
                    </div>
                    <div style={fieldStyle}>
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            style={{
                                ...inputStyle,
                                ...(errors.password ? errorInputStyle : {}),
                            }}
                            id="password"
                            {...register("password")}
                        />
                        {errors.password && (
                            <span style={errorTextStyle}>{errors.password.message}</span>
                        )}
                    </div>
                    <div style={fieldStyle}>
                        <label htmlFor="confirmPassword">Confirm password:</label>
                        <input
                            type="password"
                            style={{
                                ...inputStyle,
                                ...(errors.confirmPassword ? errorInputStyle : {}),
                            }}
                            id="confirmPassword"
                            {...register("confirmPassword")}
                        />
                        {errors.confirmPassword && (
                            <span style={errorTextStyle}>
                                {errors.confirmPassword.message}
                            </span>
                        )}
                    </div>
                    <button
                        type="submit"
                        style={
                            isButtonHovered
                                ? { ...buttonStyle, ...buttonHoverStyle }
                                : { ...buttonStyle }
                        }
                        onMouseEnter={() => setButtonHovered(true)}
                        onMouseLeave={() => setButtonHovered(false)}
                    >
                        Sign Up
                    </button>


                    <div
                        style={{
                            color: '#fff',
                            textAlign: 'center',
                            fontSize: '1.2rem',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                        }}
                        onClick={() => navigate("/login")}
                    >Sign In Here!</div>
                </form>
            </div>
        </>
    );
}

const formContainerStyle = {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
};

const formStyle = {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    width: '400px',
    maxWidth: '400px',
    padding: '2rem',
    borderRadius: 5,
    background: '#103727',
    gap: 20
};

const formHeadingStyle = {
    color: '#fff',
    textAlign: 'center',
    fontSize: '2rem',
    fontWeight: 'bold'
};

const fieldStyle = {
    display: 'flex',
    flexDirection: 'column',
    color: '#A5CFB9',
    fontWeight: 'bold'
};

const inputStyle = {
    WebkitAppearance: 'none',
    backgroundColor: '#A5CFB9',
    border: '1px solid #A5CFB9',
    color: '#000',
    maxWidth: '425px',
    width: '100%',
    padding: '0.8em',
    fontSize: '0.9em',
    fontFamily: 'Source Sans Pro, sans-serif',
    borderRadius: 5,
    outline: 'none',
    transition: 'background 0.25s, border-color 0.25s, color 0.25s'
};

const errorInputStyle = {
    border: '1px solid red'
};

const errorTextStyle = {
    color: 'red',
    fontSize: '0.9em'
};

const buttonStyle = {
    backgroundColor: '#000',
    fontFamily: 'Source Sans Pro, sans-serif',
    fontWeight: '600',
    fontSize: '1.1em',
    padding: '15px 16px',
    color: '#fff',
    borderRadius: 5,
    border: 'none'
};

const buttonHoverStyle = {
  backgroundColor: '#A5CFB9',
  color: '#103727',
  fontFamily: 'Source Sans Pro, sans-serif',
  fontWeight: 'bold',
  fontSize: '1.1em',

};