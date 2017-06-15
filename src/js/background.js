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
                if (header && header.name && header.name.toLowerCase() === "content-type") {
                    header.value = "inline";
                }
            }
            return { responseHeaders: details.responseHeaders };
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

function init() {
    fixSqlFileContentTypeHeader();
}

init();
