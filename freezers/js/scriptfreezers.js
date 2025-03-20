$(document).ready(function() {
    let chart; // Variável global para manter uma referência ao gráfico
    const dbName="indrefri";
    let matrix;
    let texto;
    let selecionada;
    let intervalo =$('input[name="minuto"]:checked').val();
    $.ajax({
        url: 'fetch_freezer.php',
        dataType: 'html',
        success: function(data) {
            $('#area').html(data);
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
                url: 'api_freezer.php',
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
                    MostrarEvenots(data);
                }
            });
        } 
    });
    $('#area').on('change', function() {
        var selectedArea = $(this).val();
        var startDate = $('#dataInicial').val();
        var endDate = $('#dataFinal').val();
        intervalo =$('input[name="minuto"]:checked').val();
        console.log(selectedArea);
        if (selectedArea !== '') {
            $.ajax({
                url: 'api_freezer.php',
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
                    MostrarEvenots(data);
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
                url: 'api_freezer.php',
                method: 'GET',
                dataType: 'json',
                data: { area: selectedArea, startDate: startDate, endDate: endDate,dbname:dbName,intervalo:intervalo },
                success: function(data) {
                    if (chart) {
                        chart.destroy();
                    }

                    drawChart(data.dados);   
                    MostrarEvenots(data);
                    selecionada=selectedArea;                
                }
            });
        }
    });
    $('#btnPdf').on('click', function() {
        salvarJSONComoPDF(matrix,selecionada,chart);
    });
    function MostrarEvenots(matrix){
        var alarmes=['Alarme de Temperatura Alta','Alarme de Temperatura Baixa','Alarme de Falta de Energia','Alarme de Porta Aberta',
        'Alarme de Bateria Fraca','Degelo','Porta Aberta'];

        var jsonContainer = document.getElementById('jsonContainer');
            // Sort the array by 's_time' property
        var eventosArray=Object.values(matrix.eventos);
        eventosArray.forEach(element => {
            element.o_status=  element.o_status ==="I" ? "Início":"Fim";
            element.s_time=new Date(element.s_time);
            element.o_time=new Date(element.o_time);
        });
        var dadosArr=Object.values(matrix.dados);
        dadosArr.forEach(element => {
            element.s_time=new Date(element.s_time);
        });
        var i=0;
        let inicio;
        let fim;
        let listaCp=[];
        dadosArr.forEach(evento => {
            listaCp.push(evento);
            inicio=evento.s_time;
            if(i<dadosArr.length-1){
                fim=dadosArr[i+1].s_time;
            }
            i+=1;
            var result = returnValuesByDateInterval(eventosArray,fim, inicio);
            result.forEach(element => {
                listaCp.push(element);
            });
        });
        let fundido=listaCp;
        fundido.sort(function(a, b) {
            var dataA = a.s_time;
            var dataB = b.s_time;
            return dataB - dataA;
            });
        texto="";
            for (t in fundido){
                var evento=fundido[t].ev_idEvento?fundido[t].ev_idEvento:"";
                let stautos="";
                stautos=fundido[t].o_status?fundido[t].o_status:"log Temp";
                if(alarmes.includes(evento)){               
                texto+=" Data "+moment(fundido[t].s_time).format('DD/MM/YYYY HH:mm:ss')+ " Temperatura " + fundido[t].s_t1+"°C" + " Evaporador " + fundido[t].s_t2 +"°C " + evento +" " + stautos + " \n" ;
                }
                else if(evento===""){
                    texto+=" Data "+moment(fundido[t].s_time).format('DD/MM/YYYY HH:mm:ss')+ " Temperatura " + fundido[t].s_t1+"°C" + " Evaporador " + fundido[t].s_t2 +"°C " + evento +" " + stautos + " \n" ;
                }
            }
        jsonContainer.textContent = texto;
        return texto;
    };
    function returnValuesByDateInterval(array, startDate, endDate) {
        console.log("ja");
        return array.filter(object => object.o_time >= startDate && object.o_time <= endDate);
      }
    function salvarJSONComoPDF(matrix,selecionada,chart) {
        // Criar um documento PDF
        let precheca="";
        //console.log("oila");
        var imageData = chart.toBase64Image();
        var alarmes=['Alarme de Temperatura Alta','Alarme de Temperatura Baixa','Alarme de Falta de Energia','Alarme de Porta Aberta',
        'Alarme de Bateria Fraca','Degelo','Porta Aberta'];
        //console.log(Object.keys(matrix.eventos).length);
    // Definindo o texto JSON no elemento <pre>
        //console.log(fundido);
            // Sort the array by 's_time' property
        texto=MostrarEvenots(matrix);    
        jsonContainer.textContent = texto;
        precheca=texto;
        //console.log(precheca);
        var docDefinition = {
            compress: true,
            content: [
                { text: selecionada, style: 'header' },
                {image: imageData, width: 500}, 
                { text: "Histórico de "+selecionada, style: 'header' },
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
        var anterior=data[0].s_t1;
        var anterior2=data[0].s_t1;
        console.log("desenhadnp");
        for(t in data){
            if (typeof data[t].s_t1=="undefined"){
                delete data[t];
            }
        }
        var labels = data.map(function(item) {
            return item.s_time;
        });

        var temperatureData = data.map(function(item) {
            /*if (typeof item.s_t1=="undefined"){
                item.s_t1=anterior;
            }else{
                anterior=item.s_t1;
            }
            */
            return item.s_t1;
        });

        var humidityData = data.map(function(item) {
            return item.s_t2;
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
                        fill: false
                    },
                    {
                        label: 'Evaporador',
                        data: humidityData,
                        borderColor: 'rgb(54, 162, 235)',
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        fill: false
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
