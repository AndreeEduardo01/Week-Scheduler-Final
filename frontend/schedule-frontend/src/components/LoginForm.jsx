import React, { useState } from 'react';

const LoginForm = () => {
  const [dniUser, setDniUser] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [formVisible, setFormVisible] = useState(true);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');

    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dni_user: dniUser, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        setFormVisible(false);
      } else {
        setErrorMessage(data.message);
      }
    } catch (error) {
      console.error('Error en el inicio de sesión:', error);
      setErrorMessage('Error en el servidor. Inténtalo más tarde.');
    }
  };
  if (!formVisible) {
    return <p>Successfully Login !</p>;
  }
  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} id="div-add-task-form">
        <div className="form-group">
          <label htmlFor="dniUser">DNI:</label>
          <input
            type="text"
            id="dniUser"
            value={dniUser}
            onChange={(e) => setDniUser(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        <button type="submit">Iniciar Sesión</button>
      </form>
    </div>
  );
};

export default LoginForm;
