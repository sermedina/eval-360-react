import { render, screen } from '@testing-library/react';
import Dashboard from '../components/Dashboard';
import { act } from 'react';
import { fetchAnswers } from '../services/answerService';
import { fetchEvaluations } from '../services/evaluationService';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';


// Mockear los servicios
jest.mock('../services/answerService');
jest.mock('../services/evaluationService');

jest.mock('recharts', () => {
  const OriginalRecharts = jest.requireActual('recharts');
  return {
      ...OriginalRecharts,
      ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
          <div style={{ width: '500px', height: '300px' }}>{children}</div>
      )
  };
});


const mockData = [
  {
    author: 'John Doe',
    evaluationName: 'Evaluation 1',
    answers: {
      '¿Cómo calificaría su capacidad de liderazgo?': 8,
      '¿Confía y delega responsabilidades en su equipo?': 'si',
    },
  },
  {
    author: 'Jane Smith',
    evaluationName: 'Evaluation 2',
    answers: {
      '¿Cómo calificaría su capacidad de liderazgo?': 6,
      '¿Confía y delega responsabilidades en su equipo?': 'no',
    },
  },
];

// Mock de evaluations
const mockEvaluations = [
  {
    id: 1727359512345,
    title: "Evaluación de Gestión de Conflictos",
    questions: [
      {
        id: 1727359525678,
        type: "multiple-choice",
        label: "¿Maneja bien los conflictos en el equipo?",
        options: ["Sí", "No"],
      },
      {
        id: 1727359532134,
        type: "text",
        label: "Describa cómo resolvió un conflicto en su equipo",
      },
      {
        id: 1727359537890,
        type: "scale",
        label: "¿Cómo calificaría su capacidad para gestionar conflictos?",
      },
    ],
    isCurrent: false,
    dueDate: "2024-10-01",
  },
];

describe('Dashboard component', () => {
  beforeAll(() => {
    document.body.innerHTML = '<div id="root"></div>'; // Asegura que existe el elemento root
  });

  beforeEach(() => {
    (fetchAnswers as jest.Mock).mockResolvedValue(mockData);
    (fetchEvaluations as jest.Mock).mockResolvedValue(mockEvaluations);
  });

  test('should render without crashing and fetch data correctly', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>
      );
    });
    
    
    // Verificar que los títulos de los gráficos se renderizan
    expect(screen.getByText('Dashboard de Evaluaciones')).toBeInTheDocument();
    expect(screen.getByText('Evaluaciones Pendientes')).toBeInTheDocument();
    expect(screen.getByText('Capacidad de Liderazgo')).toBeInTheDocument();
    expect(screen.getByText('Delegación de Responsabilidades')).toBeInTheDocument();
    expect(screen.getByTestId('calendar-component')).toBeInTheDocument();


  });
});
