import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  Card,
  Title,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  TextInput,
  Switch
} from '@tremor/react';
import Alert from './Alert';
import { API_KEY } from '../config/config.ts';
import { API_EVALUATION_URL } from '../config/config.ts';

interface Evaluation {
  id: number;
  title: string;
  questions: Question[];
  isCurrent: boolean;
}

interface Question {
  id: number;
  type: string;
  label: string;
  options?: string[];
}


const Evaluations = () => {
  const { role } = useAuth();
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newEvaluation, setNewEvaluation] = useState<Evaluation>({
    id: Date.now(),
    title: '',
    questions: [],
    isCurrent: false,
  });
  const [newQuestion, setNewQuestion] = useState<Question>({ id: Date.now(), type: 'text', label: '' });
  const [error, setError] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [optionInput, setOptionInput] = useState('');
  const [isCurrent, setIsCurrent] = useState(false);

  // Cargar evaluaciones desde jsonbin.io
  useEffect(() => {
    const fetchEvaluations = async () => {
      try {
        const response = await fetch(API_EVALUATION_URL, {
          headers: {
            'X-Master-Key': API_KEY,
          },
        });
        const data = await response.json();
        console.log(data);
        setEvaluations(data.record);
      } catch (err) {
        console.error('Error fetching evaluations:', err);
      }
    };

    fetchEvaluations();
  }, []);

  const handleCreateEvaluation = () => {
    setIsCreating(true);
  };

  const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOptionInput(e.target.value);
  };

  const handleAddOption = () => {
    if (optionInput.trim() !== '') {
      setNewQuestion({
        ...newQuestion,
        options: [...(newQuestion.options || []), optionInput],
      });
      setOptionInput('');
    }
  };

  const handleAddQuestion = () => {
    if (newQuestion.label.trim() === '') {
      setError('La pregunta no puede estar vacía.');
      return;
    }

    setNewEvaluation({
      ...newEvaluation,
      questions: [...newEvaluation.questions, newQuestion],
    });
    setNewQuestion({ id: Date.now(), type: 'text', label: '' });
    setError('');
    setQuestions([...questions, newQuestion]);
    setOptionInput(''); // Reset the option input
  };

  const handleSaveEvaluation = async () => {

    // Si se marca como la evaluación actual, asegurarse de que solo una evaluación tenga isCurrent: true
    if (isCurrent) {
      const updatedEvaluations = evaluations.map((evaluation) => ({ ...evaluation, isCurrent: false }));
      setEvaluations(updatedEvaluations);
    }


    if (newEvaluation.title.trim() === '') {
      setError('El título de la evaluación no puede estar vacío.');
      return;
    }

    if (newEvaluation.questions.length === 0) {
      setError('Debes añadir al menos una pregunta.');
      return;
    }

    try {
      const updatedEvaluations = [...evaluations, newEvaluation];

      // Guardar la nueva lista de evaluaciones en jsonbin.io
      const response = await fetch(API_EVALUATION_URL, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Master-Key': API_KEY,
        },
        body: JSON.stringify(updatedEvaluations),
      });

      if (!response.ok) {
        throw new Error('Error al guardar en jsonbin.io');
      }

      setEvaluations(updatedEvaluations);
      setIsCreating(false);
      setNewEvaluation({ id: Date.now(), title: '', questions: [], isCurrent: false });
      setError('');
    } catch (err) {
      console.error('Error saving evaluation:', err);
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
    setNewEvaluation({ id: Date.now(), title: '', questions: [], isCurrent: false });
    setError('');
  };

  const handleDeleteEvaluation = async (id: number) => {
    const updatedEvaluations = evaluations.filter(evaluation => evaluation.id !== id);

    try {
      // Actualizar evaluaciones en jsonbin.io después de eliminar una
      const response = await fetch(API_EVALUATION_URL, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Master-Key': API_KEY,
        },
        body: JSON.stringify(updatedEvaluations),
      });

      if (!response.ok) {
        throw new Error('Error al eliminar la evaluación en jsonbin.io');
      }

      setEvaluations(updatedEvaluations);
    } catch (err) {
      console.error('Error deleting evaluation:', err);
    }
  };

  const updateEvaluations = async (updatedEvaluations: Evaluation[]) => {
    try {
      const response = await fetch(API_EVALUATION_URL, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Master-Key': API_KEY,
        },
        body: JSON.stringify(updatedEvaluations),
      });

      if (!response.ok) {
        throw new Error(`Error updating evaluations: ${response.statusText}`);
      }

      const data = await response.json();
      setEvaluations(data.record);
    } catch (error) {
      console.error('Error updating evaluations:', error);
    }
  };

  const handleToggleCurrent = (id: number) => {
    const updatedEvaluations = evaluations.map((evaluation) =>
      evaluation.id === id
        ? { ...evaluation, isCurrent: true }
        : { ...evaluation, isCurrent: false }
    );
    updateEvaluations(updatedEvaluations);
  };

  return (
    <Card className="p-6 bg-white shadow-lg rounded-lg">
      <Title className="text-xl font-bold mb-4">Evaluaciones</Title>

      {error && (
        <div className="mb-4">
          <Alert message={error} type="error" />
        </div>
      )}

      {role === 'admin' && !isCreating && (
        <Button onClick={handleCreateEvaluation} className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition">
          Crear Nueva Evaluación
        </Button>
      )}

      {isCreating && (
        <div className="evaluation-form space-y-4">
          <TextInput
            placeholder="Nombre de la Evaluación"
            value={newEvaluation.title}
            onChange={(e) => setNewEvaluation({ ...newEvaluation, title: e.target.value })}
            className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring focus:ring-blue-500"
          />

          <div className="flex items-center mt-4">
            <label htmlFor="isCurrent" className="mr-2">
              Es la evaluación actual
            </label>
            <Switch
              id="isCurrent"
              checked={isCurrent}
              onChange={() => setIsCurrent(!isCurrent)}
              className="ml-2"
            >
              <span className="sr-only">Es la evaluación actual</span>
            </Switch>
          </div>

          <div className="question-creation space-y-4">
            <select
              value={newQuestion.type}
              onChange={(e) => setNewQuestion({ ...newQuestion, type: e.target.value })}
              className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring focus:ring-blue-500"
            >
              <option value="text">Texto</option>
              <option value="multiple-choice">Opción Múltiple</option>
              <option value="scale">Escala</option>
            </select>

            <TextInput
              placeholder="Pregunta"
              value={newQuestion.label}
              onChange={(e) => setNewQuestion({ ...newQuestion, label: e.target.value })}
              className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring focus:ring-blue-500"
            />

            {newQuestion.type === 'multiple-choice' && (
              <div className="space-y-2">
                <TextInput
                  value={optionInput}
                  onChange={handleOptionChange}
                  placeholder="Añadir opción"
                  className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring focus:ring-blue-500"
                />
                <Button onClick={handleAddOption} className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition">
                  Agregar Opción
                </Button>
                <ul className="list-disc pl-5">
                  {newQuestion.options?.map((option, index) => (
                    <li key={index}>{option}</li>
                  ))}
                </ul>
              </div>
            )}

            <Button onClick={handleAddQuestion} className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition">
              Añadir Pregunta
            </Button>

            <h3 className="text-lg font-semibold mt-6">Preguntas añadidas</h3>
            <ul className="list-disc pl-5 space-y-2">
              {questions.map((question) => (
                <li key={question.id}>
                  {question.label} - {question.type}
                  {question.type === 'multiple-choice' && (
                    <ul className="list-inside pl-4">
                      {question.options?.map((option, idx) => (
                        <li key={idx}>{option}</li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex space-x-4 mt-6">
            <Button onClick={handleSaveEvaluation} className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition">
              Guardar Evaluación
            </Button>
            <Button onClick={handleCancel} className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition">
              Cancelar
            </Button>
          </div>
        </div>
      )}

      {!isCreating && (
        <Table className="mt-6 w-full border border-gray-300 rounded-lg shadow">
          <TableHead className="bg-gray-100">
            <TableRow>
              <TableCell className="font-semibold p-4">Título</TableCell>
              <TableCell className="font-semibold p-4">Preguntas</TableCell>
              <TableCell className="font-semibold p-4">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {evaluations.map((evaluation) => (
              <TableRow key={evaluation.id}>
                <TableCell className="p-4">{evaluation.title}</TableCell>
                <TableCell className="p-4">
                  {evaluation.questions.map((question, index) => (
                    <div key={index}>
                      {question.label} ({question.type})
                    </div>
                  ))}
                </TableCell>
                <TableCell className="p-4">
                  <label htmlFor="isCurrent" className="mr-2">
                    Evaluación actual
                  </label>
                  <Switch
                    checked={evaluation.isCurrent}
                    onChange={() => handleToggleCurrent(evaluation.id)}
                    className="ml-2"
                  />
                </TableCell>
                <TableCell className="p-4">
                  <Button onClick={() => handleDeleteEvaluation(evaluation.id)} className="bg-red-500 text-white py-1 px-3 rounded-lg hover:bg-red-600 transition">
                    Borrar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Card>
  );
};

export default Evaluations;