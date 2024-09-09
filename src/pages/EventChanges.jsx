import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UseApi from '../services/useApi';
import { EVENTS_API } from '../config/urls';
import './eventChanges.css';

function EventChanges() {
  const { data: events, loading: eventsLoading, error: eventsError } = UseApi({ apiEndpoint: EVENTS_API });
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [updatedEvent, setUpdatedEvent] = useState({ title: '', description: '', date: '', spots: 3 });
  const [updateError, setUpdateError] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [showModal, setShowModal] = useState(false); 
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedEvent) {
      setUpdatedEvent({
        title: selectedEvent.title,
        description: selectedEvent.description,
        date: selectedEvent.date,
        spots: selectedEvent.spots,
      });
    }
  }, [selectedEvent]);

  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setUpdatedEvent({ ...updatedEvent, [name]: value });
  };

  const handleEventUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`${EVENTS_API}${selectedEvent.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(updatedEvent),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setUpdateError(errorData.message || 'Error al actualizar el evento');
      } else {
        alert('Evento actualizado con éxito');
        setShowModal(false); 
      }
    } catch (error) {
      setUpdateError(error.message);
    }
  };

  const handleEventDelete = async (eventId) => {
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`${EVENTS_API}${eventId}/`, {
        method: 'DELETE',
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        setDeleteError(errorData.message || 'Error al eliminar el evento');
      } else {
        alert('Evento eliminado con éxito');
        setSelectedEvent(null); 
        setShowModal(false); 
      }
    } catch (error) {
      setDeleteError(error.message);
    }
  };


  const handleBackClick = () => {
    navigate(-1); 
  };

  
  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };


  const handleCloseModal = () => {
    setSelectedEvent(null);
    setShowModal(false);
  };

  if (eventsLoading) return <p>Cargando eventos...</p>;
  if (eventsError) return <p>Error al cargar eventos: {eventsError}</p>;

  return (
    <div className="event-changes-page">
      <div className="back-arrow" onClick={handleBackClick}>
        <img src="/assets/icons/Arrow.svg" alt="Volver" className="arrow-icon" />
      </div>
      <h2>Cambios en Eventos</h2>

      {!showModal && (
        <div className="events-list">
          <h3>Selecciona un evento para editar o eliminar</h3>
          {events.map((event) => (
            <div key={event.id} className="event-item" onClick={() => handleEventClick(event)}>
              <p>{event.title}</p>
              <p>{event.date}</p>
              <p>Plazas: {event.spots}</p>
            </div>
          ))}
        </div>
      )}

      {showModal && selectedEvent && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-button" onClick={handleCloseModal}>X</button>
            <h2>Editar Evento: {selectedEvent.title}</h2>
            <form onSubmit={handleEventUpdate}>
              <label>
                Título:
                <input type="text" name="title" value={updatedEvent.title} onChange={handleUpdateChange} required />
              </label>
              <label>
                Descripción:
                <textarea name="description" value={updatedEvent.description} onChange={handleUpdateChange} required />
              </label>
              <label>
                Fecha:
                <input type="date" name="date" value={updatedEvent.date} onChange={handleUpdateChange} required />
              </label>
              <label>
                Plazas:
                <input type="number" name="spots" value={updatedEvent.spots} onChange={handleUpdateChange} required min="1" max="3" />
              </label>
              <button type="submit">Actualizar Evento</button>
              {updateError && <p className="error">{updateError}</p>}
            </form>
            <button className="delete-button" onClick={() => handleEventDelete(selectedEvent.id)}>
              Eliminar Evento
            </button>
            {deleteError && <p className="error">{deleteError}</p>}
          </div>
        </div>
      )}
    </div>
  );
}

export default EventChanges;
