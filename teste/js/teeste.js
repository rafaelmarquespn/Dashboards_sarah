$(document).ready(function() {
    let chart; // Variável global para manter uma referência ao gráfico
    const dbName="sistema_bombas_rms";
    let selectedArea ="historico";
    $('#btnEnviar').on('click', function() {
        var startDate = $('#dataInicial').val();
        var endDate = $('#dataFinal').val();

        if (selectedArea !== '') {
            $.ajax({
                url: 'api.php',
                method: 'GET',
                dataType: 'json',
                data: { area: selectedArea, startDate: startDate, endDate: endDate,dbname:dbName },
                success: function(data) {
                    if (chart) {
                        chart.destroy();
                    }

                    drawChart(data);
                }
            });
        }
    });

    function drawChart(data) {
        var labels = data.map(function(item) {
            return item.data;
        });

        var vazao_rm1 = data.map(function(item) {
            return item.vazao_rm1;
        });

        var vazao_rm3 = data.map(function(item) {
            return item.vazao_rm3;
        });
        var vazao_rm2 = data.map(function(item) {
            return item.vazao_rm2;
        });
        var vazao_rm4 = data.map(function(item) {
            return item.vazao_rm4;
        });

        var ctx = document.getElementById('chart').getContext('2d');
        chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Vazão rm1',
                        data: vazao_rm1,
                        borderColor: 'rgb(255, 99, 132)',
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        fill: true
                    },
                    {
                        label: 'Vazão rm2',
                        data: vazao_rm2,
                        borderColor: 'rgb(54, 162, 235)',
                        backgroundColor: 'rgba(154, 162, 235, 0.2)',
                        fill: true
                    },
                    {
                        label: 'Vazão rm3',
                        data: vazao_rm3,
                        borderColor: 'rgb(54, 162, 235)',
                        backgroundColor: 'rgba(54, 62, 235, 0.2)',
                        fill: true
                    },
                    {
                        label: 'Vazão rm4',
                        data: vazao_rm4,
                        borderColor: 'rgb(5, 162, 235)',
                        backgroundColor: 'rgba(54, 162, 35, 0.2)',
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        reverse: true,
                        display: true,
                        title: {
                            display: true,
                            text: 'Data'
                        }
                    },
                    y: {
                        display: true,
                        title: {
                            display: false,
                            text: 'Valor'
                        }
                    }
                }
            }
        });
    }
});
