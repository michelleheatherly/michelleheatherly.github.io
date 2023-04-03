import Chart from 'chart.js/auto';

// polar chart using chartjs library
// https://www.chartjs.org/

const polarChart = () => {

    window.addEventListener("DOMContentLoaded", () => {
        chart();
    });

    const chart = () => {
        const data = {
            labels: [
                'NoSQL',
                'MongoDB',
                'SQL',
                'Microsoft SQL',
                'Oracle',
                'MySQL',
                'MariaDB'
            ],
            datasets: [{
                label: 'Databases',
                data: [100, 100, 90, 50, 15, 70, 50],
                backgroundColor: [
                    'rgba(129, 28, 225, 0.8)',
                    'rgba(24, 34, 226, 0.8)',
                    'rgba(24, 186, 226, 0.8)',
                    'rgba(207, 24, 226, 0.8)',
                    'rgba(24, 226, 114, 0.8)',
                    'rgba(226, 211, 24, 0.8)',
                    'rgba(24, 70, 114, 0.8)'
                ]
            }]
        };
        const config = {
            type: 'polarArea',
            data: data,
            options: {
                plugins: {
                    legend: {
                        labels: {
                            color: 'white'
                        }
                    }
                }
            }
        };
        const ctx = document.getElementById('myChart');
        const myChart = new Chart(ctx, config);
    };

};

export { polarChart };