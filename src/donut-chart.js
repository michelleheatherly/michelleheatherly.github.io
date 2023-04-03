import Chart from 'chart.js/auto';

// donut chart using chartjs library
// https://www.chartjs.org/

const donutChart = () => {

    window.addEventListener("DOMContentLoaded", () => {
        chart();
    });

    const chart = () => {
        const data = {
            labels: [
                'Windows',
                'Linux',
                'Ubuntu',
                'CentOS',
                'RHEL',
                'AWS',
                'Azure'
            ],
            datasets: [{
                label: 'Operating Systems',
                data: [80, 100, 70, 60, 50, 30, 20],
                backgroundColor: [
                    'rgba(129, 28, 225, 0.8)',
                    'rgba(24, 34, 226, 0.8)',
                    'rgba(24, 186, 226, 0.8)',
                    'rgba(255, 231, 71, 0.8)',
                    'rgba(24, 226, 114, 0.8)',
                    'rgba(238, 130, 238, 0.8)',
                    'rgba(255, 165, 0, 0.8)'
                ],
                hoverOffset: 4
            }]
        };
        const config = {
            type: 'doughnut',
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
        const ctx = document.getElementById('myDonutChart');
        const myChart = new Chart(ctx, config);
    };
};

export { donutChart };