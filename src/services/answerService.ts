
import { API_KEY, API_ANSWER_URL } from '../config/config.ts';
import {Response } from '../types.ts';
export const fetchAnswers = async () => {
    try {
        const response = await fetch(API_ANSWER_URL, {
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': API_KEY,
            },
        });

        if (!response.ok) {
            throw new Error('Error fetching answers');
        }

        const data = await response.json();
        return data.record;
    } catch (error) {
        console.error(error);
    }

}


export const saveAnswers = async (answers: Response[]) => {
    try {

      const response = await fetch(API_ANSWER_URL, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Master-Key': API_KEY,
        },
        body: JSON.stringify(answers),
      });
      if (response.ok) {
        alert('Respuestas guardadas con éxito');
      }
    } catch (error) {
      console.error('Error saving responses:', error);
    }
  };