$(document).ready(function () {
    let chart; // Variável global para o gráfico
    const dbName = "sistema_bombas_rms";
    let intervalo = $('input[name="minuto"]:checked').val(); // Intervalo inicial selecionado
    let startDate;
    let endDate;
    $.ajax({
        url: './js/php_dados.php',
        method: 'GET',
        dataType: 'json',
        data: { startDate: startDate, endDate: endDate, dbname: dbName, intervalo: intervalo },
        success: function (data) {
            if (chart) {
                console.log(data.dados);
                chart.destroy(); // Destroi o gráfico anterior
            }
            if (data.dados.length > 0) {
                drawChart(data.dados); // Desenha o gráfico com os novos dados
            } else {
                alert('Nenhum dado encontrado para o período selecionado.');
            }
            $('#loadingMessage').hide();
        },
        error: function () {
            alert('Erro ao carregar os dados. Por favor, tente novamente.');
            $('#loadingMessage').hide();
        }
    });
    // Função para carregar e desenhar o gráfico
    function carregarDados() {
        let startDate = $('#dataInicial').val();
        let endDate = $('#dataFinal').val();
        intervalo = $('input[name="minuto"]:checked').val();

        // Verificação de campos obrigatórios
        if (startDate === '' || endDate === '') {
            alert('Por favor, preencha tanto a Data Inicial quanto a Data Final.');
            return;
        }

        // Verificação se a data inicial é maior que a data final
        if (new Date(startDate) > new Date(endDate)) {
            alert('A Data Inicial não pode ser maior que a Data Final.');
            return;
        }

        // Obtenção da data atual
        const currentDate = new Date();
        if (new Date(startDate) > currentDate) {
            alert('A data inicial não pode ser maior que a data atual.');
            $('#dataInicial').val('');
            $('#dataFinal').val('');
            return;
        }

        $('#loadingMessage').show();

        // Requisição AJAX para buscar dados do servidor
        $.ajax({
            url: './js/php_dados.php',
            method: 'GET',
            dataType: 'json',
            data: { startDate: startDate, endDate: endDate, dbname: dbName, intervalo: intervalo },
            success: function (data) {
                if (chart) {
                    console.log(data.dados);
                    chart.destroy(); // Destroi o gráfico anterior
                }
                if (data.dados.length > 0) {
                    drawChart(data.dados); // Desenha o gráfico com os novos dados
                } else {
                    alert('Nenhum dado encontrado para o período selecionado.');
                }
                $('#loadingMessage').hide();
            },
            error: function () {
                alert('Erro ao carregar os dados. Por favor, tente novamente.');
                $('#loadingMessage').hide();
            }
        });
    }

    // Evento ao alterar as datas ou selecionar o intervalo de amostras
    $('#btnEnviar').on('click', carregarDados);
    $('input[type=radio]').on('change', carregarDados);

    // Função para desenhar o gráfico
    function drawChart(data) {
        var labels = data.map(function(item) {
            return item.data;
        });
    
        var saturacaoFiltro1Data = data.map(function(item) {
            console.log(item.saturacao_filtro1);
            return item.saturacao_filtro1; // saturacao_filtro1
        });
    
        var saturacaoFiltro2Data = data.map(function(item) {
            return item.saturacao_filtro2; // saturacao_filtro2
        });
    
        var frequenciaBomba1Data = data.map(function(item) {
            return item.frequencia_bomba1; // frequencia_bomba1
        });
    
        var frequenciaBomba2Data = data.map(function(item) {
            return item.frequencia_bomba2; // frequencia_bomba2
        });
    
        var ctx = document.getElementById('chart').getContext('2d');
        chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Saturação Filtro 1',
                        data: saturacaoFiltro1Data,
                        borderColor: 'rgb(255, 99, 132)',
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        fill: true
                    },
                    {
                        label: 'Saturação Filtro 2',
                        data: saturacaoFiltro2Data,
                        borderColor: 'rgb(54, 162, 235)',
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        fill: true
                    },
                    {
                        label: 'Frequência Bomba 1',
                        data: frequenciaBomba1Data,
                        borderColor: 'rgb(75, 192, 192)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        fill: true
                    },
                    {
                        label: 'Frequência Bomba 2',
                        data: frequenciaBomba2Data,
                        borderColor: 'rgb(153, 102, 255)',
                        backgroundColor: 'rgba(153, 102, 255, 0.2)',
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
                            display: true,
                            text: 'Valor'
                        }
                    }
                }
            }
        });
    
        $('#loadingMessage').hide();
        $("body").removeClass("loading-active");
    }
    
});
