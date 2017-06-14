/**
 * background.js - background listener
 *
 * @author ravikiranj
 * @since June 2017
 */
function fixSqlFileContentTypeHeader() {
    chrome.webRequest.onHeadersReceived.addListener(
        // callback
        function (details) {
            if (!details.responseHeaders || !Array.isArray(details.responseHeaders)) {
                return;
            }

            for (var i = 0; i < details.responseHeaders.length; i++) {
                var header = details.responseHeaders[i];
                if (header && header.name && header.name.toLowerCase() == "content-type") {
                    header.value = "inline";
                }
            }
            return {responseHeaders: details.responseHeaders};
        },
        // filters
        {
            urls: ["*://*/*.sql"]
        },
        // extraInfoSpec
        [
            "blocking",
            "responseHeaders"
        ]
    );
}

function initWorkers() {
    chrome.runtime.onConnect.addListener(function(port) {
        port.onMessage.addListener(function(msg) {
            var workerFormatter;

            function onWorkerFormatterMessage(event) {
                workerFormatter.removeEventListener("message", onWorkerFormatterMessage, false);
                workerFormatter.terminate();
                port.postMessage({
                    type: "sqlToHtml",
                    html: event && event.data && event.data.html ? event.data.html : null
                });
            }

            if (msg.type === "rawToSql") {
                if (!workerFormatter) {
                    workerFormatter = new Worker("js/workerFormatter.js");
                    workerFormatter.onmessage = onWorkerFormatterMessage;
                }
                workerFormatter.postMessage({
                    rawSql: msg.data
                });
            }
        });
    });
}

function init() {
    fixSqlFileContentTypeHeader();
    initWorkers();
}

init();
