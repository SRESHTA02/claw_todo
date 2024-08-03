import React, { useState } from 'react';
import Register from './components/Register/Register';
import Login from './components/login/Login';
import TodoList from './components/TodoList';

function App() {
  const [token, setToken] = useState('');

  return (
    <div className="App">
      <h1>Todo App</h1>
      {!token ? (
        <>
          <Register />
          <Login setToken={setToken} />
        </>
      ) : (
        <TodoList token={token} />
      )}
    </div>
  );
}

export default App;
