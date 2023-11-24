import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

interface ExchangeData {
    code: string;
    volume: number;
    name: string;
    color: string;
    type: string;
}

const Chart = () => {
    const [exchangeData, setExchangeData] = useState<ExchangeData[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('https://http-api.livecoinwatch.com/coins/KAS/breakdown?category=exchange&field=volume&currency=USD');
            if (response.data && response.data.data) {
                setExchangeData(response.data.data);
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des données:', error);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 60000); // Actualiser toutes les 60 secondes
        return () => clearInterval(interval); // Nettoyer l'intervalle lors du démontage du composant
    }, []);

    const data = {
        labels: exchangeData.map(item => item.name),
        datasets: [
            {
                label: 'Volume',
                data: exchangeData.map(item => item.volume),
                backgroundColor: exchangeData.map(item => item.color),
                borderWidth: 1,
                
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
            },
        },
        scales: {
            x: {
                display: true,
                categoryPercentage: 0.4, // Moins d'espace pour la catégorie
                barPercentage: 1.0, // Plus d'espace pour les barres
            },
            y: {
                display: true,
                beginAtZero: true,
            },
        },
        maintainAspectRatio: false,
    };

    return (
        <>
         
            <div className="container">
                {isLoading ? (
                    <div>Chargement...</div>
                ) : (
                    <div className="card-style">
                        <Bar data={data} options={options} />
                    </div>
                )}
            </div>
        </>
    );
}

export default Chart;