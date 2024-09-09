import React, { useState, useEffect } from 'react';
import UseApi from '../services/useApi';
import { IS_ADMIN_API, EVENTS_API } from '../config/urls';
import './events.css'; 
import { useNavigate } from 'react-router-dom'; 

function Events() {
  const { data: events, loading: eventsLoading, error: eventsError } = UseApi({ apiEndpoint: EVENTS_API });
  const [selectedEvent, setSelectedEvent] = useState(null); 
  const [isAdmin, setIsAdmin] = useState(false); 
  const navigate = useNavigate(); 


  const { data: adminData, loading: adminLoading, error: adminError } = UseApi({ apiEndpoint: IS_ADMIN_API });

  useEffect(() => {
    if (adminData && adminData.is_admin) {
      setIsAdmin(adminData.is_admin);
    }
  }, [adminData]);

  
  const handleCreateEventClick = () => {
    navigate('/create-event'); 
  };

 
  const handleEventChangesClick = () => {
    navigate('/event-changes'); 
  };

  if (eventsLoading) return <p>Cargando eventos...</p>;
  if (eventsError) return <p>Error al cargar eventos: {eventsError}</p>;

  return (
    <div className="events-page">
      {isAdmin && (
        <div className="admin-buttons">
          <button onClick={handleCreateEventClick}>Crear Evento</button>
          <button onClick={handleEventChangesClick}>Cambios en Eventos</button>
        </div>
      )}

      <h2>Lista de Eventos</h2>
      {(!eventsLoading && events && Array.isArray(events)) && (
        <div className="events-grid">
          <div className="events-row events-header">
            <div className="event-column">Nombre del Evento</div>
            <div className="event-column">Fecha del Evento</div>
            <div className="event-column">Plazas Libres</div>
            <div className="event-column">Acciones</div>
          </div>

          {events.map((event) => (
            <div className="events-row" key={event.id}>
              <div className="event-column event-name">{event.title}</div>
              <div className="event-column">{event.date}</div>
              <div className="event-column">
                {event.spots > 0 ? event.spots : 'No hay plazas'}
              </div>
              <div className="event-column">
                <button className="event-button">Apuntarse</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Events;
