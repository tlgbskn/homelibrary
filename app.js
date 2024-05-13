document.addEventListener('DOMContentLoaded', function () {
    let isbnList = [];

    function startScanner() {
        Quagga.init({
            inputStream: {
                name: "Live",
                type: "LiveStream",
                target: document.querySelector('#interactive'),
                constraints: {
                    facingMode: "environment"
                }
            },
            decoder: {
                readers: ["ean_reader"]
            },
            locate: true
        }, function (err) {
            if (err) {
                console.error(err);
                return;
            }
            console.log("Initialization finished. Ready to start");
            Quagga.start();
        });
    }

    Quagga.onDetected(function (result) {
        let isbn = result.codeResult.code;
        isbnList.push(isbn);
        document.getElementById('results').innerHTML = 'Detected ISBN: ' + isbn + '<br> Başarılı! Yeni bir okuma yapmak ister misiniz? <button onclick="continueReading()">Devam</button> <button onclick="saveAndExit()">Sonlandır</button>';
        Quagga.stop();
    });

    window.continueReading = function () {
        startScanner();
    };

    window.saveAndExit = function () {
        let wb = XLSX.utils.book_new();
        let ws = XLSX.utils.aoa_to_sheet([["ISBN"]].concat(isbnList.map(isbn => [isbn])));
        XLSX.utils.book_append_sheet(wb, ws, "ISBNs");
        XLSX.writeFile(wb, "ISBN_List.xlsx");
    };

    startScanner();
});
