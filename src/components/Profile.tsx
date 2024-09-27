import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, Title, Text } from '@tremor/react';
import { API_KEY } from '../config/config.ts';
import { API_ANSWER_URL } from '../config/config.ts';

import { Response } from "../types.ts";

const Profile = () => {
    const { user } = useAuth(); // Obtén el nombre, email y cargo
    const [responses, setResponses] = useState<Response[]>([]);

    useEffect(() => {
        const fetchResponses = async () => {
            try {
                const response = await fetch(API_ANSWER_URL, {
                    headers: {
                        'X-Master-Key': API_KEY,
                    },
                });
                const data = await response.json();
                // Filtrar las respuestas del empleado logueado
                const employeeResponses = data.record.filter(
                    (item: Response) => item.author === user?.name // Filtras por nombre del empleado
                );
                setResponses(employeeResponses);
            } catch (error) {
                console.error('Error fetching responses:', error);
            }
        };

        fetchResponses();
    }, [user?.name]);

    return (
        <Card className="bg-white shadow-md rounded-lg p-6">
        <Title className="text-2xl font-bold mb-4">Perfil</Title>
        <div className="mb-4">
            <Text className="text-lg"><strong>Nombre:</strong> {user?.name}</Text>
            <Text className="text-lg"><strong>Email:</strong> {user?.email}</Text>
            <Text className="text-lg"><strong>Cargo:</strong> {user?.position}</Text>
        </div>
    
        <Title className="text-xl font-semibold mt-8 mb-4">Historial de Evaluaciones</Title>
    
        {responses.length > 0 ? (
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre de Evaluación</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Respuestas</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {responses.map((response, index) => (
                            <tr key={index}>
                                <td className="px-6 py-4 whitespace-nowrap">{response.evaluationName}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <ul className="list-disc list-inside">
                                        {Object.entries(response.answers).map(([question, answer], idx) => (
                                            <li key={idx}>
                                                <span className="font-semibold">{question}</span>: {answer}
                                            </li>
                                        ))}
                                    </ul>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        ) : (
            <Text className="text-gray-500">No responses available.</Text>
        )}
    </Card>
    );
};

export default Profile;