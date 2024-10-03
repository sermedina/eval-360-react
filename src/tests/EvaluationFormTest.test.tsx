import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EvaluationForm from '../components/EvaluationForm';
import { fetchEvaluations } from '../services/evaluationService';
import { fetchAnswers, saveAnswers } from '../services/answerService';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';

// Mock de las funciones de servicio
jest.mock('../services/evaluationService');
jest.mock('../services/answerService');

const mockEvaluation = {
    title: 'Evaluación de Desempeño',
    isCurrent: true,
    questions: [
        { id: 1, label: 'Pregunta de texto', type: 'text' },
        { id: 2, label: 'Pregunta de escala', type: 'scale' },
        { id: 3, label: 'Pregunta de opción múltiple', type: 'multiple-choice', options: ['Opción 1', 'Opción 2'] }
    ]
};

// Mock de evaluaciones
beforeEach(() => {
    window.alert = jest.fn();
    (fetchEvaluations as jest.Mock).mockResolvedValue([mockEvaluation]);
    (fetchAnswers as jest.Mock).mockResolvedValue([]);
});

describe('EvaluationForm', () => {

    const mockUserData = {
        name: 'Usuario de pruebas',
    };

    // Configurar el valor inicial en localStorage
    window.localStorage.setItem('user', JSON.stringify(mockUserData));

    it('should render loading state', async () => {
        render(<MemoryRouter><EvaluationForm /></MemoryRouter>);

        expect(screen.getByText(/Cargando.../i)).toBeInTheDocument();

        // Esperar a que se complete la carga
        await waitFor(() => {
            expect(screen.queryByText(/Cargando.../i)).not.toBeInTheDocument();
        });
    });

    it('should render the evaluation form', async () => {
        render(<MemoryRouter><EvaluationForm /></MemoryRouter>);

        // Esperar a que se cargue la evaluación
        await waitFor(() => {
            expect(screen.getByText(/Evaluación de Desempeño/i)).toBeInTheDocument();
        });

        // Verificar que las preguntas se renderizan correctamente
        expect(screen.getByText(/Pregunta de texto/i)).toBeInTheDocument();
        expect(screen.getByText(/Pregunta de escala/i)).toBeInTheDocument();
        expect(screen.getByText(/Pregunta de opción múltiple/i)).toBeInTheDocument();
    });

    it('should handle text input change', async () => {
        render(<MemoryRouter><EvaluationForm /></MemoryRouter>);

        await waitFor(() => screen.getByText(/Evaluación de Desempeño/i));

        const textInput = screen.getByPlaceholderText(/Ingresa tu respuesta/i) as HTMLInputElement;
        fireEvent.change(textInput, { target: { value: 'Mi respuesta' } });
        expect(textInput.value).toBe('Mi respuesta');
    });

    it('should handle scale input change', async () => {
        render(<MemoryRouter><EvaluationForm /></MemoryRouter>);

        await waitFor(() => screen.getByText(/Pregunta de escala/i));

        const rangeInput = screen.getByRole('slider') as HTMLInputElement;

        // Simular cambio en la escala
        fireEvent.change(rangeInput, { target: { value: 5 } });
        expect(rangeInput.value).toBe('5');
    });

    it('should handle multiple-choice input change', async () => {
        render(<MemoryRouter><EvaluationForm /></MemoryRouter>);

        await waitFor(() => screen.getByText(/Pregunta de opción múltiple/i));

        const selectInput = screen.getByRole('combobox') as HTMLSelectElement;

        // Simular cambio en el select
        fireEvent.change(selectInput, { target: { value: 'Opción 2' } });
        expect(selectInput.value).toBe('Opción 2');
    });

    it('should show validation error if fields are empty', async () => {
        render(<MemoryRouter><EvaluationForm /></MemoryRouter>);

        await waitFor(() => screen.getByText(/Evaluación de Desempeño/i));

        // Intentar enviar el formulario sin completar
        fireEvent.submit(screen.getByRole('button', { name: /guardar/i }));

        // Verificar que se llamó a alert con el mensaje correcto
        expect(window.alert).toHaveBeenCalledWith('Por favor, completa todos los campos.');

    });

    it('should submit the form with filled fields', async () => {
        render(<MemoryRouter><EvaluationForm /></MemoryRouter>);

        await waitFor(() => screen.getByText(/Evaluación de Desempeño/i));

        // Llenar los campos del formulario
        const textInput = screen.getByPlaceholderText(/Ingresa tu respuesta/i);
        fireEvent.change(textInput, { target: { value: 'Mi respuesta' } });

        const rangeInput = screen.getByRole('slider');
        fireEvent.change(rangeInput, { target: { value: 7 } });

        const selectInput = screen.getByRole('combobox');
        fireEvent.change(selectInput, { target: { value: 'Opción 1' } });

        const submitButton = screen.getByText(/Guardar/i);

        // Simular envío del formulario
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(saveAnswers).toHaveBeenCalled(); // Verificar que se llamó a `saveAnswers`
        });
    });
});