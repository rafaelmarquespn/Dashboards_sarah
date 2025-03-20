$(document).ready(function () {
    let chart1, chart2; // Variáveis globais para os gráficos
    const dbName = "sistema_bombas_rms";
    let intervalo = $('input[name="minuto"]:checked').val(); // Intervalo inicial selecionado
    let startDate, endDate;

    // Chamada inicial sem filtros (ou com valores padrão, se necessário)
    $.ajax({
        url: './js/php_dados.php',
        method: 'GET',
        dataType: 'json',
        data: { startDate: startDate, endDate: endDate, dbname: dbName, intervalo: intervalo },
        success: function (data) {
            // Se houver gráficos anteriores, destrói-os
            if (chart1) { chart1.destroy(); }
            if (chart2) { chart2.destroy(); }

            // Verifica se há dados para cada bomba
            if (data.bomba_de_calor1.length > 0) {
                drawChart(data.bomba_de_calor1, 'chart1', 'Bomba de Calor 1');
            } else {
                alert('Nenhum dado encontrado para a Bomba de Calor 1 no período selecionado.');
            }
            if (data.bomba_de_calor2.length > 0) {
                drawChart(data.bomba_de_calor2, 'chart2', 'Bomba de Calor 2');
            } else {
                alert('Nenhum dado encontrado para a Bomba de Calor 2 no período selecionado.');
            }
            $('#loadingMessage').hide();
        },
        error: function () {
            alert('Erro ao carregar os dados. Por favor, tente novamente.');
            $('#loadingMessage').hide();
        }
    });

    // Função para carregar e desenhar os gráficos conforme filtros
    function carregarDados() {
        let startDate = $('#dataInicial').val();
        let endDate = $('#dataFinal').val();
        intervalo = $('input[name="minuto"]:checked').val();

        // Valida os campos obrigatórios
        if (startDate === '' || endDate === '') {
            alert('Por favor, preencha tanto a Data Inicial quanto a Data Final.');
            return;
        }
        if (new Date(startDate) > new Date(endDate)) {
            alert('A Data Inicial não pode ser maior que a Data Final.');
            return;
        }
        const currentDate = new Date();
        if (new Date(startDate) > currentDate) {
            alert('A Data Inicial não pode ser maior que a data atual.');
            $('#dataInicial').val('');
            $('#dataFinal').val('');
            return;
        }

        $('#loadingMessage').show();

        $.ajax({
            url: './js/php_dados.php',
            method: 'GET',
            dataType: 'json',
            data: { startDate: startDate, endDate: endDate, dbname: dbName, intervalo: intervalo },
            success: function (data) {
                if (chart1) { chart1.destroy(); }
                if (chart2) { chart2.destroy(); }
                
                if (data.bomba_de_calor1.length > 0) {
                    drawChart(data.bomba_de_calor1, 'chart1', 'Bomba de Calor 1');
                } else {
                    alert('Nenhum dado encontrado para a Bomba de Calor 1 no período selecionado.');
                }
                if (data.bomba_de_calor2.length > 0) {
                    drawChart(data.bomba_de_calor2, 'chart2', 'Bomba de Calor 2');
                } else {
                    alert('Nenhum dado encontrado para a Bomba de Calor 2 no período selecionado.');
                }
                $('#loadingMessage').hide();
            },
            error: function () {
                alert('Erro ao carregar os dados. Por favor, tente novamente.');
                $('#loadingMessage').hide();
            }
        });
    }

    // Eventos para recarregar os dados quando o usuário altera datas ou o intervalo
    $('#btnEnviar').on('click', carregarDados);
    $('input[type=radio]').on('change', carregarDados);

    // Função para desenhar o gráfico
    // Recebe os dados, o id do canvas e o título do gráfico
    function drawChart(data, canvasId, chartTitle) {
        var labels = data.map(function(item) {
            return item.time; // 'time' já vem formatado pelo PHP
        });

        // Exemplo: plotando seis campos – você pode ajustar conforme os dados que deseja visualizar
        var compressor1Data = data.map(function(item) {
            return item.Compressor_1;
        });
        var compressor2Data = data.map(function(item) {
            return item.Compressor_2;
        });
        var entradaData = data.map(function(item) {
            return item.Entrada;
        });
        var saidaData = data.map(function(item) {
            return item.Saida;
        });
        var setPointEntradaData = data.map(function(item) {
            return item.SetPoint_Entrada;
        });
        var setPointSaidaData = data.map(function(item) {
            return item.SetPoint_Saida;
        });

        var ctx = document.getElementById(canvasId).getContext('2d');
        // Cria o gráfico com múltiplas séries
        var chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Compressor 1',
                        data: compressor1Data,
                        borderColor: 'rgb(255, 99, 132)',
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        fill: true
                    },
                    {
                        label: 'Compressor 2',
                        data: compressor2Data,
                        borderColor: 'rgb(54, 162, 235)',
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        fill: true
                    },
                    {
                        label: 'Entrada',
                        data: entradaData,
                        borderColor: 'rgb(75, 192, 192)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        fill: true
                    },
                    {
                        label: 'Saída',
                        data: saidaData,
                        borderColor: 'rgb(153, 102, 255)',
                        backgroundColor: 'rgba(153, 102, 255, 0.2)',
                        fill: true
                    },
                    {
                        label: 'SetPoint Entrada',
                        data: setPointEntradaData,
                        borderColor: 'rgb(255, 159, 64)',
                        backgroundColor: 'rgba(255, 159, 64, 0.2)',
                        fill: true
                    },
                    {
                        label: 'SetPoint Saída',
                        data: setPointSaidaData,
                        borderColor: 'rgb(201, 203, 207)',
                        backgroundColor: 'rgba(201, 203, 207, 0.2)',
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: chartTitle
                    }
                },
                scales: {
                    x: {
                        reverse: false, // A ordem dos labels pode ser ajustada conforme a necessidade
                        display: true,
                        title: {
                            display: true,
                            text: 'Horário'
                        }
                    },
                    y: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Valor'
                        },
                        min: 0,  // Define o limite inferior
                        max: 100 // Ajuste conforme necessário
                    }
                }
            }
        });
        
        // Atribui o gráfico à variável global conforme o canvas
        if (canvasId === 'chart1') {
            chart1 = chart;
        } else if (canvasId === 'chart2') {
            chart2 = chart;
        }
        
        $('#loadingMessage').hide();
        $("body").removeClass("loading-active");
    }
});
