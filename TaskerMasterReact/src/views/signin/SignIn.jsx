import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { loginSchema } from './validationSchema';
import axios, { AxiosError } from 'axios';
import { useSignIn } from 'react-auth-kit';
import Navbar from '../../components/navbar';
import { useNavigate } from 'react-router-dom';




export default function SignIn() {
    const [isButtonHovered, setButtonHovered] = useState(false);
    const navigate = useNavigate();
    const signIn = useSignIn();
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(loginSchema),
    });

    const onSubmit = async (data) => {
        try {
            const response = await axios.post("http://localhost:3000/login", data);

            signIn({
                token: response.data.token,
                expiresIn: response.data.expiresIn,
                tokenType: response.data.tokenType,
                authState: {
                    username: data.username,
                }
            });
            navigate("/");
        } catch (error) {
            if (error && error instanceof AxiosError) {
                if (error.response) {
                    setError("username", { message: error.response.data });
                    setError("password", { message: error.response.data });
                    console.log(error)
                } else {
                    setError("username", { message: "An error occurred. Please try again later." });
                    setError("password", { message: "An error occurred. Please try again later." });
                }
            }
        }
    };

    return (
        <>
            <Navbar mode='unauth' />
            <div style={formContainerStyle}>
                <form onSubmit={handleSubmit(onSubmit)} style={formStyle}>
                    <h1 style={{ color: '#fff', textAlign: 'center', fontSize: '2rem', fontWeight: 'bold' }}>Sign In</h1>
                    <div style={fieldStyle}>
                        <label htmlFor="username">Username:</label>
                        <input
                            type="text"
                            style={{
                                ...inputStyle,
                                ...(errors.username ? errorInputStyle : {})
                            }}
                            id="username"
                            {...register('username', { required: 'To pole jest wymagane' })}
                        />
                        {errors.username && <span style={errorTextStyle}>{errors.username.message}</span>}
                    </div>
                    <div style={fieldStyle}>
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            style={{
                                ...inputStyle,
                                ...(errors.password ? errorInputStyle : {})
                            }}
                            id="password"
                            {...register('password', { required: 'To pole jest wymagane' })}
                        />
                        {errors.password && <span style={errorTextStyle}>{errors.password.message}</span>}
                    </div>
                    <button
                        type="submit"
                        style={isButtonHovered ? { ...buttonStyle, ...buttonHoverStyle } : { ...buttonStyle }}
                        onMouseEnter={() => setButtonHovered(true)}
                        onMouseLeave={() => setButtonHovered(false)}
                    >
                        Sign In
                    </button>
                    <div
                        style={{ color: '#fff', textAlign: 'center', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer' }}
                        onClick={() => navigate("/register")}
                    >
                        Sign up Here!
                    </div>
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
    gap: 20,
};

const fieldStyle = {
    display: 'flex',
    flexDirection: 'column',
    color: '#A5CFB9',
    fontWeight: 'bold',
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
    transition: 'background 0.25s, border-color 0.25s, color 0.25s',
};

const errorInputStyle = {
    border: '1px solid red',
};

const errorTextStyle = {
    color: 'red',
    fontSize: '0.9em',
};

const buttonStyle = {
    backgroundColor: '#000',
    fontFamily: 'Source Sans Pro, sans-serif',
    fontWeight: '600',
    fontSize: '1.1em',
    padding: '15px 16px',
    color: '#fff',
    borderRadius: 5,
    border: 'none',
};

const buttonHoverStyle = {
    backgroundColor: '#A5CFB9',
    color: '#103727',
    fontFamily: 'Source Sans Pro, sans-serif',
    fontWeight: 'bold',
    fontSize: '1.1em',

};
