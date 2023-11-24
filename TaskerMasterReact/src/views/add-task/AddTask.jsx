import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { schema } from './validationSchema';
import axios, { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/navbar';
import { useAuthUser, } from 'react-auth-kit';




export default function AddTask() {
    const authUser = useAuthUser();
    const username = authUser()?.username || '';
    const [isButtonHovered, setButtonHovered] = useState(false);
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmit = async (data) => {
        console.log("Data: ", data);
        try {
            await axios.post("http://localhost:3000/addTask", data);
            navigate("/");
        } catch (error) {
            if (error && error instanceof AxiosError) {
                if (error.response) {
                    console.log(error)
                } else {
                    setError("taskName", { message: "An error occurred. Please try again later." });
                    setError("deadline", { message: "An error occurred. Please try again later." });
                    setError("notes", { message: "An error occurred. Please try again later." });
                }
            }
        }
    };

    return (
        <>
            <Navbar mode="auth" />
            <div style={formContainerStyle}>
                <form onSubmit={handleSubmit(onSubmit)} style={formStyle}>
                    <h1 style={formHeadingStyle}>Add new task</h1>
                    <div style={fieldStyle}>
                        <label htmlFor="taskName">Task:</label>
                        <input
                            type="text"
                            style={{
                                ...inputStyle,
                                ...(errors.taskName ? errorInputStyle : {}),
                            }}
                            id="taskName"
                            {...register("taskName")}
                        />
                        {errors.taskName && (
                            <span style={errorTextStyle}>{errors.taskName.message}</span>
                        )}
                    </div>
                    <div style={fieldStyle}>
                        <label htmlFor="deadline">Deadline:</label>
                        <input
                            style={{
                                ...inputStyle,
                                ...(errors.deadline ? errorInputStyle : {}),
                            }}
                            type='date'
                            defaultValue={new Date().toISOString().split('T')[0]}
                            id="deadline"
                            {...register("deadline", {
                            })}
                        />
                        {errors.deadline && (
                            <span style={errorTextStyle}>{errors.deadline.message}</span>
                        )}
                    </div>
                    <div style={fieldStyle}>
                        <label htmlFor="notes">Notes:</label>
                        <textarea
                            style={{
                                ...inputStyle,
                                minHeight: '200px',
                                resize: 'none',
                                ...(errors.notes ? errorInputStyle : {}),
                            }}
                            id="notes"
                            
                            maxLength={500}
                            {...register("notes")}
                        ></textarea>
                        {errors.notes && (
                            <span style={errorTextStyle}>{errors.notes.message}</span>
                        )}
                    </div>
                    <div style={fieldStyle}>
                        <label htmlFor="priority">Priority:</label>
                        <div style={selectContainerStyle}>
                            <select
                                style={{
                                    ...inputStyle,
                                    ...(errors.priority ? errorInputStyle : {}),
                                }}
                                id="priority"
                                {...register("priority")}
                            >
                                <option value="high">High</option>
                                <option value="medium">Medium</option>
                                <option value="low">Low</option>
                            </select>
                            <div style={selectArrowStyle}></div>
                        </div>
                        {errors.priority && (
                            <span style={errorTextStyle}>{errors.priority.message}</span>
                        )}
                    </div>

                    <input
                                    type="hidden"
                                    {...register('username')}
                                    defaultValue={username}
                                />
                    
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
                        Add Task
                    </button>
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

const selectContainerStyle = {
    position: 'relative',
    display: 'inline-block',
    width: '100%',
};

const selectArrowStyle = {
    position: 'absolute',
    top: '50%',
    right: '8px',
    transform: 'translateY(-70%) translateX(-70%) rotate(-45deg)',
    width: '10px',
    height: '10px',
    borderLeft: '2px solid #103727',
    borderBottom: '2px solid #103727',
    pointerEvents: 'none',
    zIndex: '1',
    transition: 'border-color 0.25s',
};


