import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_KEY } from '../config/config.ts';
import { API_EVALUATION_URL } from '../config/config.ts';

interface EvaluationTable {
  id: number;
  title: string;
}

const PendingEvaluations: React.FC = () => {
  const [evaluations, setEvaluations] = useState<EvaluationTable[]>([]);
  const navigate = useNavigate();

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

  const handleRowClick = (id: number) => {
    navigate(`/evaluations/${id}`);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300 dark:bg-gray-900 dark:border-gray-700">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-800">
            <th className="py-2 px-4 border-b dark:border-gray-600">ID</th>
            <th className="py-2 px-4 border-b dark:border-gray-600">Título</th>
          </tr>
        </thead>
        <tbody>
          {evaluations.map((evaluation) => (
            <tr
              key={evaluation.id}
              className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => handleRowClick(evaluation.id)}
            >
              <td className="py-2 px-4 border-b dark:border-gray-600">{evaluation.id}</td>
              <td className="py-2 px-4 border-b dark:border-gray-600">{evaluation.title}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PendingEvaluations;