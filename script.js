// Function to process the text
function processText() {
    var inputText = document.getElementById("inputText").value;

    var datetimeRegex = /In\s+PACU\s+(\d{2}\/\d{2}\/\d{2}\s+\d{2}:\d{2}:\d{2})[^0-9]+Ready\s+for\s+Discharge\s+(\d{2}\/\d{2}\/\d{2}\s+\d{2}:\d{2}:\d{2})/i;

    var match = inputText.match(datetimeRegex);

    if (match) {
        var startTime = parseDateTime(match[1]);
        var endTime = parseDateTime(match[2]);

        if (startTime && endTime) {
            var timeDifference = (endTime - startTime) / (1000 * 60); // Convert to minutes

            var formattedStartDate = formatDate(startTime);
            var formattedEndDate = formatDate(endTime);

            var outputDiv = document.getElementById("output");
            outputDiv.innerHTML = "Time In PACU: " + formattedStartDate + ", " + startTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) + "<br>"
                + "Time Ready for Discharge: " + formattedEndDate + ", " + endTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) + "<br>"
                + "Time Difference (minutes): " + timeDifference + "<br>"
                + "This date is a " + isWeekdayOrWeekend(startTime) + "<br>";
		document.getElementById("formattedDate").textContent = formattedStartDate;
		document.getElementById("redcapDate").textContent = formatDateRedcap(startTime);
		generatePostopDates(startTime);
        } else {
            var outputDiv = document.getElementById("output");
            outputDiv.innerHTML = '<span style="color: red; font-weight: bold;">⚠ Invalid date/time format.</span>';
            document.getElementById("formattedDate").textContent = "";
            document.getElementById("redcapDate").textContent = "";
            document.getElementById("postopDates").innerHTML = "";
        }
    } else {
        var outputDiv = document.getElementById("output");
        outputDiv.innerHTML = '<span style="color: red; font-weight: bold;">⚠ Times not found or not in the expected format.</span>';
        document.getElementById("formattedDate").textContent = "";
        document.getElementById("redcapDate").textContent = "";
        document.getElementById("postopDates").innerHTML = "";
    }
}

function copyElementToClipboard(elementId, label) {
    var text = document.getElementById(elementId).textContent;
    if (text) {
        var tempTextArea = document.createElement("textarea");
        tempTextArea.value = text;
        document.body.appendChild(tempTextArea);
        tempTextArea.select();
        document.execCommand("copy");
        document.body.removeChild(tempTextArea);
        alert(label + " copied to clipboard!");
    }
}

function copyiEmrDate() {
    copyElementToClipboard("formattedDate", "iEMR date");
}

function copyRedcapDate() {
    copyElementToClipboard("redcapDate", "REDCap date");
}

function processAndCopy() {
    processText();
    copyiEmrDate();
}

function parseDateTime(datetimeString) {
    var parts = datetimeString.split(/\s+/);
    if (parts.length === 2) {
        var datePart = parts[0];
        var timePart = parts[1];
        var dateParts = datePart.split("/");
        if (dateParts.length === 3) {
            var day = parseInt(dateParts[0]);
            var month = parseInt(dateParts[1]);
            var year = parseInt("20" + dateParts[2]); // Assuming yy is in the 21st century
            var timeParts = timePart.split(":");
            if (timeParts.length === 3) {
                var hours = parseInt(timeParts[0]);
                var minutes = parseInt(timeParts[1]);
                var seconds = parseInt(timeParts[2]);
                return new Date(year, month - 1, day, hours, minutes, seconds);
            }
        }
    }
    return null;
}

var MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
var DAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

function formatDate(date) {
    var day = String(date.getDate()).padStart(2, "0");
    var monthAbbrev = MONTHS[date.getMonth()];
    var year = date.getFullYear();
    return day + "-" + monthAbbrev + "-" + year;
}

function formatDateRedcap(date) {
    var day = String(date.getDate()).padStart(2, "0");
    var month = String(date.getMonth() + 1).padStart(2, "0");
    var year = date.getFullYear();
    return day + "-" + month + "-" + year;
};


function generatePostopDates(startDate) {
    var labels = [
        "Date of surgery",
        "Day 1 post op",
        "Day 2 post op",
        "Day 3 post op",
        "Day 4 post op",
        "Day 5 post op"
    ];
    var html = "<br>";
    for (var i = 0; i < labels.length; i++) {
        var d = new Date(startDate);
        d.setDate(d.getDate() + i);
        var formatted = formatDate(d);
        var id = "postop-" + i;
        html += '<div>' + labels[i] + ': <span id="' + id + '">' + formatted + '</span>'
              + ' (' + DAYS[d.getDay()] + ')'
              + ' <button onclick="copyElementToClipboard(\'' + id + '\', \'' + labels[i] + '\')">Copy</button></div>';
    }
    document.getElementById("postopDates").innerHTML = html;
}

function isWeekdayOrWeekend(date) {
    const dayOfWeek = date.getDay();
    const dayName = DAYS[dayOfWeek];
    if (dayOfWeek === 0 || dayOfWeek === 6) {
        return "***" + dayName + "***";
    } else {
        return dayName;
    }
}


document.getElementById("processButton").addEventListener("click", processText);
document.getElementById("processAndCopyButton").addEventListener("click", processAndCopy);
document.getElementById("clearButton").addEventListener("click", function() {
    document.getElementById("inputText").value = "";
    document.getElementById("output").innerHTML = "";
    document.getElementById("formattedDate").textContent = "";
    document.getElementById("redcapDate").textContent = "";
    document.getElementById("postopDates").innerHTML = "";
});
