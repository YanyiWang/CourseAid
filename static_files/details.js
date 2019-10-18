/* Credits to Mike Dearman, who helped a user on stackoverflow created this converter : https://jsfiddle.net/mdearman/d1zpndcu/ 
    Used to convert the table found in details.html to a downloadbale csv file.
*/
function exportTableToCSV(html, filename) {
    var csv = [];
    var rows = document.querySelectorAll("table tr");

    for(var i = 0; i < rows.length; i++){
        var row = [], cols = rows[i].querySelectorAll("td, th");
        for(var j = 0; j < cols.length; j++){
            row.push(cols[j].innerText);
        }
        csv.push(row.join(","));
    }

    // download csv file
    downloadCSV(csv.join("\n"), filename);
}

function downloadCSV(csv, filename) {
    var csvFile;
    var downloadLink;

	if (window.Blob == undefined || window.URL == undefined || window.URL.createObjectURL == undefined) {
		alert("Your browser doesn't support Blobs");
		return;
	}
	
    csvFile = new Blob([csv], {type:"text/csv"});
    downloadLink = document.createElement("a");
    downloadLink.download = filename;
    downloadLink.href = window.URL.createObjectURL(csvFile);
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
    downloadLink.click();
}