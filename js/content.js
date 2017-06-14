var sqlViewer = (function($) {
    var port = chrome.runtime.connect(),
        _getData = function() {
            var body = $("body"),
                bodyChildren = body.children()
            ;
            if (body && bodyChildren.length < 1) {
                return body[0].innerText;
            }

            if (bodyChildren[0].tagName == "PRE") {
                return bodyChildren[0].innerText;
            }

            return null;
        }
    ;

    return  {
        processData: function(data) {
            port.postMessage({
                type : "rawToSql",
                data : data
            });
        },

        displayUI: function(content) {
            var fixedContent = content.replace(new RegExp("\n", "g"), "</br>");
            $("body").html(fixedContent);
        },

        initWorkerResponseHandler: function() {
            // Handle response
            var self = this;
            port.onMessage.addListener(function(msg) {
                switch (msg.type) {
                    case "sqlToHtml":
                        if (msg.html && msg.html.value) {
                            self.displayUI(msg.html.value);
                        }
                        break;
                    default:
                        break;
                }
            });
        },

        init : function() {
            var data = _getData();
            if (!data) {
                return;
            }
            this.initWorkerResponseHandler(data);
            this.processData(data);
        }
    }

})(jQuery);

sqlViewer.init();
