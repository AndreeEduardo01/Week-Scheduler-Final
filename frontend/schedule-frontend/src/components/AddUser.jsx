import React, { useState,useEffect } from 'react';
const UserForm = () => {
  const [nameUser, setNameUser] = useState('');
  const [pswdUser, setPswdUser] = useState('');
  const [lastNameUser, setLastNameUser] = useState('');
  const [dniUser, setdniUser] = useState('');
  const [birthdayUser, setbirthdayUser] = useState('');
  const [roleUser, setRoleUser] = useState('');
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState('');
  const [formVisible, setFormVisible] = useState(true);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch('/roles'); 
        const data = await response.json();
        setRoles(data);
      } catch (error) {
        console.error('Error fetching roles:', error);
      }
    };

    fetchRoles();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nameUser || !lastNameUser || !dniUser || !birthdayUser || !roleUser) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    const user = {
      password: pswdUser,
      id_role: roleUser,
      name_user: nameUser,
      lastname_user: lastNameUser,
      dni_user: parseInt(dniUser),
      birthday: birthdayUser,
    };

    try {
      const response = await fetch('/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });
      if (response.ok) {
        setNameUser('');
        setPswdUser('');
        setLastNameUser('');
        setdniUser('');
        setbirthdayUser('');
        setRoleUser('');
        setError('');
        setFormVisible(false);
      } else {
        setError('Error al crear la tarea.');
      }
    } catch (error) {
      setError('Error en la solicitud.');
    }
  };
  if (!formVisible) {
    return <p>Succesfully Signed In !</p>; 
  }

  return (
    <form onSubmit={handleSubmit} id="div-add-task-form">
      <h2>Sign In !</h2>
      <div className="form-group">
        <label>Name: </label>
        <input
          type="text"
          value={nameUser}
          onChange={(e) => setNameUser(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Last Name: </label>
        <input
          type="text"
          value={lastNameUser}
          onChange={(e) => setLastNameUser(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>DNI: </label>
        <input
          type="text"
          value={dniUser}
          onChange={(e) => setdniUser(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Password: </label>
        <input
          type="password"
          value={pswdUser}
          onChange={(e) => setPswdUser(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Bithday: </label>
        <input
          type="date"
          value={birthdayUser}
          onChange={(e) => setbirthdayUser(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Role: </label>
        <select
          value={roleUser}
          onChange={(e) => setRoleUser(e.target.value)}
        >
          <option value="">Seleccione un rol</option>
          {roles.map((role) => (
            <option key={role.id_role} value={role.id_role}>
              {role.name_role}
            </option>
          ))}
        </select>
      </div>
      <button type="submit">Add user</button>
      {error && <p>{error}</p>}
    </form>
  );
};

export default UserForm;