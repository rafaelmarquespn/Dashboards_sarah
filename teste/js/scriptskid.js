$(document).ready(function() {
    let chart; // Variável global para manter uma referência ao gráfico
    const dbName="skids";
    let selectedArea ="historico_temperaturas";
    let intervalo =$('input[name="minuto"]:checked').val();
    $('input[type=radio]').change(function() {
        //var selectedArea =;
        console.log(selectedArea);
        var startDate = $('#dataInicial').val();
        var endDate = $('#dataFinal').val();
        intervalo =$('input[name="minuto"]:checked').val();
        if (selectedArea !== '') {
            $.ajax({
                url: 'api.php',
                method: 'GET',
                dataType: 'json',
                data: { area: selectedArea, startDate: startDate, endDate: endDate,dbname:dbName,intervalo:intervalo },
                success: function(data) {
                    if (chart) {
                        chart.destroy();
                    }

                    drawChart(data,selectedArea);
                    matrix=data;
                    selecionada=selectedArea;
                }
            });
        } 
    });
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

        var saidaData = data.map(function(item) {
            return item.Saida;
        });

        var Retorno = data.map(function(item) {
            return item.Retorno;
        });

        var ctx = document.getElementById('chart').getContext('2d');
        chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Saída',
                        data: saidaData,
                        borderColor: 'rgb(255, 99, 132)',
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        fill: true
                    },
                    {
                        label: 'Retorno',
                        data: Retorno,
                        borderColor: 'rgb(54, 162, 235)',
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
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
