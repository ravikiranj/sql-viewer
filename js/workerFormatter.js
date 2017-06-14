onmessage = function(event) {
    importScripts("highlight.sql.pack.js");
    // configure hljs
    self.hljs.configure({
        tabReplace: '    ' // 4 spaces
    });

    // Compute highlighted result
    var result = self.hljs.highlightAuto(event.data.rawSql);
    postMessage({
        html: result
    });
}
