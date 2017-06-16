(function(mod) {
    if (typeof exports == "object" && typeof module == "object") // CommonJS
        mod(require("codemirror/lib/codemirror"));
    else if (typeof define == "function" && define.amd) // AMD
        define(["codemirror/lib/codemirror"], mod);
    else // Plain browser env
        mod(CodeMirror);
})(function(CodeMirror) {

    var minifySql = function(text) {
        return text.replace(/\s{1,}/g," ").replace(/\s{1,}\(/,"(").replace(/\s{1,}\)/,")");
    };

    // Explain/Unexplain the specified range
    CodeMirror.defineExtension("explainRange", function (isExplain, from, to) {
        var cm = this, explainString = "EXPLAIN ";
        cm.operation(function() {
            if (isExplain) { // Explain range
                var selText = cm.getRange(from, to);
                var explainText = selText.toUpperCase().startsWith(explainString) ? selText : (explainString + selText);
                cm.replaceRange(explainText, from, to);
            } else { // UnExplain range
                var selText = cm.getRange(from, to);
                var unexplainText = selText.replace(new RegExp("^" + explainString, "i"), "");
                cm.replaceRange(unexplainText, from, to);
            }
        });
    });

    // Minify/Unminify the specified range
    CodeMirror.defineExtension("minifyRange", function (isMinify, from, to) {
        var cm = this;
        cm.operation(function() {
            if (isMinify) { // Minify range
                var selText = cm.getRange(from, to);
                cm.replaceRange(minifySql(selText), from, to);
            } else { // Unminify range
                var selText = cm.getRange(from, to);
                cm.replaceRange(sqlFormatter.format(selText, "SQL"), from, to);
            }
        });
    });
});
