import React, { useState, useEffect } from 'react';
import UseApi from '../services/useApi';  // Asegúrate de que la ruta a UseApi sea correcta
import './events.css'; 
import { EVENTS_API } from '../config/urls';

function Events() {
  const { data: events, loading, error } = UseApi({ apiEndpoint: EVENTS_API });
  const { data: children } = UseApi({ apiEndpoint: '/api/profile/children/' });  // Obtener los hijos del usuario
  const [selectedEvent, setSelectedEvent] = useState(null);  // Para mostrar el popup con la descripción
  const [selectedChildren, setSelectedChildren] = useState([]);  // Para seleccionar los hijos en el formulario
  
  // Función para inscribir a los hijos en el evento
  const handleRegister = (eventId) => {
    UseApi({
      apiEndpoint: '/api/registrations/',
      method: 'POST',
      body: {
        event: eventId,
        children: selectedChildren
      }
    });
  };

  if (loading) return <p>Cargando eventos...</p>;
if (error) return <p>Error al cargar eventos: {error}</p>;

console.log('Eventos:', events);  // Añade esto para verificar los datos

return (
  <div className="events-page">
    <h1>Lista de Eventos</h1>
    {loading && <p>Cargando eventos...</p>}
    {error && <p>Error: {error}</p>}
    {!loading && events && Array.isArray(events) && (
      <div className="events-grid">
        {/* Encabezado de la tabla */}
        <div className="events-row events-header">
          <div className="event-column">Nombre del Evento</div>
          <div className="event-column">Fecha del Evento</div>
          <div className="event-column">Plazas Libres</div>
          <div className="event-column">Acciones</div>
        </div>

        {/* Filas de eventos */}
        {events.map((event, index) => (
          <div className="events-row" key={index}>
            <div className="event-column" onClick={() => setSelectedEvent(event)}>
              {event.title}
            </div>
            <div className="event-column">{event.date}</div>
            <div className="event-column">{event.remaining_spots > 0 ? event.remaining_spots : 'No hay plazas'}</div>
            <div className="event-column">
              <button 
                className="event-button"
                onClick={() => handleRegister(event.id)}
                disabled={event.remaining_spots === 0}
              >
                Apuntarse
              </button>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);
}

export default Events;
