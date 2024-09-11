import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UseApi from '../services/useApi';
import { USER_DETAIL, UPDATE_USER, DELETE_USER } from '../config/urls';
import './profile.css';

function Profile({ onLogout }) {
    const [user, setUser] = useState({
        username: '',
        email: '',
        password: '',
        confirm_password: '',
        current_password: '',
        first_name: '',
        last_name: '',
    });
    const [child, setChild] = useState({
        first_name: '',
        date_of_birth: '',
    });
    const [children, setChildren] = useState([]);
    const [isConfirmed, setIsConfirmed] = useState(false);
    const { data: userData, loading: userLoading, error: userError } = UseApi({ apiEndpoint: USER_DETAIL });
    const [updateError, setUpdateError] = useState(null);
    const [deleteError, setDeleteError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isChildSubmitting, setIsChildSubmitting] = useState(false);
    const [childError, setChildError] = useState(null);

    const navigate = useNavigate();
    
    useEffect(() => {
        if (userData) {
            setUser({
                username: userData.username || '',
                email: userData.email || '',
                password: '',
                confirm_password: '',
                current_password: '',
                first_name: userData.first_name || '',
                last_name: userData.last_name || ''
            });
            setChildren(userData.children || []);
        }
    }, [userData]);

    const handleBackToHome = () => {
        navigate('/HomeLogin');
    };

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleChildChange = (e) => {
        setChild({ ...child, [e.target.name]: e.target.value });
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const updatedData = {
                username: user.username,
                email: user.email,
                current_password: user.current_password,
                ...(user.password && { password: user.password, confirm_password: user.confirm_password }),
            };

            const response = await fetch(UPDATE_USER, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Token ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(updatedData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error('Failed to update profile');
            }

            const data = await response.json();
        } catch (error) {
            setUpdateError(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAddChild = async (e) => {
        e.preventDefault();
        setIsChildSubmitting(true);
        setChildError(null);
    
        if (!userData || !userData.id) {
            setChildError("No se pudo obtener el ID del usuario. Inténtalo de nuevo más tarde.");
            setIsChildSubmitting(false);
            return;
        }
    
        try {
            const childData = {
                first_name: child.first_name,
                date_of_birth: child.date_of_birth,
                user: userData.id,
            };
    
            const response = await fetch('http://127.0.0.1:8000/api/v1/children/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Token ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(childData),
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error('Failed to add child');
            }
    
            const data = await response.json();
            setChildren((prevChildren) => [...prevChildren, data]);
            setChild({ first_name: '', date_of_birth: '' });
        } catch (error) {
            setChildError(error.message);
        } finally {
            setIsChildSubmitting(false);
        }
    };

    const handleDeleteChild = async (childId) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/v1/children/${childId}/`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Token ${localStorage.getItem('token')}`,
                },
            });
    
            if (!response.ok) {
                throw new Error('Failed to delete child');
            }
    
            setChildren((prevChildren) => prevChildren.filter(child => child.id !== childId));
        } catch (error) {
        }
    };

    const handleDeleteProfile = async () => {
        if (!isConfirmed) return;
        try {
            const response = await fetch(DELETE_USER, {
                method: 'DELETE',
                headers: {
                    Authorization: `Token ${localStorage.getItem('token')}`,
                },
            });
            if (!response.ok) {
                throw new Error('Failed to delete profile');
            }

            localStorage.removeItem('token');
            onLogout();
            navigate('/');
        } catch (error) {
            setDeleteError(error.message);
        }
    };

    const handleCheckboxChange = (e) => {
        setIsConfirmed(e.target.checked);
    };

    return (
        <div className="profile-container">
            <div className="back-arrow" onClick={handleBackToHome}>
                <img src="/assets/icons/Arrow.svg" alt="Back to HomeLogin" className="arrow-icon" />
            </div>

            <h2 className="profile-title">Bienvenido, {user.username}</h2>

            <div className="form-scroll"> 
                <form onSubmit={handleUpdateProfile}>
                    <label>
                        Nombre:
                        <input
                            type="text"
                            name="first_name"
                            value={user.first_name}
                            className="non-editable"
                            readOnly
                        />
                    </label>
                    <label>
                        Apellido:
                        <input
                            type="text"
                            name="last_name"
                            value={user.last_name}
                            className="non-editable"
                            readOnly
                        />
                    </label>
                    <label>
                        Nombre de usuario:
                        <input
                            type="text"
                            name="username"
                            value={user.username}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Correo electrónico:
                        <input
                            type="email"
                            name="email"
                            value={user.email}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Contraseña actual:
                        <input
                            type="password"
                            name="current_password"
                            value={user.current_password}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Nueva contraseña:
                        <input
                            type="password"
                            name="password"
                            value={user.password}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        Confirmar nueva contraseña:
                        <input
                            type="password"
                            name="confirm_password"
                            value={user.confirm_password}
                            onChange={handleChange}
                        />
                    </label>
                    <button type="submit" disabled={isSubmitting}>Actualizar perfil</button>
                    {updateError && <p className="error">{updateError}</p>}
                </form>

                <div className="add-child-section">
                    <h3>Añadir Hijo</h3>
                    <form onSubmit={handleAddChild}>
                        <label>
                            Nombre:
                            <input
                                type="text"
                                name="first_name"
                                value={child.first_name}
                                onChange={handleChildChange}
                                required
                            />
                        </label>
                        <label>
                            Fecha de Nacimiento:
                            <input
                                type="date"
                                name="date_of_birth"
                                value={child.date_of_birth}
                                onChange={handleChildChange}
                                required
                            />
                        </label>
                        <button type="submit">Añadir Hijo</button>
                        {childError && <p className="error">{childError}</p>}
                    </form>
                </div>

                {children.length > 0 ? (
                    <div className="children-list">
                        <h3>Hijos:</h3>
                        <ul>
                            {children.map((child) => (
                                <li key={child.id}>
                                    {child.first_name} - {child.date_of_birth}
                                    <button onClick={() => handleDeleteChild(child.id)}>Eliminar</button>
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <p>No se han añadido hijos aún.</p>
                )}

                <div className="delete-profile-section">
                    <label>
                        <input
                            type="checkbox"
                            checked={isConfirmed}
                            onChange={handleCheckboxChange}
                        />
                        Confirmar borrar perfil
                    </label>
                    <br />
                    <button onClick={handleDeleteProfile} disabled={!isConfirmed || isSubmitting}>
                        Borrar perfil
                    </button>
                    {deleteError && <p className="error">{deleteError}</p>}
                </div>
            </div>
        </div>
    );
}

export default Profile;
