import { useEffect, useState } from 'react';
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { API_KEY, API_ANSWER_URL } from '../config/config';
import PendingEvaluations from './PendingEvaluations';
import CalendarComponent from './CalendarComponent';

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
        // Fetch evaluations from jsonbin.io
        const fetchEvaluations = async () => {
            const response = await fetch(API_ANSWER_URL, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-Master-Key': API_KEY
                }
            });

            if (!response.ok) {
                throw new Error('Error fetching evaluations');
            }

            const json = await response.json();
            setData(json.record);
        };

        fetchEvaluations();
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
            <h2>Dashboard de Evaluaciones</h2>

            {/* Gráfico de barras para capacidad de liderazgo */}
            <div style={{ width: '100%', height: 300 }}>
                <h3>Capacidad de Liderazgo</h3>
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
            <div style={{ width: '100%', height: 300 }}>
                <h3>Delegación de Responsabilidades</h3>
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

            <div className="bottom-4 left-8 w-1/4">
                <CalendarComponent />
            </div>

            <div className="fixed bottom-4 right-4 w-1/4">
                <h2 className="text-xl font-semibold mb-2">Evaluaciones Pendientes</h2>
                <PendingEvaluations />
            </div>
        </div>
    );
};

export default Dashboard;
