$(document).ready(function() {
    let chart; // Variável global para manter uma referência ao gráfico
    const dbName="multimedidores";
    let matrix;
    let selecionada;
    let intervalo =$('input[name="minuto"]:checked').val();
    $.ajax({
        url: 'fetch_quadros.php',
        dataType: 'html',
        success: function(data) {
            $('#area').html(data);
            console.log($('#area').val());
        }
    });
    $('input[type=radio]').change(function() {
        var selectedArea = $('#area').val();
        console.log(selectedArea);
        var startDate = $('#dataInicial').val();
        var endDate = $('#dataFinal').val();
        intervalo =$('input[name="minuto"]:checked').val();
        if (selectedArea !== '') {
            $.ajax({
                url: 'api_multimedidores.php',
                method: 'GET',
                dataType: 'json',
                data: { area: selectedArea, startDate: startDate, endDate: endDate,dbname:dbName,intervalo:intervalo },
                success: function(data) {
                    if (chart) {
                        chart.destroy();
                    }
                    console.log(data);
                    drawChart(data);
                    matrix=data;
                    //selecionada=selectedArea;
                }
            });
        } 
    });
    $('#area').on('change', function() {
        var selectedArea = $(this).val();
        var selecionada = $("#area option:selected").text();
        console.log(selecionada);
        console.log(selectedArea);
        var startDate = $('#dataInicial').val();
        var endDate = $('#dataFinal').val();
        intervalo =$('input[name="minuto"]:checked').val();
        if (selectedArea !== '') {
            $.ajax({
                url: 'api_multimedidores.php',
                method: 'GET',
                dataType: 'json',
                data: { area: selectedArea, startDate: startDate, endDate: endDate,dbname:dbName,intervalo:intervalo },
                success: function(data) {
                    if (chart) {
                        chart.destroy();
                    }
                    console.log(data);
                    drawChart(data);
                    matrix=data;
                }
            });
        }
    });

    $('#btnEnviar').on('click', function() {
        var selectedArea = $('#area').val();
        var startDate = $('#dataInicial').val();
        var endDate = $('#dataFinal').val();

        intervalo =$('input[name="minuto"]:checked').val();
        if (selectedArea !== '') {
            $.ajax({
                url: 'api_multimedidores.php',
                method: 'GET',
                dataType: 'json',
                data: { area: selectedArea, startDate: startDate, endDate: endDate,dbname:dbName,intervalo:intervalo },
                success: function(data) {
                    if (chart) {
                        chart.destroy();
                    }

                    drawChart(data);   
                    matrix=data;
                    //let selecionada = $('#area').text();
                }
            });
        }
    });
    $('#btnPdf').on('click', function() {
        var selecionada = $("#area option:selected").text();
        salvarJSONComoPDF(matrix,selecionada,chart);

    });
    function salvarJSONComoPDF(matrix,selecionada,chart) {
        // Criar um documento PDF
        let precheca="";
        console.log(selecionada);
        var imageData = chart.toBase64Image();
        for(t in matrix){
            precheca+=matrix[t].Data_Da_Leitura+ "  " + matrix[t].CorrenteA+"A (Fase A)" + "    " + matrix[t].VoltagemA_B +" V (Fase A->B) " +"\n" ;
        }
        console.log(precheca);
        var docDefinition = {
            compress: true,
            content: [
                { text: selecionada, style: 'header' },
                {image: imageData, width: 500}, 
                { text: "Histórico de "+ selecionada, style: 'header' },
                { text: precheca ,style:'corpo'}
            ],
            styles: {
                header: {
                    fontSize: 18,
                    bold: true,
                    marginBottom: 10,
                    alignment: 'center'
                },
                corpo:{
                    fontSize: 10,
                    bold: false,
                    marginBottom: 10,
                    alignment: 'justify'
                }
            }
        };

        // Gerar o arquivo PDF
        if(selecionada){
        pdfMake.createPdf(docDefinition).download(selecionada+".pdf");
        }
    }

    function drawChart(data) {
        var labels = data.map(function(item) {
            return item.Data_Da_Leitura;
        });

        var temperatureData = data.map(function(item) {
            return item.CorrenteA;
        });

        var humidityData = data.map(function(item) {
            return item.VoltagemA_B;
        });
        var Potensa = data.map(function(item) {
            return item.VoltagemA_B;
        });

        var ctx = document.getElementById('chart').getContext('2d');
        chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Corrente fase A',
                        data: temperatureData,
                        borderColor: 'rgb(255, 99, 132)',
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        fill: true
                    },
                    {
                        label: 'Tensão fase A -> B',
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
