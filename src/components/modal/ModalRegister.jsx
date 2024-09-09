import React from 'react';
import './modalRegister.css'; // Asegúrate de que la ruta al CSS sea correcta

function ModalRegister({ event, onClose, children, onRegister, onChildSelect, onCancelRegistration, selectedChildren }) {
  if (!children) return <p>Cargando niños...</p>;

  return (
    <div className="modalRegister-overlay">
      <div className="modalRegister-content">
        {/* Botón de cierre */}
        <button className="close-button" onClick={onClose}>X</button>
        <h2>Registrar niños en el evento {event.title}</h2>
        <p>Selecciona los niños que deseas registrar para el evento.</p>
        <div className="children-table">
          {children.map(child => (
            <div key={child.id} className="children-row">
              <div>{child.first_name}</div>
              <div>{child.date_of_birth}</div>
              <input 
                type="checkbox"
                onChange={() => onChildSelect(child.id)}
                checked={selectedChildren.includes(child.id)}
              />
              <img
                src="/assets/icons/cancel.svg"
                alt="Cancelar Registro"
                className="cancel-icon"
                onClick={() => onCancelRegistration(child.id)}
              />
            </div>
          ))}
        </div>
        <button 
          onClick={onRegister}
          disabled={selectedChildren.length === 0}
        >
          Confirmar Registro
        </button>
        <p className="register-help">
                Si tiene problemas para el registro llámenos al 111-222-333. Muchas gracias.
      </p>
      </div>
     
    </div>
  );
}

export default ModalRegister;
