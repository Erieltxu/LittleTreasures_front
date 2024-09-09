import React, { useState, useEffect } from 'react';
import UseApi from '../services/useApi';
import './events.css';
import { EVENTS_API, CHILDREN_API, REGISTRATIONS_API } from '../config/urls';
import ModalRegister from '../components/modal/ModalRegister'; // Importamos el modal de registro
import ModalTitle from '../components/modal/ModalTitle'; // Modal para el título del evento

function Events() {
  const { data: events, loading: eventsLoading, error: eventsError } = UseApi({ apiEndpoint: EVENTS_API });
  const { data: children = [], loading: childrenLoading, error: childrenError } = UseApi({ apiEndpoint: CHILDREN_API });
  const [selectedEvent, setSelectedEvent] = useState(null); // Para el evento seleccionado
  const [selectedChildren, setSelectedChildren] = useState([]); // Para los niños seleccionados
  const [showModalTitle, setShowModalTitle] = useState(false); // Controla el modal del título del evento
  const [showModalRegister, setShowModalRegister] = useState(false); // Controla el modal de registro

  useEffect(() => {
    // Aquí podrías hacer una llamada a la API para obtener el estado actual de las inscripciones
  }, []);

  // Lógica para manejar el clic en el evento (mostrar detalles)
  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShowModalTitle(true);
  };

  // Lógica para manejar el clic en "Apuntarse" (mostrar modal de registro)
  const handleRegisterClick = (event) => {
    setSelectedEvent(event);
    setSelectedChildren([]); // Limpiar los niños seleccionados al abrir el modal
    setShowModalRegister(true);
  };

  // Lógica para registrar a los niños
  const handleRegister = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(REGISTRATIONS_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Token ${token}` : ''
        },
        body: JSON.stringify({
          event: selectedEvent.id,
          children: selectedChildren
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error en la respuesta:', errorData);
      } else {
        setShowModalRegister(false); // Cerrar el modal después del registro
      }
    } catch (error) {
      console.error('Error registrando niños:', error);
    }
  };

  const handleChildSelection = (childId) => {
    setSelectedChildren((prevChildren) => {
      if (prevChildren.includes(childId)) {
        return prevChildren.filter((id) => id !== childId);
      } else {
        return [...prevChildren, childId];
      }
    });
  };

  const handleCancelRegistration = async (childId) => {
    const token = localStorage.getItem('token');
    try {
      await fetch(`${REGISTRATIONS_API}/${childId}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Token ${token}` : ''
        }
      });
      setSelectedChildren((prevChildren) => prevChildren.filter((id) => id !== childId));
    } catch (error) {
      console.error('Error cancelando registro:', error);
    }
  };

  if (eventsLoading) return <p>Cargando eventos...</p>;
  if (eventsError) return <p>Error al cargar eventos: {eventsError}</p>;

  return (
    <div className="events-page">
      <h1>Lista de Eventos</h1>
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
              <div 
                className="event-column event-name" 
                onClick={() => handleEventClick(event)}
              >
                {event.title}
              </div>
              <div className="event-column">{event.date}</div>
              <div className="event-column">
                {event.spots > 0 ? event.spots : 'No hay plazas'}
              </div>
              <div className="event-column">
                <button 
                  className="event-button"
                  onClick={() => handleRegisterClick(event)}
                >
                  Apuntarse
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal para el título del evento */}
      {showModalTitle && selectedEvent && (
        <ModalTitle 
          event={selectedEvent} 
          onClose={() => setShowModalTitle(false)}
        />
      )}

      {/* Modal para el registro de niños */}
      {showModalRegister && selectedEvent && (
        <ModalRegister
          event={selectedEvent}
          onClose={() => setShowModalRegister(false)}
          onRegister={handleRegister}
          children={children}
          onChildSelect={handleChildSelection}
          onCancelRegistration={handleCancelRegistration}
          selectedChildren={selectedChildren}
        />
      )}
    </div>
  );
}

export default Events;
