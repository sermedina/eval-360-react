import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, Title, Text } from '@tremor/react';
import { API_KEY } from '../config/config.ts';
import { API_ANSWER_URL } from '../config/config.ts';

import { Response } from "../types.ts";

const Profile = () => {
    const { user } = useAuth(); 
    const [responses, setResponses] = useState<Response[]>([]);
    const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

    useEffect(() => {

        const storedTheme = localStorage.getItem('theme');
        if (storedTheme === 'dark') {
            setIsDarkMode(true);
            document.documentElement.classList.add('dark');
        }
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

    const toggleDarkMode = () => {
        if (isDarkMode) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        }
        setIsDarkMode(!isDarkMode);
    };

    return (
        <Card className="bg-white shadow-md rounded-lg p-6 dark:bg-gray-800 dark:shadow-lg relative">
            <Title className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Perfil</Title>

            {/* Botón de Modo Oscuro */}
            <button
                onClick={toggleDarkMode}
                className="absolute top-4 right-4 flex items-center justify-between w-14 h-8 bg-gray-300 rounded-full p-1 transition-colors duration-300 ease-in-out dark:bg-blue-600 z-10"
            >
                <span className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${isDarkMode ? 'translate-x-6' : 'translate-x-0'}`} />
                <span className={`absolute left-2 text-sm text-gray-700 dark:text-gray-200 transition-opacity duration-300 ease-in-out ${isDarkMode ? 'opacity-0' : 'opacity-100'}`}>🌞</span>
                <span className={`absolute right-2 text-sm text-gray-700 dark:text-gray-200 transition-opacity duration-300 ease-in-out ${isDarkMode ? 'opacity-100' : 'opacity-0'}`}>🌜</span>
            </button>

            <div className="mb-4">
                <Text className="text-lg text-gray-900 dark:text-gray-300">
                    <strong>Nombre:</strong> {user?.name}
                </Text>
                <Text className="text-lg text-gray-900 dark:text-gray-300">
                    <strong>Email:</strong> {user?.email}
                </Text>
                <Text className="text-lg text-gray-900 dark:text-gray-300">
                    <strong>Cargo:</strong> {user?.position}
                </Text>
            </div>

            <Title className="text-xl font-semibold mt-8 mb-4 text-gray-900 dark:text-white">Historial de Evaluaciones</Title>

            {responses.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                                    Nombre de Evaluación
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                                    Respuestas
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                            {responses.map((response, index) => (
                                <tr key={index}>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-gray-300">
                                        {response.evaluationName}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <ul className="list-disc list-inside">
                                            {Object.entries(response.answers).map(([question, answer], idx) => (
                                                <li key={idx} className="text-gray-900 dark:text-gray-300">
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
                <Text className="text-gray-500 dark:text-gray-400">No hay respuestas disponibles.</Text>
            )}
        </Card>
    );
};

export default Profile;