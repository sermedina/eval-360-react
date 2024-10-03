import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Dashboard from '../components/Dashboard';
import { fetchEvaluations } from '../services/evaluationService';
import { fetchAnswers } from '../services/answerService';
import { MemoryRouter } from 'react-router-dom';

// Mock de los servicios
jest.mock('../services/answerService');
jest.mock('../services/evaluationService');

const mockAnswers = [
  {
    author: 'Usuario 1',
    evaluationName: 'Evaluación 1',
    answers: {
      '¿Cómo calificaría su capacidad de liderazgo?': 7,
      '¿Confía y delega responsabilidades en su equipo?': 'si',
    },
  },
  {
    author: 'Usuario 2',
    evaluationName: 'Evaluación 2',
    answers: {
      '¿Cómo calificaría su capacidad de liderazgo?': 8,
      '¿Confía y delega responsabilidades en su equipo?': 'no',
    },
  },
];

const mockEvaluations = [
  { id: 1, title: 'Evaluación 1' },
  { id: 2, title: 'Evaluación 2' },
];

describe('Dashboard Component', () => {
  beforeAll(() => {
    document.body.innerHTML = '<div id="root"></div>'; // Asegura que existe el elemento root
  });
  beforeEach(() => {
    // Mockear la respuesta de los servicios
    (fetchAnswers as jest.Mock).mockResolvedValue(mockAnswers);
    (fetchEvaluations as jest.Mock).mockResolvedValue(mockEvaluations);
  });

  it('should render dashboard components and graphs', async () => {
    render(<MemoryRouter>
      <Dashboard />
    </MemoryRouter>);

    // Verificar que el título del Dashboard se renderiza correctamente
    expect(screen.getByText(/Dashboard de Evaluaciones/i)).toBeInTheDocument();

    // Verificar que el gráfico de barras de capacidad de liderazgo aparece
    await waitFor(() => {
      expect(screen.getByText(/Capacidad de Liderazgo/i)).toBeInTheDocument();
    });

    // Verificar que el gráfico de torta de delegación de responsabilidades aparece
    await waitFor(() => {
      expect(screen.getByText(/Delegación de Responsabilidades/i)).toBeInTheDocument();
    });

    // Verificar que el subcomponente de evaluaciones pendientes aparece
    await waitFor(() => {
      expect(screen.getByText(/Evaluaciones Pendientes/i)).toBeInTheDocument();
    });

    // Verificar que se renderizan las evaluaciones en la tabla de evaluaciones pendientes
    await waitFor(() => {
      expect(screen.getByText('Evaluación 1')).toBeInTheDocument();
      expect(screen.getByText('Evaluación 2')).toBeInTheDocument();
    });

    // Verificar que el componente del calendario se renderiza
    expect(screen.getByTestId('calendar-component')).toBeInTheDocument();
  });
});
