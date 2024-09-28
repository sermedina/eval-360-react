import { useState, useEffect } from 'react';
import { Button, Card, TextInput, Title, Text } from '@tremor/react';
import { API_KEY } from '../config/config.ts';
import { API_EVALUATION_URL } from '../config/config.ts';
import { API_ANSWER_URL } from '../config/config.ts';
import { Evaluation, Response } from '../types.ts';


const EvaluationForm = () => {
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [responses, setResponses] = useState<Response>({});
  const [loading, setLoading] = useState(true);


  // Obtener la evaluación actual
  useEffect(() => {
    const fetchCurrentEvaluation = async () => {
      try {
        const response = await fetch(API_EVALUATION_URL, {
          headers: {
            'X-Master-Key': API_KEY,
          },
        });
        const data = await response.json();
        const currentEval = data.record.find((evaluation: Evaluation) => evaluation.isCurrent);
        setEvaluation(currentEval || null);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching evaluation:', error);
        setLoading(false);
      }
    };

    fetchCurrentEvaluation();
  }, []);

  // Manejar el cambio de respuestas
  const handleResponseChange = (id: string, value: string) => {
    setResponses((prevResponses) => ({ ...prevResponses, [id]: value }));
  };

  // Guardar respuestas en jsonbin.io
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validación de no nulidad
    const allFieldsFilled = evaluation?.questions.every((q) => responses[q.id]?.trim());
    if (!allFieldsFilled) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    const answers: Response = {};
    const user = localStorage.getItem('user') || '';

    const userObject = JSON.parse(user);

    const author = userObject.name;
    const evaluationName = evaluation?.title;

    evaluation?.questions.forEach((question) => {
      const label = question.label; // Obtener el label de la pregunta
      const value = responses[question.id]; // Obtener el valor de responses usando el id

      if (value) {
        answers[label] = value; // Asignar el valor al label solo si existe
      }
    });
    const newResponse = {
      author: author, // Usar el nombre del usuario logueado
      evaluationName: evaluationName,
      answers,
    };

    try {

      const binResponse = await fetch(API_ANSWER_URL, {
        headers: {
          "X-Master-Key": API_KEY,
        },
      });
      const binData = await binResponse.json();

      // Combina las respuestas existentes con la nueva respuesta
      const newAnswers = [...binData.record, newResponse];

      const response = await fetch(API_ANSWER_URL, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Master-Key': API_KEY,
        },
        body: JSON.stringify(newAnswers),
      });
      if (response.ok) {
        alert('Respuestas guardadas con éxito');
      }
    } catch (error) {
      console.error('Error saving responses:', error);
    }
  };

  if (loading) {
    return <Text>Cargando...</Text>;
  }

  if (!evaluation) {
    return <Text>No hay una evaluación actual.</Text>;
  }

  return (
    <main className="flex-1 p-6 bg-gray-100 dark:bg-gray-800 overflow-y-auto">
      <Card className="bg-white dark:bg-gray-900 shadow-lg rounded-lg p-6 w-full max-w-2xl">
        <Title className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{evaluation.title}</Title>
        <form onSubmit={handleSubmit}>
          {evaluation.questions.map((q) => (
            <div key={q.id} className="mb-6">
              <Text className="font-semibold mb-2 text-gray-900 dark:text-gray-300">{q.label}</Text>
              {q.type === 'text' && (
                <TextInput
                  className="border border-gray-300 dark:border-gray-600 rounded-lg p-2 w-full focus:outline-none focus:ring focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  value={responses[q.id] || ''}
                  onChange={(e) => handleResponseChange(q.id, e.target.value)}
                  placeholder="Ingresa tu respuesta"
                  required
                />
              )}
              {q.type === 'scale' && (
                <TextInput
                  type="number"
                  min="1"
                  max="10"
                  className="border border-gray-300 dark:border-gray-600 rounded-lg p-2 w-full focus:outline-none focus:ring focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  value={responses[q.id] || ''}
                  onChange={(e) => handleResponseChange(q.id, e.target.value)}
                  placeholder="Escoge un número del 1 al 10"
                  required
                />
              )}
              {q.type === 'multiple-choice' && (
                <select
                  id={q.id}
                  value={responses[q.id] || ''}
                  onChange={(e) => handleResponseChange(q.id, e.target.value)}
                  className="border border-gray-300 dark:border-gray-600 rounded-lg p-2 w-full focus:outline-none focus:ring focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                >
                  <option value="" disabled>Selecciona una opción</option>
                  {q.options?.map((option, index) => (
                    <option key={`${q.id}-option-${index}`} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              )}
            </div>
          ))}
          <div className="flex space-x-4 mt-6">
            <Button type="submit" color="green" className="bg-green-600 hover:bg-green-500 text-white font-semibold py-2 px-4 rounded transition">
              Guardar
            </Button>
            <Button type="button" color="red" onClick={() => setResponses({})} className="bg-red-600 hover:bg-red-500 text-white font-semibold py-2 px-4 rounded transition">
              Cancelar
            </Button>
          </div>
        </form>
      </Card>
    </main>

  );
};

export default EvaluationForm;