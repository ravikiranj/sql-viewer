var sqlViewer = (function($) {
    "use strict";
    // Private
    var body = $("body"),
        codeMirror,
        sqlMode = "text/x-sql"
    ;

    // Public
    return  {
        getData: function() {
            var bodyChildren = body.children()
            ;
            if (body && bodyChildren.length < 1) {
                return body[0].innerText;
            }

            if (bodyChildren[0].tagName == "PRE") {
                return bodyChildren[0].innerText;
            }

            return null;
        },

        formatSqlStatement: function(rawSqlStatement) {
            if (rawSqlStatement && rawSqlStatement.length > 0) {
                return sqlFormatter.format(rawSqlStatement + ";", "SQL");
            }
            return "";
        },

        nonEmptySqlFilter: function(str) {
            return str && str.length > 0 && str !== ";\n";
        },

        display: function(rawData) {
            var rawSqlStatements = rawData.split(";"),
                formattedSqlStatements = $.map(rawSqlStatements, this.formatSqlStatement),
                formattedSql = formattedSqlStatements.filter(this.nonEmptySqlFilter).join("\n")
            ;
            
            $("body").html("<div id='SQLVIEWER'></div>");
            codeMirror = CodeMirror(document.getElementById("SQLVIEWER"), {
                value: formattedSql,
                mode: sqlMode,
                indentUnit: 4,
                lineNumbers: true,
                readOnly: true,
                foldGutter: true,
                gutters: ["CodeMirror-foldgutter"]
            });
            codeMirror.setSize("100%", "100%");
        },

        init : function() {
            var data = this.getData();
            if (!data) {
                return;
            }
            this.display(data);
        }
    };
})(jQuery);

sqlViewer.init();
