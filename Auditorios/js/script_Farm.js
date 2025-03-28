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
    $('#area').on('change', function() {
        var selectedArea = $(this).val();
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
        var selectedArea = $('#area').val();
        var startDate = $('#dataInicial').val();
        var endDate = $('#dataFinal').val();
        intervalo =$('input[name="minuto"]:checked').val();
        console.log(intervalo);
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
        // Criar um documento PDF
        let tableBody = [
            [{ text: 'Data', style: 'tableHeader' },
             { text: 'Temperatura', style: 'tableHeader' },
             { text: 'Umidade', style: 'tableHeader' }]
        ];
    
        matrix.forEach(item => {
            let temperaturaFormatada = parseFloat(item.temperatura).toFixed(1);
            let umidadeFormatada = parseFloat(item.umidade).toFixed(1);
    
            tableBody.push([
                item.data,
                temperaturaFormatada + '°C',
                umidadeFormatada + '%'
            ]);
        });
    
        var imageData = chart.toBase64Image();
    
        var docDefinition = {
            compress: true,
            content: [
                { text:"Relatório de temperaturas e umidades - " + selecionada, style: 'header' },
                { image: imageData, width: 500, alignment: 'center' },
                { text: "Histórico de " + selecionada, style: 'header' },
                {
                    table: {
                        headerRows: 1,
                        widths: ['auto', 'auto', 'auto'],
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
                    color: 'black'
                }
            },
            defaultStyle: {
                alignment: 'center'
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
                url: 'api.php',
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
    }
});
