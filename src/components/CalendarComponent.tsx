import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import Modal from 'react-modal';
import { API_KEY, API_EVALUATION_URL } from '../config/config';
import 'react-calendar/dist/Calendar.css';
import { Evaluation } from '../types';

Modal.setAppElement('#root'); // O el ID de tu App root

const CalendarComponent: React.FC = () => {
    const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [evaluationsOnSelectedDate, setEvaluationsOnSelectedDate] = useState<Evaluation[]>([]);

    // Fetch evaluations from jsonbin.io
    useEffect(() => {
        const fetchEvaluations = async () => {
            try {
                const response = await fetch(API_EVALUATION_URL, {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Master-Key': API_KEY,
                    },
                });

                if (!response.ok) {
                    throw new Error('Error fetching evaluations');
                }

                const data = await response.json();
                setEvaluations(data.record); // Ajusta el acceso dependiendo de cómo se estructura la respuesta de tu API
            } catch (error) {
                console.error(error);
            }
        };

        fetchEvaluations();
    }, []);

    // Filtrar evaluaciones según la fecha seleccionada
    const handleDateClick = (date: Date) => {
        const formattedDate = date.toISOString().slice(0, 10); // Convertir a formato YYYY-MM-DD
        console.log(formattedDate);
        const evaluationsOnDate = evaluations.filter(
            (evaluation) => evaluation.dueDate === formattedDate
        );
        console.log(evaluationsOnDate);
        setEvaluationsOnSelectedDate(evaluationsOnDate);
        setSelectedDate(date);
        setModalIsOpen(true); // Abrir modal con evaluaciones
    };

    // Cerrar el modal
    const closeModal = () => {
        setModalIsOpen(false);
    };

    // Saber si una fecha tiene evaluaciones
    const tileContent = ({ date }: { date: Date }) => {
        const formattedDate = date.toISOString().slice(0, 10);
        const hasEvaluations = evaluations.some(
            (evaluation) => evaluation.dueDate === formattedDate
        );
        return hasEvaluations ? <div style={{ background: 'red', borderRadius: '50%' }}></div> : null;
    };

    const tileClassName = ({ date }: { date: Date }) => {
        const formattedDate = date.toISOString().slice(0, 10); // Convertir la fecha del calendario a YYYY-MM-DD

        // Verificar si alguna evaluación tiene la misma fecha
        const isDueDate = evaluations.some(
            (evaluation) => evaluation.dueDate === formattedDate
        );

        // Si la fecha es una dueDate, retornamos una clase personalizada
        return isDueDate ? 'highlight-red' : null;
    };

    return (
        <div style={{ width: '100%', height: 'auto' }}>
            <Calendar
                onClickDay={handleDateClick}
                tileContent={tileContent}
                tileClassName={tileClassName}
            />
            {/* Modal para mostrar evaluaciones */}
            <Modal
    isOpen={modalIsOpen}
    onRequestClose={closeModal}
    contentLabel="Evaluaciones"
    className="modal-content" // Clase para el contenido del modal
>
    <button
        onClick={closeModal}
        className="modal-close-button" // Clase para el botón de cerrar
    >
        &times; {/* Esta es la X */}
    </button>

    <h2 className="modal-title">
        Evaluaciones hasta el <span className="modal-date">{selectedDate?.toISOString().slice(0, 10)}</span>
    </h2>
    {evaluationsOnSelectedDate.length > 0 ? (
        <ul className="evaluation-list">
            {evaluationsOnSelectedDate.map((evaluation) => (
                <li
                    key={evaluation.id}
                    className="evaluation-item" // Clase para cada evaluación
                >
                    {evaluation.title}
                </li>
            ))}
        </ul>
    ) : (
        <p className="no-evaluations">No hay evaluaciones para esta fecha</p>
    )}
</Modal>
        </div>
    );
};

export default CalendarComponent;