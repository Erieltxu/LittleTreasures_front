import React from 'react';
import './modalTitle.css'; // Asegúrate de que la ruta al CSS sea correcta

function ModalTitle({ event, onClose }) {
  return (
    <div className="modalTitle-overlay">
      <div className="modalTitle-content">
        {/* Botón de cierre */}
        <button className="close-button" onClick={onClose}>X</button>
        
        {/* Contenido del modal */}
        {event ? (
          <div>
            <h2>{`Evento: ${event.title}`}</h2>
            <p>{event.description}</p>
            <p>{`Fecha: ${event.date}`}</p>
            <p>{`Plazas disponibles: ${event.remaining_spots}`}</p>
          </div>
        ) : (
          <p>No se ha seleccionado ningún evento.</p>
        )}
      </div>
    </div>
  );
}

export default ModalTitle;
