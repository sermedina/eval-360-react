import { useState, useEffect } from 'react';
import { API_ANSWER_URL } from '../config/config.ts';
import ChartComponent from './ChartComponent.tsx';
import { API_KEY } from '../config/config.ts';


type Response = {
    author: string;
    answers: {
        [key: string]: string;
    };
};



const Dashboard = () => {
    const [responses, setResponses] = useState<Response[]>([]);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchResponses();
    }, []);

    const fetchResponses = async () => {
        try {
            const response = await fetch(API_ANSWER_URL, {
                headers: {
                    'X-Master-Key': API_KEY,
                },
            });
            const data = await response.json();
            console.log(data);
            setResponses(data.record);
        } catch {
            setError('Error al cargar respuestas');
        }
    };

    const processDataForCharts = () => {
        const delegationData = { si: 0, no: 0 };
        const decisionData = { si: 0, no: 0 };
        const helpData = { si: 0, no: 0 };
        const leadershipData: number[] = [];

        responses.forEach((resp: Response) => {
            const answers = resp.answers;
            if (answers["¿Confía y delega responsabilidades en su equipo?"] === 'si') delegationData.si += 1;
            else delegationData.no += 1;

            if (answers["¿Es capaz de tomar decisiones difíciles y responsabilizarse de los resultados?"] === 'si') decisionData.si += 1;
            else decisionData.no += 1;

            if (answers["¿Otros miembros del equipo lo buscan para que los ayude con su trabajo?"] === 'si') helpData.si += 1;
            else helpData.no += 1;

            if (answers["¿Cómo calificaría su capacidad de liderazgo?"]) {
                leadershipData.push(Number(answers["¿Cómo calificaría su capacidad de liderazgo?"]));
            }
        });

        return { delegationData, decisionData, helpData, leadershipData };
    };

    const { delegationData, decisionData, helpData, leadershipData } = processDataForCharts();



    if (error) return <p>{error}</p>;

    return (
        <div>
            <h2 className="text-3xl font-bold text-gray-800 mt-6 mb-4">
                Dashboard
            </h2>

            {/* Gráfico sobre confianza y delegación */}
            <div className="chart-container">
                <h3>¿Confía y delega responsabilidades en su equipo?</h3>
                <ChartComponent
                    data={[delegationData.si, delegationData.no]}
                    labels={['Sí', 'No']}
                />
            </div>

            {/* Gráfico sobre toma de decisiones */}
            <div className="chart-container">
                <h3>¿Es capaz de tomar decisiones difíciles y responsabilizarse de los resultados?</h3>
                <ChartComponent
                    data={[decisionData.si, decisionData.no]}
                    labels={['Sí', 'No']}
                />
            </div>

            {/* Gráfico sobre ayuda a otros miembros del equipo */}
            <div className="chart-container">
                <h3>¿Otros miembros del equipo lo buscan para que los ayude con su trabajo?</h3>
                <ChartComponent
                    data={[helpData.si, helpData.no]}
                    labels={['Sí', 'No']}
                />
            </div>

            {/* Gráfico sobre desempeño (puede ser una escala o texto interpretado como numérico) */}
            <div className="chart-container">
                <h3>¿Cómo definiria su desempeño?</h3>
                <ChartComponent
                    data={leadershipData}
                    labels={['1 - Muy malo', '2 - Malo', '3 - Regular', '4 - Bueno', '5 - Excelente']}
                />
            </div>
        </div>
    );
};

export default Dashboard;