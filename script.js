document.getElementById("processButton").addEventListener("click", function() {
    var inputText = document.getElementById("inputText").value;

    var datetimeRegex = /In\s+PACU\s+(\d{2}\/\d{2}\/\d{2}\s+\d{2}:\d{2}:\d{2})[^0-9]+Ready\s+for\s+Discharge\s+(\d{2}\/\d{2}\/\d{2}\s+\d{2}:\d{2}:\d{2})/i;

    var match = inputText.match(datetimeRegex);

    if (match) {
        var startTime = parseDateTime(match[1]);
        var endTime = parseDateTime(match[2]);

        if (startTime && endTime) {
            var timeDifference = (endTime - startTime) / (1000 * 60);

            var formattedStartDate = formatDate(startTime);
            var formattedEndDate = formatDate(endTime);

            var outputDiv = document.getElementById("output");
            outputDiv.innerHTML = "Time In PACU: " + formattedStartDate + ", " + startTime.toLocaleTimeString('en-GB') + "<br>"
                + "Time Ready for Discharge: " + formattedEndDate + ", " + endTime.toLocaleTimeString('en-GB') + "<br>"
                + "Time Difference (minutes): " + timeDifference;

            document.getElementById("formattedDate").textContent = formattedStartDate;
        } else {
            var outputDiv = document.getElementById("output");
            outputDiv.innerHTML = "Invalid date/time format.";
            document.getElementById("formattedDate").textContent = ""; // Clear the formatted date
        }
    } else {
        var outputDiv = document.getElementById("output");
        outputDiv.innerHTML = "Times not found or not in expected format.";
        document.getElementById("formattedDate").textContent = ""; // Clear the formatted date
    }
});

document.getElementById("clearButton").addEventListener("click", function() {
    document.getElementById("inputText").value = "";
    document.getElementById("output").innerHTML = "";
    document.getElementById("formattedDate").textContent = ""; // Clear the formatted date
});

document.getElementById("copyButton").addEventListener("click", function() {
    var formattedDate = document.getElementById("formattedDate").textContent;

    if (formattedDate) {
        var tempTextArea = document.createElement("textarea");
        tempTextArea.value = formattedDate;

        document.body.appendChild(tempTextArea);
        tempTextArea.select();
        document.execCommand("copy");
        document.body.removeChild(tempTextArea);

        alert("Formatted date copied to clipboard!");
    }
});

function parseDateTime(datetimeString) {
    var parts = datetimeString.split(/\s+/);
    if (parts.length === 2) {
        var datePart = parts[0];
        var timePart = parts[1];
        var dateParts = datePart.split("/");
        if (dateParts.length === 3) {
            var day = parseInt(dateParts[0]);
            var month = parseInt(dateParts[1]);
            var year = parseInt("20" + dateParts[2]);
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

function formatDate(date) {
    var day = String(date.getDate()).padStart(2, "0");
    var monthAbbrev = date.toLocaleString('default', { month: 'short' });
    var year = date.getFullYear();
    return day + "-" + monthAbbrev + "-" + year;
}

