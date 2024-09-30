
import { API_KEY, API_EVALUATION_URL } from '../config/config';
import { Evaluation } from '../types';
export const fetchEvaluations = async () => {
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
        return data.record;
    } catch (error) {
        console.error(error);
    }

}

export const deleteEvaluation = async (id: number, evaluations: Evaluation[]) => {
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

      return updatedEvaluations;
    } catch (err) {
      console.error('Error deleting evaluation:', err);
    }
  };

