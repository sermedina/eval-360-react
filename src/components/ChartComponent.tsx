import React, { useRef, useEffect } from 'react';
import Chart, { ChartData, ChartOptions } from 'chart.js/auto';

interface MyChartComponentProps {
  data: number[];   // Datos del gráfico
  labels: string[]; // Etiquetas para el gráfico
}

const ChartComponent: React.FC<MyChartComponentProps> = ({ data, labels }) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null); // Referencia al canvas

  useEffect(() => {
    if (!chartRef.current) return;

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    const chart = new Chart(ctx, {
      type: 'bar', // Puedes cambiar el tipo de gráfico aquí
      data: {
        labels, // Etiquetas del gráfico (preguntas, nombres, etc.)
        datasets: [
          {
            label: 'Resultados',
            data, // Datos para el gráfico
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      } as ChartData<'bar', number[], string>, // Asegura que los tipos sean correctos para 'bar' chart
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      } as ChartOptions<'bar'>,
    });

    // Limpia el gráfico cuando el componente se desmonte
    return () => {
      chart.destroy();
    };
  }, [data, labels]);

  return <canvas ref={chartRef} />;
};

export default ChartComponent;