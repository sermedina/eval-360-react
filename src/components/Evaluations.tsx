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

interface Question {
  id: number;
  type: string;
  label: string;
  options?: string[];
}

export interface Evaluation {
  id: number;
  title: string;
  isCurrent: boolean;
  questions: Question[];
  dueDate: string;
};

const Evaluations = () => {
  const { user } = useAuth();
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newEvaluation, setNewEvaluation] = useState<Evaluation>({
    id: Date.now(),
    title: '',
    questions: [],
    isCurrent: false,
    dueDate: ''
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

  const handleDeleteQuestion = (id: number) => {
    setQuestions(questions.filter(question => question.id !== id));
    setNewEvaluation({
      ...newEvaluation,
      questions: newEvaluation.questions.filter(question => question.id !== id),
    });
  };

  const handleDeleteOption = (index: number) => {
    const updatedOptions = newQuestion.options?.filter((_, i) => i !== index);
    setNewQuestion({
      ...newQuestion,
      options: updatedOptions,
    });
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
      setNewEvaluation({ id: Date.now(), title: '', questions: [], isCurrent: false, dueDate: '' });
      setError('');
    } catch (err) {
      console.error('Error saving evaluation:', err);
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
    setNewEvaluation({ id: Date.now(), title: '', questions: [], isCurrent: false, dueDate: '' });
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
    <Card className="p-6 bg-white dark:bg-gray-900 shadow-lg rounded-lg">
      <Title className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Evaluaciones</Title>

      {error && (
        <div className="mb-4">
          <Alert message={error} type="error" />
        </div>
      )}

      {user?.role === 'admin' && !isCreating && (
        <Button onClick={handleCreateEvaluation} className="bg-blue-500 dark:bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-600 dark:hover:bg-blue-500 transition">
          Crear Nueva Evaluación
        </Button>
      )}

      {isCreating && (
        <div className="evaluation-form space-y-4">
          <TextInput
            placeholder="Nombre de la Evaluación"
            value={newEvaluation.title}
            onChange={(e) => setNewEvaluation({ ...newEvaluation, title: e.target.value })}
            className="border border-gray-300 dark:border-gray-600 rounded-lg p-2 w-full focus:outline-none focus:ring focus:ring-blue-500 dark:focus:ring-blue-400"
          />

          <div className="flex items-center mt-4">
            <label htmlFor="isCurrent" className="mr-2 text-gray-900 dark:text-gray-300">
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

          <div className="mb-6">
            <label className="font-semibold mb-2 text-gray-900 dark:text-gray-300">Fecha de vencimiento</label>
            <input
              type="date"
              className="border border-gray-300 dark:border-gray-600 rounded-lg p-2 w-full focus:outline-none focus:ring focus:ring-blue-500 dark:focus:ring-blue-400"
              value={newEvaluation.dueDate}
              onChange={(e) => setNewEvaluation({ ...newEvaluation, dueDate: e.target.value })}
              required
            />
          </div>

          <div className="question-creation space-y-4">
            <select
              value={newQuestion.type}
              onChange={(e) => setNewQuestion({ ...newQuestion, type: e.target.value })}
              className="border border-gray-300 dark:border-gray-600 rounded-lg p-2 w-full focus:outline-none focus:ring focus:ring-blue-500 dark:focus:ring-blue-400"
            >
              <option value="text">Texto</option>
              <option value="multiple-choice">Opción Múltiple</option>
              <option value="scale">Escala</option>
            </select>

            <TextInput
              placeholder="Pregunta"
              value={newQuestion.label}
              onChange={(e) => setNewQuestion({ ...newQuestion, label: e.target.value })}
              className="border border-gray-300 dark:border-gray-600 rounded-lg p-2 w-full focus:outline-none focus:ring focus:ring-blue-500 dark:focus:ring-blue-400"
            />

            {newQuestion.type === 'multiple-choice' && (
              <div className="flex flex-col">
                <TextInput
                  placeholder="Añadir opción"
                  value={optionInput}
                  onChange={handleOptionChange}
                  className="border border-gray-300 dark:border-gray-600 rounded-lg p-2 w-full focus:outline-none focus:ring focus:ring-blue-500 dark:focus:ring-blue-400"
                />
                <Button onClick={handleAddOption} className="bg-blue-500 dark:bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-600 dark:hover:bg-blue-500 transition mt-2">
                  Añadir Opción
                </Button>
                <ul className="list-disc list-inside">
                  {newQuestion.options?.map((option, index) => (
                    <li key={index} className="flex justify-between items-center">
                      <span className="text-gray-900 dark:text-gray-300">{option}</span>
                      <Button
                        className="bg-red-500 dark:bg-red-600 text-white py-1 px-2 rounded-lg hover:bg-red-600 dark:hover:bg-red-500 transition"
                        onClick={() => handleDeleteOption(index)}
                      >
                        Eliminar
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Button onClick={handleAddQuestion} className="bg-green-500 dark:bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-600 dark:hover:bg-green-500 transition">
              Añadir Pregunta
            </Button>
          </div>

          <div className="questions-list mt-6">
            <h2 className="font-semibold mb-4 text-gray-900 dark:text-gray-300">Preguntas añadidas</h2>
            <ul>
              {questions.map((question) => (
                <li key={question.id} className="flex justify-between items-center mb-2">
                  <span className="text-gray-900 dark:text-gray-300">{question.label}</span>
                  <Button
                    className="bg-red-500 dark:bg-red-600 text-white py-1 px-2 rounded-lg hover:bg-red-600 dark:hover:bg-red-500 transition"
                    onClick={() => handleDeleteQuestion(question.id)}
                  >
                    Eliminar
                  </Button>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6">
            <Button onClick={handleSaveEvaluation} className="bg-blue-500 dark:bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-600 dark:hover:bg-blue-500 transition">
              Guardar Evaluación
            </Button>
            <Button onClick={handleCancel} className="bg-gray-500 dark:bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-600 dark:hover:bg-gray-500 transition ml-4">
              Cancelar
            </Button>
          </div>
        </div>
      )}

      {!isCreating && (
       <div className="overflow-x-auto">
       <Table className="mt-6">
         <TableHead>
           <TableRow>
             <TableCell className="text-gray-900 dark:text-gray-300">Título</TableCell>
             <TableCell className="text-gray-900 dark:text-gray-300">Evaluación Actual</TableCell>
             <TableCell className="text-gray-900 dark:text-gray-300">Fecha de Vencimiento</TableCell>
             <TableCell className="text-gray-900 dark:text-gray-300">Acciones</TableCell>
           </TableRow>
         </TableHead>
         <TableBody>
           {evaluations.map((evaluation) => (
             <TableRow key={evaluation.id}>
               <TableCell className="text-gray-900 dark:text-gray-300">{evaluation.title}</TableCell>
               <TableCell className="relative">
                 <Switch
                   checked={evaluation.isCurrent}
                   onChange={() => handleToggleCurrent(evaluation.id)}
                  className="absolute ml-2"
                 >
                   <span className="sr-only">Es la evaluación actual</span>
                 </Switch>
               </TableCell>
               <TableCell className="text-gray-900 dark:text-gray-300">{evaluation.dueDate}</TableCell>
               <TableCell>
                 <Button
                   className="bg-red-500 dark:bg-red-600 text-white py-1 px-4 rounded-lg hover:bg-red-600 dark:hover:bg-red-500 transition"
                   onClick={() => handleDeleteEvaluation(evaluation.id)}
                 >
                   Eliminar
                 </Button>
               </TableCell>
             </TableRow>
           ))}
         </TableBody>
       </Table>
     </div>
     
      )}
    </Card>
  );
};

export default Evaluations;
