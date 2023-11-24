/* eslint-disable react/prop-types */
import {AiOutlinePlus} from 'react-icons/ai'
import {FiSquare, FiCheck} from 'react-icons/fi'
import {IoCloseSharp} from 'react-icons/io5'
import {  useState } from 'react';
import axios from 'axios';
import { schema } from './validationSchema';
import { useAuthUser, } from 'react-auth-kit';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

export default function Task({
    id, 
    taskName, 
    deadline, 
    notes, 
    priority, 
    status,
    subtasks,
    fetchPosts
}) {
    const [isButtonHovered, setButtonHovered] = useState(false);
    const [isSubtaskHovered, setSubtaskHovered] = useState(false);
    const [inputVisible, setInputVisible] = useState(false);
    const authUser = useAuthUser();
    const username = authUser()?.username || '';

    const {
        register,
        handleSubmit,
        reset,
        setError,
    } = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmit = async (data) => {
        console.log(data)
        try {
            const updatedData = {
                ...data,
                username: username,
            };
            const response = await axios.post(`http://localhost:3000/tasks/${id}/subtasks`, updatedData)
            console.log("Response: ", response);
            reset();
            setInputVisible(false)
            fetchPosts();  
        } catch (error) {
            if (error.response) {
                setError("content", { message: error.response.data });
                console.log(error)
            } else {
                setError("content", { message: "An error occurred. Please try again later." });
            }
        }

    };
    

    const deleteSubtask = (subtaskId) => {
        axios.delete(`http://localhost:3000/subtasks/${subtaskId}`)
        .then(response => {
            console.log(response);
            fetchPosts();
        })
        .catch(error => {
            console.log(error);
        })
    } 

    const updateSubtask = (subtaskId) => {
        axios.put(`http://localhost:3000/subtasks/${subtaskId}/toggleStatus`)
        .then(response => {
            console.log(response);
            fetchPosts();
        })
        .catch(error => {
            console.log(error);
        })
    } 

    const updateTask = (taskId, changeToStatus) => {
        if(!(status === changeToStatus)) {
            axios.put(`http://localhost:3000/tasks/${taskId}/${changeToStatus}`)
            .then(response => {
                console.log(response);
                fetchPosts();
            })
            .catch(error => {
                console.log(error);
            })
        } 
    }

    const deleteTask = (taskId) => {
        axios.delete(`http://localhost:3000/tasks/${taskId}`)
        .then(response => {
            console.log(response);
            fetchPosts();
        })
        .catch(error => {
            console.log(error);
        })
    }

  return (
    <div style={taskContainer}>
     
        <div>
        <div style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 10,
        }}>
            <div 
            style={
                status === 'todo' ? 
                {backgroundColor: '#103727', color: "white", ...statusItem} : 
                {...statusItem}
            }
            onClick={() => updateTask(id, 'todo')}
            >Todo</div>
            <div 
            style={
                status === 'inprogress' ? 
                {backgroundColor: '#103727', color: "white", ...statusItem} : 
                {...statusItem}
             
            }
            onClick={() => updateTask(id, 'inprogress')}
            >In Progress</div>
            <div 
            style={
                status === 'completed' ? 
                {backgroundColor: '#103727', color: "white", ...statusItem} : 
                {...statusItem}
             
            }
            onClick={() => updateTask(id, 'completed')}
            >Done</div>
        </div>
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
        }}>
      <h3 style={
            status === 'completed' ?
            {
                textDecoration: 'line-through',
                textDecorationThickness: 2,
            } : null
        }>{taskName}</h3>
        {status === 'completed' ?
                <IoCloseSharp 
                    style={{
                        width: 20,
                        height: 20,
                        cursor: 'pointer',
                    }}
                    onClick={() => deleteTask(id)}
                /> : <div 
                style={{
                    width: 20,
                    height: 20,
                }}
                />}
        </div>
      <p>{deadline.split('T')[0]}</p>
      <div style={{flexWrap: 'wrap'}}>{notes}</div>
      <p>Priority: {priority}</p>
      </div>
      <div>
        {subtasks.length > 0 && (
            <div style={{marginTop: 10, marginBottom: 20}}>
            <div  
            style={{
                fontWeight: 'bold', 
                }}
                >Subtasks:</div>
            {subtasks.map((subtask) => (
            <div 
            key={subtask.id}
            style={
                isSubtaskHovered
                    ? { ...subtaskStyle, ...subtaskHoverStyle }
                    : { ...subtaskStyle }
            }
            onMouseEnter={() => setSubtaskHovered(true)}
            onMouseLeave={() => setSubtaskHovered(false)}
            >
                {subtask.status === 'todo' ?
                <FiSquare 
                style={{
                    width: 20,
                    height: 20,
                    cursor: 'pointer'
                }}
                onClick={() => updateSubtask(subtask.id)}
                />  : 
                <FiCheck
                style={{
                    width: 20,
                    height: 20,
                    cursor: 'pointer'
                }}
                onClick={() => updateSubtask(subtask.id)}
                /> }
                <p style={
                    subtask.status === 'completed' ?
                    {
                        textDecoration: 'line-through',
                    } : null
                }>{subtask.content}</p>
                {isSubtaskHovered ?
                <IoCloseSharp 
                    style={{
                        width: 20,
                        height: 20,
                        cursor: 'pointer',
                    }}
                    onClick={() => deleteSubtask(subtask.id)}
                /> : <div 
                style={{
                    width: 20,
                    height: 20,
                }}
                />}
            </div>
            ))}
            </div>
        )}
        </div>

      {inputVisible ? 
      <div style={inputContainer}>
      <input 
        type="text" 
        placeholder="Enter subtask"
        {...register('content')}
        style={inputStyle}
        onKeyDown={(event) => {
            if (event.key === 'Enter') {
                console.log("lala")
                handleSubmit(onSubmit)();
              }
        }}
      />
      <IoCloseSharp 
      style={{
        width: 25,
        height: 25,
        cursor: 'pointer'
      }}
      onClick={() => setInputVisible(false)}
      />
      </div> :
      <div 
        style={
            isButtonHovered
                ? { ...addSubtask, ...buttonHoverStyle }
                : { ...addSubtask }
        }
        onMouseEnter={() => setButtonHovered(true)}
        onMouseLeave={() => setButtonHovered(false)}
        onClick={() => setInputVisible(true)}
        >
        <AiOutlinePlus style={{ marginRight: 5}}/>
        Add subtask
      </div>}
    </div>
  );
}

const taskContainer = {
    backgroundColor: '#729A85',
    borderRadius: 5,
    padding: 20,
    margin: 20,
    minWidth: 300,
    maxWidth: 500,
    flexDirection: 'column',
    justifyContent: 'space-between',
    display: 'flex',
    flexGrow: 1,
    overflowY: 'auto',
  };
  

const addSubtask = {
    borderBottom: '1px solid #103727',
    padding: 5,
    display: 'flex',
    alignItems: 'center',
    marginTop: 10,
    maxHeight: 35
}

const buttonHoverStyle = {
    backgroundColor: '#A5CFB9',
    borderRadius: 5,
    cursor: 'pointer',
  };
  
  const subtaskHoverStyle = {
    backgroundColor: '#A5CFB9',
    borderRadius: 5,
  };

const inputContainer = {
    borderBottom: '1px solid #103727',
    paddingTop: 5,
    paddingBottom: 5,
    display: 'flex',
    alignItems: 'center',
    marginTop: 10,
    maxHeight: 35
}

const inputStyle = {
    WebkitAppearance: 'none',
    backgroundColor: '#A5CFB9',
    border: '1px solid #A5CFB9',
    color: '#000',
    width: '100%',
    padding: 5,
    fontSize: '0.9em',
    fontFamily: 'Source Sans Pro, sans-serif',
    borderRadius: 5,
    outline: 'none',
    transition: 'background 0.25s, border-color 0.25s, color 0.25s',
    marginRight: 5,
    maxHeight: 35
};

const subtaskStyle = {
    borderTop: '1px solid #103727',
    marginLeft: 10,
    marginRight: 10,
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
};

const statusItem = {
    fontWeight: 'bold',
    borderRight: '1px solid #103727',
    borderLeft: '1px solid #103727',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
    cursor: 'pointer',
    borderRadius: 5,
}