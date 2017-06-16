(function(mod) {
    if (typeof exports == "object" && typeof module == "object") // CommonJS
        mod(require("codemirror/lib/codemirror"));
    else if (typeof define == "function" && define.amd) // AMD
        define(["codemirror/lib/codemirror"], mod);
    else // Plain browser env
        mod(CodeMirror);
})(function(CodeMirror) {

    // MINIFY and PRETTIFY helpers
    var minifySqlStatement = function(text) {
        var fixedText = text + ";";
        return fixedText.replace(/\s{1,}/g," ").replace(/\s{1,}\(/,"(").replace(/\s{1,}\)/,")").trim();
    };

    var minifySql = function(selText) {
        var rawSqlStatements = selText.split(";"),
            minifiedSqlStatements = $.map(rawSqlStatements, minifySqlStatement),
            formattedSql = minifiedSqlStatements.filter(nonEmptySqlFilter).join("\n\n")
        ;
        return formattedSql;
    };

    var formatSqlStatement = function(rawSqlStatement) {
        if (rawSqlStatement && rawSqlStatement.length > 0) {
            return sqlFormatter.format(rawSqlStatement + ";", "SQL");
        }
        return "";
    };

    var nonEmptySqlFilter = function(str) {
        return str && str.length > 0 && str !== ";" && str !== ";\n";
    };

    var getPrettySql = function(selText) {
        var rawSqlStatements = selText.split(";"),
            formattedSqlStatements = $.map(rawSqlStatements, formatSqlStatement),
            formattedSql = formattedSqlStatements.filter(nonEmptySqlFilter).join("\n")
        ;
        return formattedSql;
    };

    // EXPLAIN and UNEXPLAIN helpers
    var explainString = "EXPLAIN ";

    var explainSqlStatement = function(str) {
        var selText = (str + ";").trim();
        return selText.toUpperCase().startsWith(explainString) ? selText : (explainString + selText);
    };

    var unExplainSqlStatement = function(str) {
        var selText = (str + ";").trim();
        return selText.replace(new RegExp("^" + explainString, "i"), "");
    };

    var getExplainSql = function(selText) {
        var rawSqlStatements = selText.split(";"),
            explainSqlStatements = $.map(rawSqlStatements, explainSqlStatement),
            explainSql = explainSqlStatements.filter(nonEmptySqlFilter).join("\n\n")
        ;
        return explainSql;
    };

    var getUnExplainSql = function(selText) {
        var rawSqlStatements = selText.split(";"),
            unExplainSqlStatements = $.map(rawSqlStatements, unExplainSqlStatement),
            unexplainSql = unExplainSqlStatements.filter(nonEmptySqlFilter).join("\n\n")
        ;
        return unexplainSql;
    };

    // Explain/Unexplain the specified range
    CodeMirror.defineExtension("explainRange", function (isExplain, from, to) {
        var cm = this;
        cm.operation(function() {
            if (isExplain) { // Explain range
                var selText = cm.getRange(from, to);
                cm.replaceRange(getExplainSql(selText), from, to);
            } else { // UnExplain range
                var selText = cm.getRange(from, to);
                cm.replaceRange(getUnExplainSql(selText), from, to);
            }
        });
    });

   // Minify/Prettify the specified range
    CodeMirror.defineExtension("minifyRange", function (isMinify, from, to) {
        var cm = this;
        cm.operation(function() {
            if (isMinify) { // Minify range
                var selText = cm.getRange(from, to);
                cm.replaceRange(minifySql(selText), from, to);
            } else { // Prettify range
                var selText = cm.getRange(from, to);
                cm.replaceRange(getPrettySql(selText), from, to);
            }
        });
    });
});
