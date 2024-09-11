import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import UseApi from '../services/useApi';
import { IS_ADMIN_API, EVENTS_API } from '../config/urls';
import './createEvent.css'; 

function CreateEvent() {
  const navigate = useNavigate(); 
  const [isAdmin, setIsAdmin] = useState(false);
  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    date: '',
    spots: 0,
  });
  const [createError, setCreateError] = useState(null);

  const { data: adminData, loading: adminLoading, error: adminError } = UseApi({ apiEndpoint: IS_ADMIN_API });

  useEffect(() => {
    if (adminData && adminData.is_admin) {
      setIsAdmin(adminData.is_admin);
    }
  }, [adminData]);

  const handleChange = (e) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(EVENTS_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear el evento');
      }

      alert('Evento creado con éxito');
      setEventData({
        title: '',
        description: '',
        date: '',
        spots: '',
      });
    } catch (error) {
      setCreateError(error.message);
    }
  };

  if (adminLoading) return <p>Verificando permisos...</p>;
  if (adminError || !isAdmin) return <p>No tienes permisos para crear eventos.</p>;

  return (
    <div className="create-event-page">
      <div className="back-arrow" onClick={() => navigate(-1)}>
        <img src="/assets/icons/Arrow.svg" alt="Volver" className="arrow-icon" />
      </div>

      <h1>Crear nuevo evento</h1>

      <form onSubmit={handleSubmit} className="create-event-form">
        <label>
          Título:
          <input
            type="text"
            name="title"
            value={eventData.title}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Descripción:
          <textarea
            name="description"
            value={eventData.description}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Fecha:
          <input
            type="date"
            name="date"
            value={eventData.date}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Plazas:
          <input
            type="number"
            name="spots"
            value={eventData.spots}
            onChange={handleChange}
            required
            min="1"
            max="3"
          />
        </label>
        <button type="submit">Crear Evento</button>
        {createError && <p className="error">{createError}</p>}
      </form>
    </div>
  );
}

export default CreateEvent;
