$(document).ready(function() {
    let chart; // Variável global para manter uma referência ao gráfico
    const dbName="Fancoil";
    let matrix;
    let selecionada;
    let intervalo =$('input[name="minuto"]:checked').val();
    var selectedArea = $('#area').val();
    console.log(selectedArea);
        // Função para atualizar o gráfico com base na seleção atual
        // Atualiza o gráfico ao carregar a página
        updateChart();

    $('input[type=radio]').change(function() {
        var selectedArea = $('#area').val();
        console.log(selectedArea);
        var startDate = $('#dataInicial').val();
        var endDate = $('#dataFinal').val();
        intervalo =$('input[name="minuto"]:checked').val();
        // Verificação de campos obrigatórios
        if (startDate === '' || endDate === '') {
            startDate = '';

            endDate = '';
        }
        // Verificação se a data inicial é maior que a data final
        if (new Date(startDate) > new Date(endDate)) {
            let temporaria = endDate;
            endDate = startDate;
            startDate = temporaria;
            $('#dataInicial').val(startDate);
            $('#dataFinal').val(endDate);
        }
        // Obtenção da data atual
        let currentDate = new Date();
        // Verificação se a data inicial é maior que a data atual
        if (new Date(startDate) > currentDate) {
            alert('A data inicial não pode ser maior que a data atual. Insira as datas novamente.');
            startDate = '';  // Limpa o campo data inicial
            endDate = '';    // Limpa o campo data final
            $('#dataInicial').val(''); // Limpa o valor exibido no campo de data inicial
            $('#dataFinal').val('');   // Limpa o valor exibido no campo de data final
        }
        $('#loadingMessage').show();
        $("body").addClass("loading-active");
        if (selectedArea !== '') {
            $.ajax({
                url: './php/api.php',
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
    $('#area').on('change', function() {
        var selectedArea = $(this).val();
        console.log(selectedArea);
        var startDate = $('#dataInicial').val();
        var endDate = $('#dataFinal').val();
        intervalo =$('input[name="minuto"]:checked').val();
        // Verificação de campos obrigatórios
        if (startDate === '' || endDate === '') {
            startDate = '';
            endDate = '';
        }
        // Verificação se a data inicial é maior que a data final
        if (new Date(startDate) > new Date(endDate)) {
            let temporaria = endDate;
            endDate = startDate;
            startDate = temporaria;
            $('#dataInicial').val(startDate);
            $('#dataFinal').val(endDate);
        }
        // Obtenção da data atual
        let currentDate = new Date();
        // Verificação se a data inicial é maior que a data atual
        if (new Date(startDate) > currentDate) {
            alert('A data inicial não pode ser maior que a data atual. Insira as datas novamente.');
            startDate = '';  // Limpa o campo data inicial
            endDate = '';    // Limpa o campo data final
            $('#dataInicial').val(''); // Limpa o valor exibido no campo de data inicial
            $('#dataFinal').val('');   // Limpa o valor exibido no campo de data final
        }
        $('#loadingMessage').show();
        $("body").addClass("loading-active");
        if (selectedArea !== '') {
            $.ajax({
                url: './php/api.php',
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
        var selectedArea = $('#area').val();
        var startDate = $('#dataInicial').val();
        var endDate = $('#dataFinal').val();
        intervalo =$('input[name="minuto"]:checked').val();
        // Verificação de campos obrigatórios
        if (startDate === '' || endDate === '') {
            alert('Por favor, preencha tanto a Data Inicial quanto a Data Final.');
            return; // Interrompe a execução se as datas não forem preenchidas
        }
        // Verificação se a data inicial é maior que a data final
        if (new Date(startDate) > new Date(endDate)) {
            alert('A Data Inicial não pode ser maior que a Data Final.');
            return; // Interrompe a execução se as datas estiverem trocadas
        }
        // Obtenção da data atual
        let currentDate = new Date();
        // Verificação se a data inicial é maior que a data atual
        if (new Date(startDate) > currentDate) {
            alert('A data inicial não pode ser maior que a data atual. Insira as datas novamente.');
            startDate = '';  // Limpa o campo data inicial
            endDate = '';    // Limpa o campo data final
            $('#dataInicial').val(''); // Limpa o valor exibido no campo de data inicial
            $('#dataFinal').val('');   // Limpa o valor exibido no campo de data final
        }
        $('#loadingMessage').show();
        $("body").addClass("loading-active");
        console.log(intervalo);
        if (selectedArea !== '') {
            $.ajax({
                url: './php/api.php',
                method: 'GET',
                dataType: 'json',
                data: { area: selectedArea, startDate: startDate, endDate: endDate,dbname:dbName,intervalo:intervalo },
                success: function(data) {
                    if (chart) {
                        chart.destroy();
                    }

                    drawChart(data);   
                    matrix=data;
                    selecionada=selectedArea;                
                    //console.log(data);
                }
            });
        }
    });
    $('#btnPdf').on('click', function() {
        salvarJSONComoPDF(matrix,selecionada,chart);
        $('#loadingMessage').hide();
        $("body").removeClass("loading-active");
    });
    
    // function salvarJSONComoPDF(matrix,selecionada,chart) {
    //     // Criar um documento PDF
    //     let precheca="";
    //     console.log(selecionada);
    //     var imageData = chart.toBase64Image();
    //     for(t in matrix){
    //         precheca+="  "+matrix[t].data+ " \t Temperatura " + matrix[t].temperatura+"°C" + "\t\t Umidade " + matrix[t].umidade +"%" +"\n" ;
    //     }
    //     console.log(precheca);
    //     var docDefinition = {
    //         compress: true,
    //         content: [
    //             { text: selecionada, style: 'header' },
    //             {image: imageData, width: 500}, 
    //             { text: "Histórico de "+selecionada, style: 'header' },
    //             { text: precheca ,style:'corpo'}
    //         ],
    //         styles: {
    //             header: {
    //                 fontSize: 18,
    //                 bold: true,
    //                 marginBottom: 10,
    //                 alignment: 'center'
    //             },
    //             corpo:{
    //                 fontSize: 10,
    //                 bold: false,
    //                 marginBottom: 10,
    //                 alignment: 'justify'
    //             }
    //         }
    //     };

    //     // Gerar o arquivo PDF
    //     if(selecionada){
    //     pdfMake.createPdf(docDefinition).download(selecionada+".pdf");
    //     }
    // }

    function salvarJSONComoPDF(matrix, selecionada, chart) {
        $('#loadingMessage').show();
        $("body").addClass("loading-active");
        // Criar o conteúdo da tabela principal
        let tableBody = [
            [{ text: 'Data', style: 'tableHeader', alignment: 'center' },
             { text: 'Temperatura', style: 'tableHeader', alignment: 'center' },
             { text: 'Umidade', style: 'tableHeader', alignment: 'center' }]
        ];
    
        // Determinar as datas de início e fim
        let dataFinal = matrix[0].data;
        let dataInicial = matrix[matrix.length - 1].data;
    
        // Adicionar os dados à tabela
        matrix.forEach(item => {
            let temperaturaFormatada = parseFloat(item.temperatura).toFixed(1);
            let umidadeFormatada = parseFloat(item.umidade).toFixed(1);
    
            tableBody.push([
                { text: item.data, alignment: 'center' },
                { text: temperaturaFormatada + '°C', alignment: 'center' },
                { text: umidadeFormatada + '%', alignment: 'center' }
            ]);
        });
    
        // Extrair todos os valores de temperatura e umidade
        let temperaturas = matrix.map(item => parseFloat(item.temperatura));
        let umidades = matrix.map(item => parseFloat(item.umidade));
    
        // Calcular os valores máximos, mínimos e médios para temperatura e umidade
        let maxTemperatura = temperaturas.reduce((max, value) => Math.max(max, value), -Infinity);
        let minTemperatura = temperaturas.reduce((min, value) => Math.min(min, value), Infinity);
        let meanTemperatura = temperaturas.reduce((acc, value) => acc + value, 0) / temperaturas.length;
    
        let maxUmidade = umidades.reduce((max, value) => Math.max(max, value), -Infinity);
        let minUmidade = umidades.reduce((min, value) => Math.min(min, value), Infinity);
        let meanUmidade = umidades.reduce((acc, value) => acc + value, 0) / umidades.length;
    
        // Tabela de Resumo (Máximo, Mínimo e Média para Temperatura e Umidade)
        let resumoTableBody = [
            [{ text: 'Resumo', style: 'tableHeader', colSpan: 2, alignment: 'center' }, {}],
            [{ text: 'Máximo Temperatura', alignment: 'left' }, { text: maxTemperatura.toFixed(1) + '°C', alignment: 'center' }],
            [{ text: 'Mínimo Temperatura', alignment: 'left' }, { text: minTemperatura.toFixed(1) + '°C', alignment: 'center' }],
            [{ text: 'Média Temperatura', alignment: 'left' }, { text: meanTemperatura.toFixed(2) + '°C', alignment: 'center' }],
            [{ text: 'Máximo Umidade', alignment: 'left' }, { text: maxUmidade.toFixed(1) + '%', alignment: 'center' }],
            [{ text: 'Mínimo Umidade', alignment: 'left' }, { text: minUmidade.toFixed(1) + '%', alignment: 'center' }],
            [{ text: 'Média Umidade', alignment: 'left' }, { text: meanUmidade.toFixed(2) + '%', alignment: 'center' }]
        ];
    
        var imageData = chart.toBase64Image();
    
        var docDefinition = {
            compress: true,
            content: [
                { text: "Relatório de temperaturas e umidades - " + selecionada, style: 'header' },
                { image: imageData, width: 500, alignment: 'center' },
                { text: "Histórico de " + selecionada, style: 'header' },
                { text: "Início: " + dataInicial + " | Fim: " + dataFinal, bold: true, style: 'corpo' },
    
                // Inserir a tabela de resumo
                {
                    table: {
                        headerRows: 1,
                        widths: ['*', 'auto'],  // Larguras ajustáveis para garantir centralização
                        body: resumoTableBody
                    },
                    layout: 'lightHorizontalLines',
                    alignment: 'center',  // Centraliza a tabela de resumo
                    style: 'corpo',
                    margin: [0, 0, 0, 10]
                },
    
                // Inserir a tabela de dados original
                {
                    table: {
                        headerRows: 1,
                        widths: ['*', 'auto', 'auto'],  // Ajusta as larguras para centralizar
                        body: tableBody
                    },
                    layout: 'lightHorizontalLines',
                    style: 'corpo',
                    alignment: 'center',
                    margin: [0, 0, 0, 10]
                }
            ],
            styles: {
                header: {
                    fontSize: 18,
                    bold: true,
                    marginBottom: 10,
                    alignment: 'center'
                },
                corpo: {
                    fontSize: 12,
                    bold: false,
                    marginBottom: 10,
                    alignment: 'center'
                },
                tableHeader: {
                    bold: true,
                    fontSize: 18,
                    color: 'black',
                    alignment: 'center'  // Centraliza o cabeçalho da tabela
                }
            },
            defaultStyle: {
                alignment: 'center'  // Centraliza o conteúdo padrão
            }
        };
    
        // Gerar o arquivo PDF
        if (selecionada) {
            pdfMake.createPdf(docDefinition).download(selecionada + ".pdf");
        }
    }
    
    
    
    
    
    function updateChart() {
        var selectedArea = $('#area').val();
        var startDate = $('#dataInicial').val();
        var endDate = $('#dataFinal').val();
        if (selectedArea !== '') {
            $.ajax({
                url: './php/api.php',
                method: 'GET',
                dataType: 'json',
                data: { area: selectedArea, startDate: startDate, endDate: endDate, dbname: dbName, intervalo: intervalo },
                success: function(data) {
                    if (chart) {
                        chart.destroy();
                    }
                    drawChart(data, selectedArea);
                    matrix = data;
                    selecionada = selectedArea;
                }
            });
        }
    }

    function drawChart(data) {
        var labels = data.map(function(item) {
            return item.data;
        });

        var temperatureData = data.map(function(item) {
            return item.temperatura;
        });

        var humidityData = data.map(function(item) {
            return item.umidade;
        });

        var ctx = document.getElementById('chart').getContext('2d');
        chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Temperatura',
                        data: temperatureData,
                        borderColor: 'rgb(255, 99, 132)',
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        fill: true
                    },
                    {
                        label: 'Umidade',
                        data: humidityData,
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
        $('#loadingMessage').hide();
        $("body").removeClass("loading-active");
    }
});
