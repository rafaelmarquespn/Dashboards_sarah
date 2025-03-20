$(document).ready(function() {
    let chart; // Variável global para manter uma referência ao gráfico
    const dbName="indrefri";
    let matrix;
    let texto;
    let selecionada;
    let selectedArea = $('#area').val();
    console.log(selectedArea);
    //console.log(('#area').val());
    //if (selectedArea) {
    //    $('#area').val(selectedArea);
    //}
    let intervalo =$('input[name="minuto"]:checked').val();  
    carregarDados();
    //uati=getRoomFromURL();
    //console.log(uati);
    function getRoomFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        console.log(urlParams.get('room'));
        return urlParams.get('room');
    }  
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
        if (selectedArea !== '') {
            $.ajax({
                url: './php/api_freezer.php',
                method: 'GET',
                dataType: 'json',
                data: { area: selectedArea, startDate: startDate, endDate: endDate,dbname:dbName,intervalo:intervalo },
                success: function(data) {
                    if (chart) {
                        chart.destroy();
                    }

                    drawChart(data.dados,selectedArea);
                    matrix=data;
                    selecionada=selectedArea;
                    //MostrarEvenots(data);
                }
            });
        } 
    });
    $('#area').on('change', function() {
        var selectedArea = $(this).val();
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
        if (selectedArea !== '') {
            $.ajax({
                url: './php/api_freezer.php',
                method: 'GET',
                dataType: 'json',
                data: { area: selectedArea, startDate: startDate, endDate: endDate,dbname:dbName,intervalo:intervalo },
                success: function(data) {
                    //console.log(data);
                    if (chart) {
                        chart.destroy();
                    }

                    drawChart(data.dados,selectedArea);
                    matrix=data;
                    selecionada=selectedArea;
                    //MostrarEvenots(data);
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
        if (selectedArea !== '') {
            $.ajax({
                url: './php/api_freezer.php',
                method: 'GET',
                dataType: 'json',
                data: { area: selectedArea, startDate: startDate, endDate: endDate,dbname:dbName,intervalo:intervalo },
                success: function(data) {
                    if (chart) {
                        chart.destroy();
                    }
                    if(data.dados.length>0){
                    drawChart(data.dados);
                    }   
                    //MostrarEvenots(data);
                    matrix=data;
                    selecionada=selectedArea;                
                }
            });
        }
    });
    $('#btnPdf').on('click', function() {
       // $('#loadingMessage').show();
       console.log(matrix.dados.length);
        if (matrix.dados.length > 0){
        salvarJSONComoPDF(matrix,selecionada,chart);
        $('#loadingMessage').hide();
        
    }
    });
    function carregarDados() {
        var selectedArea = $('#area').val();
        var startDate = $('#dataInicial').val();
        var endDate = $('#dataFinal').val();
        intervalo = $('input[name="minuto"]:checked').val();
        if (selectedArea !== '') {
            $.ajax({
                url: './php/api_freezer.php',
                method: 'GET',
                dataType: 'json',
                data: { area: selectedArea, startDate: startDate, endDate: endDate, dbname: dbName, intervalo: intervalo },
                success: function(data) {
                    if (chart) {
                        chart.destroy();
                    }
                    drawChart(data.dados, selectedArea);
                    matrix = data;
                    selecionada = selectedArea;
                }
            });
        }
    }  

    function returnValuesByDateInterval(array, startDate, endDate) {
        console.log("ja");
        return array.filter(object => object.o_time >= startDate && object.o_time <= endDate);
      }
    
      function salvarJSONComoPDF(matrix, selecionada, chart) {
        $('#loadingMessage').show();
        // Criar o conteúdo da tabela principal
        let tableBody = [
            [{ text: 'Data', style: 'tableHeader', alignment: 'center' },
             { text: 'Temperatura', style: 'tableHeader', alignment: 'center' }]
        ];
        
        dataFinal = matrix.dados[0].data;
        dataInicial = matrix.dados[matrix.dados.length - 1].data;
    
        matrix.dados.forEach(item => {
            let temperaturaFormatada = parseFloat(item.t1).toFixed(1);
            tableBody.push([
                { text: item.data, alignment: 'center' },
                { text: temperaturaFormatada + '°C', alignment: 'center' }
            ]);
        });
    
        // Extract all t1 values and convert them to numbers
        let t1Values = matrix.dados.map(item => parseFloat(item.t1));
    
        // Calculate the maximum, minimum and mean values
        let maxT1 = t1Values.reduce((max, value) => Math.max(max, value), -Infinity);
        let minT1 = t1Values.reduce((min, value) => Math.min(min, value), Infinity);
        //let minT1 = Math.min(...t1Values);
        let meanT1 = t1Values.reduce((acc, value) => acc + value, 0) / t1Values.length;
    
        // Tabela de Resumo (Máximo, Mínimo e Média)
        let resumoTableBody = [
            [{ text: 'Resumo', style: 'tableHeader', colSpan: 2, alignment: 'center' }, {}],
            [{ text: 'Máximo', alignment: 'left' }, { text: maxT1.toFixed(1) + '°C', alignment: 'center' }],
            [{ text: 'Mínimo', alignment: 'left' }, { text: minT1.toFixed(1) + '°C', alignment: 'center' }],
            [{ text: 'Média', alignment: 'left' }, { text: meanT1.toFixed(2) + '°C', alignment: 'center' }]
        ];
    
        var imageData = chart.toBase64Image();
    
        var docDefinition = {
            compress: true,
            content: [
                { text: "Relatório de temperaturas - " + selecionada, style: 'header' },
                { image: imageData, width: 500, alignment: 'center' },
                { text: "Histórico de " + selecionada, style: 'header' },
                { text: "Início " + dataInicial + " | Fim " + dataFinal, bold: true, style: 'corpo' },
    
                // Inserir a tabela de resumo
                {
                    table: {
                        headerRows: 1,
                        widths: ['*', 'auto'],  // Garante que as colunas tenham tamanho automático e proporcional
                        body: resumoTableBody
                    },
                    layout: {
                        hLineColor: function (i, node) {
                            return (i === 0 || i === node.table.body.length) ? 'black' : 'gray';
                        },
                        vLineColor: function () {
                            return 'gray';
                        },
                        hLineWidth: function () { return 0.5; },
                        vLineWidth: function () { return 0.5; },
                    },
                    alignment: 'center',  // Centraliza a tabela de resumo
                    style: 'corpo',
                    margin: [0, 0, 0, 10]
                },
    
                // Inserir a tabela original de dados
                {
                    table: {
                        headerRows: 1,
                        widths: ['*', 'auto'],  // Garante que as colunas tenham tamanho automático e proporcional
                        body: tableBody
                    },
                    layout: {
                        hLineColor: function (i, node) {
                            return (i === 0 || i === node.table.body.length) ? 'black' : 'gray';
                        },
                        vLineColor: function () {
                            return 'gray';
                        },
                        hLineWidth: function () { return 0.5; },
                        vLineWidth: function () { return 0.5; },
                    },
                    alignment: 'center',  // Centraliza a tabela de dados
                    style: 'corpo',
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
        console.log("PDF gerado com sucesso!");   
    }
    
    

    function drawChart(data) {
        var anterior = data[0].t1;
        var anterior2 = data[0].t1;
        console.log("desenhando");
    
        for (t in data) {
            if (typeof data[t].t1 == "undefined") {
                delete data[t];
            }
        }
    
        var labels = data.map(function(item) {
            return item.data;
        });
    
        var temperatureData = data.map(function(item) {
            //return item.t1;
            var t1Value = parseFloat(item.t1)
            return t1Value === 98.7 ? 0 : item.t1;
        });
    
        var humidityData = data.map(function(item) {
            return item.t2;
        });
    
        // Calcula a média de t2 (evaporador)
        var t2Sum = humidityData.reduce(function(sum, value) {
            // Converte o valor para número e trata NaN como zero
            var numericValue = parseFloat(value);
            return sum + (isNaN(numericValue) ? 0 : numericValue);
        }, 0);

        var t2Count = humidityData.filter(function(value) {
            // Filtra apenas valores que são números válidos
            return !isNaN(parseFloat(value));
        }).length;

        var t2Average = t2Count > 0 ? t2Sum / t2Count : 0;
        console.log(t2Average);
        // Configura os datasets do gráfico
        var datasets = [
            {
                label: 'Temperatura',
                data: temperatureData,
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                fill: false
            }
        ];
    
        // Adiciona o dataset de Evaporador somente se a média for menor ou igual a 50
        /*if (t2Average <= 50) {
            datasets.push({
                label: 'Evaporador',
                data: humidityData,
                borderColor: 'rgb(54, 162, 235)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                fill: false
            });
        }
        */
        var ctx = document.getElementById('chart').getContext('2d');
        chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: datasets
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
    } 
});