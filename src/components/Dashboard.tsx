import { useEffect, useState } from 'react'; 
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import PendingEvaluations from './PendingEvaluations';
import CalendarComponent from './CalendarComponent';
import  { fetchAnswers } from '../services/answerService';

interface EvaluationResponse {
    author: string;
    evaluationName: string;
    answers: {
        [key: string]: string | number;
    };
}

const Dashboard = () => {
    const [data, setData] = useState<EvaluationResponse[]>([]);

    useEffect(() => {
        fetchAnswers()
        .then(setData)
        .catch(console.error);
    }, []);

    // Agrupamos y preparamos datos para gráficos
    const groupByAnswer = (question: string) => {
        return data.reduce(
            (acc, curr) => {
                const answer = curr.answers[question];
                if (answer === 'si') acc.yes += 1;
                if (answer === 'no') acc.no += 1;
                return acc;
            },
            { yes: 0, no: 0 }
        );
    };

    // Agrupar por 'author' y calcular el promedio de 'leadership' por autor
    const leadershipScoresMap = new Map();

    data.forEach((d) => {
        const author = d.author;
        const leadership = d.answers['¿Cómo calificaría su capacidad de liderazgo?'];


        if (typeof leadership === 'number' && !isNaN(leadership)) {
            if (leadershipScoresMap.has(author)) {
                const existingEntry = leadershipScoresMap.get(author);
                leadershipScoresMap.set(author, {
                    ...existingEntry,
                    totalLeadership: existingEntry.totalLeadership + leadership,
                    count: existingEntry.count + 1,
                });
            } else {
                leadershipScoresMap.set(author, {
                    author: author,
                    totalLeadership: leadership,
                    count: 1,
                });
            }
        }
    });

    // Crear un array de objetos con el promedio de 'leadership' por autor
    const leadershipScores = Array.from(leadershipScoresMap.values()).map((entry) => ({
        author: entry.author,
        leadership: entry.count > 0 ? (entry.totalLeadership / entry.count) : 0, // Promedio de liderazgo
    }));
    const delegationData = groupByAnswer('¿Confía y delega responsabilidades en su equipo?');

    return (
        <div>
            <h2 className="text-2xl font-bold dark:text-white">Dashboard de Evaluaciones</h2>

            {/* Gráfico de barras para capacidad de liderazgo */}
            <div className="w-full h-72 my-6">
                <h3 className="text-lg font-semibold dark:text-gray-300">Capacidad de Liderazgo</h3>
                <ResponsiveContainer>
                    <BarChart data={leadershipScores}>
                        <XAxis dataKey="author" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="leadership" fill="#8884d8" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Gráfico de torta para delegación de responsabilidades */}
            <div className="w-full h-72 my-6">
                <h3 className="text-lg font-semibold dark:text-gray-300">Delegación de Responsabilidades</h3>
                <ResponsiveContainer>
                    <PieChart>
                        <Pie
                            dataKey="value"
                            data={[
                                { name: 'Sí', value: delegationData.yes },
                                { name: 'No', value: delegationData.no }
                            ]}
                            fill="#82ca9d"
                            label
                        />
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/* Calendario */}
            <div data-testid="calendar-component" className="bottom-4 left-8 w-1/4">
                <CalendarComponent />
            </div>

            {/* Evaluaciones Pendientes */}
            <div className="fixed bottom-4 right-4 w-1/4 bg-white shadow-md rounded-lg p-4 dark:bg-gray-800">
                <h2 className="text-xl font-semibold mb-2 dark:text-gray-100">Evaluaciones Pendientes</h2>
                <PendingEvaluations />
            </div>
        </div>
    );
};

export default Dashboard;
