import Navbar from '../../components/navbar';
import  { useEffect, useState } from 'react';
import axios from 'axios';
import Task from '../../components/task';
import { useAuthUser, } from 'react-auth-kit';
import { useNavigate } from "react-router-dom";


const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const authUser = useAuthUser();
  const username = authUser()?.username || '';
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');

const fetchPosts = () => {
  axios.get(`http://localhost:3000/tasks/${username}`)
  .then(response => {
    setTasks(response.data);
    console.log(response.data);
  })
  .catch(error => {
    console.error('Error while fetching tasks:', error);
  });
}

const filteredTasks = tasks.filter(task => {
  if (filter === 'all') {
    return true;
  } else if (filter === 'todo') {
    return task.status === 'todo';
  } else if (filter === 'inprogress') {
    return task.status === 'inprogress';
  } else if (filter === 'completed') {
    return task.status === 'completed';
  }
  return false;
});


  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div>
      {tasks.length !== 0 &&
       <div style={{ 
        marginBottom: '20px',
        display: 'flex',
         }}>
        <div 
        style={
          filter === 'all'
          ? {...filterButtonStyles, backgroundColor: '#A5CFB9', color: '#103727'}
          : filterButtonStyles
        }
        onClick={() => setFilter('all')}>All</div>
        <div 
          style={
            filter === 'todo'
            ? {...filterButtonStyles, backgroundColor: '#A5CFB9', color: '#103727'}
            : filterButtonStyles
          }
        onClick={() => setFilter('todo')}>Todo</div>
        <div 
          style={
            filter === 'inprogress'
            ? {...filterButtonStyles, backgroundColor: '#A5CFB9', color: '#103727'}
            : filterButtonStyles
          }
        onClick={() => setFilter('inprogress')}>In Progress</div>
        <div 
            style={
              filter === 'completed'
              ? {...filterButtonStyles, backgroundColor: '#A5CFB9', color: '#103727'}
              : filterButtonStyles
            }
        onClick={() => setFilter('completed')}>Done</div>
      </div>}
    
    <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start'}}>
      {filteredTasks.map(task => (
        <Task 
          key={task.id}
          id={task.id}
          taskName={task.taskName}
          deadline={task.deadline}
          notes={task.notes}
          priority={task.priority}
          status={task.status}
          subtasks={task.subtasks}
          fetchPosts={fetchPosts}
        
        />
      ))}
      {tasks.length === 0 && 
      <div
        style={{
          color: 'white',
          fontWeight: 'bold',
          fontSize: 40,
          textAlign: 'center',
        }}
      >
        <div>
          No tasks found.
          </div>
      <div
        style={{
          textDecoration: 'underline',
          cursor: 'pointer'
        }}
        onClick={() => navigate('/addTask')}
      >
         Start by adding some
        </div>
      </div>
      }
    </div>
    </div>
  );
};

export default function Main() {
  return (
    <>
      <Navbar mode='auth' />
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '100px'}}>
        <TaskList />
      </div>
    </>
  );
}

const filterButtonStyles = {
  backgroundColor: '#103727',
  padding: 10,
  borderRadius: 5,
  color: 'white',
  cursor: 'pointer',
  margin: 10,
}