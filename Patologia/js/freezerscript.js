$(document).ready(function() {
    let chart; // Variável global para manter uma referência ao gráfico
    let dbName="indrefri";
    let matrix;
    let texto;
    let texto_url
    let selecionada;
    let selectedArea = $('#area').val();
    console.log(selectedArea);
    const dicio = {
        'escravo15': 'MICROBIOLOGIA',
        'escravo20': 'MICROBIOLOGIA_II',
        'escravo12': 'IMUNOLOGIA',
        'escravo11': 'IMUNOLOGIA_I',
        'escravo9': 'CITOGENETICA_II',
        'escravo8': 'CITOGENETICA_I',
        'escravo5': 'HEMATOLOGIA',
        'escravo13': 'BIOQUIMICA_I',
        'escravo14': 'BIOQUIMICA_II',
        'escravo10': 'Bioquimica_Genetica',
        'escravo19': 'BIOLOGIA_MOLECULAR',
        'escravo21': 'IMUNOLOGIA_IV',
        'escravo22': 'IMUNOLOGIA_II',
        'escravo1': 'BIOQUIMICA_ANALITICA',
        'escravo2': 'BIOQUIMICA_GENETICA_II',
        'serial_53443': 'Bioquimica',
        'serial_53449': 'Hematologia_II',
        'serial_53450': 'Reserva',
        'serial_65274': 'Amostras_Processadas',
        'serial_65275': 'Imuno_I',
        'serial_65276': 'Imuno_II',
        'serial_65277': 'Microbiologia_IV',
        'serial_65282': 'Microbiologia_III',
        'serial_956281': 'Transfusional_Congelador',
        'serial_65281': 'Transfusional_Refrigerador',
        'serial_165279': 'Transfusional_II_Superior',
        'serial_652801': 'Coprologia_Inferior',
        'serial_65280': 'Coprologia_Superior',
        'serial_53478': 'Citogenetica',
        'serial_65279': 'Transfusional_II_Inferior',
        'serial_53441': 'Patologia_098367',
        'serial_53446': 'Microbiologia_32',
        'serial_53453': '',
        'serial_53454': 'Patologia__098368',
        'serial_53455': 'Microbiologia_30',
        'serial_53458': 'Microbiologia_31',
        'serial_53461': '',
        'serial_53464': 'Patologia_098369',
        'serial_53465': '',
        'serial_53474': 'Patologia_098364',
        'serial_53476': 'Citogenetica_61006',
        'serial_53481': ''
    };

    //console.log(('#area').val());
    //if (selectedArea) {
    //    $('#area').val(selectedArea);
    //}
    let intervalo =$('input[name="minuto"]:checked').val();  
    escolheApi();
    //uati=getRoomFromURL();
    //console.log(uati);
    function getRoomFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        console.log(urlParams.get('room'));
        return urlParams.get('room');
    }
    function setRoomFromURL(selectedArea) {
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set('room', selectedArea); // Corrige o formato para `set(key, value)`
        window.history.replaceState(null, '', '?' + urlParams.toString()); // Atualiza o URL sem recarregar a página
    }
     
    carregarDados();
    $('input[type=radio]').change(function() {
        selectedArea = $('#area').val();
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
                url: texto_url,
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
        selectedArea = $(this).val();
        //propriedade=$(this).val();
        //console.log(propriedade);
        setRoomFromURL(dicio[selectedArea]);
        console.log("passou");
        escolheApi();
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
                url: texto_url,
                method: 'GET',
                dataType: 'json',
                data: { area: selectedArea, startDate: startDate, endDate: endDate,dbname:dbName,intervalo:intervalo },
                success: function(data) {
                    //console.log(data);
                    if (chart) {
                        chart.destroy();
                    }
                    if(data.dados.length>0){
                        drawChart(data.dados,selectedArea);
                    }  
                    if(data.dados.length == 0){
                        setTimeout(function(){
                            $('#loadingMessage').hide();
                        }, 2000); // Delay de 2 segundos
                    }
                    
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
                url: texto_url,
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
                    if(data.dados.length == 0){
                        setTimeout(function(){
                            $('#loadingMessage').hide();
                        }, 2000); // Delay de 2 segundos
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
        let selectedArea = $('#area').val();
        var startDate = $('#dataInicial').val();
        var endDate = $('#dataFinal').val();
        intervalo = $('input[name="minuto"]:checked').val();
        if (selectedArea !== '') {
            $.ajax({
                url: texto_url,
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
    function escolheApi(){
        const gelas_pat = ['Citogenetica_61006','Patologia_098367','Patologia__098368','Patologia_098369','Patologia_098364','Microbiologia_30','Microbiologia_31','Microbiologia_32','Transfusional_II_Inferior','Transfusional_II_Superior','Coprologia_Inferior','Coprologia_Superior','Citogenetica','Transfusional_Refrigerador','Transfusional_Congelador','Hematologia_II','Reserva','Microbiologia_III','Microbiologia_IV','Amostras_Processadas','Imuno_II','Imuno_I','Bioquimica'];
    for (let i = 0; i < gelas_pat.length; i++) {
         if (getRoomFromURL() == gelas_pat[i]) {
             texto_url = './php/api_patologia.php';
                dbName="refrigeradores_patologia";
             console.log("check1");
             break;
         }
         texto_url = './php/api_freezer.php';
         console.log("check2");
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
