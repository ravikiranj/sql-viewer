var sqlViewer = (function($) {
    "use strict";
    // Private
    var body = $("body"),
        codeMirror,
        sqlMode = "text/x-sql",
        SQL_VIEWER_ID = "SQL-VIEWER",
        defaultTheme = "DEFAULT",
        themes = [defaultTheme, "DRACULA"]
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

        getSelectedRange: function() {
            return { from: codeMirror.getCursor(true), to: codeMirror.getCursor(false) };
        },

        explainOrUnexplainRange: function(isExplain) {
            if (!codeMirror) {
                return;
            }
            var range = this.getSelectedRange();
            codeMirror.explainRange(isExplain, range.from, range.to);
        },

        minifyOrUnminifyRange: function(isMinify) {
            if (!codeMirror) {
                return;
            }
            var range = this.getSelectedRange();
            codeMirror.minifyRange(isMinify, range.from, range.to);
        },

        initSelectDropdown: function() {
            $("#THEME").selectpicker({
                style: 'btn-default',
                size: 4
            });
        },

        registerEventHandlers: function() {
            var self = this;
            $("#EXPLAIN").click(function() {
                self.explainOrUnexplainRange(true);
            });

            $("#UNEXPLAIN").click(function() {
                self.explainOrUnexplainRange(false);
            });

            $("#MINIFY").click(function() {
                self.minifyOrUnminifyRange(true);
            });

            $("#UNMINIFY").click(function() {
                self.minifyOrUnminifyRange(false);
            });

            $("#THEME").change(function() {
                self.updateTheme($("#THEME").val());
            });
            
        },

        updateTheme: function(themeName) {
            themeName = $.inArray(themeName, themes) != -1 ? themeName : defaultTheme;
            if (codeMirror) {
                codeMirror.setOption("theme", themeName);
            }
            this.saveThemeChoice(themeName);
        },

        saveThemeChoice: function(themeName) {
            chrome.storage.sync.set({"theme": themeName}, function() {
                console.log("SQL-VIEWER theme preference saved, themeName = " + themeName);
            });
        },

        retrieveAndUpdateTheme: function() {
            chrome.storage.sync.get(["theme"], function(items) {
                if (!items || !items["theme"] || $.inArray(items["theme"], themes) === -1) {
                    $("#THEME").val(defaultTheme);
                    $("#THEME").selectpicker("refresh");
                    return;
                }

                $("#THEME").val(items["theme"]);
                $("#THEME").selectpicker("refresh");
                if (codeMirror) {
                    codeMirror.setOption("theme", items["theme"]);
                }
                console.log("SQL-Viewer retrieved theme preference = ", items["theme"]);
            });
        },

        display: function(rawData) {
            var rawSqlStatements = rawData.split(";"),
                formattedSqlStatements = $.map(rawSqlStatements, this.formatSqlStatement),
                formattedSql = formattedSqlStatements.filter(this.nonEmptySqlFilter).join("\n"),
                html
            ;

            html = "<div id='" + SQL_VIEWER_ID + "' class='container-fluid'>";
            html += "<form class='form-inline sql-viewer-options'>";
            html += "<div class='form-group'>";
            html += "<label for='THEME' class='theme-label'>Theme: ";
            html += "<select id='THEME' class='.col-md-4'>";
            html += "<option value='DEFAULT'>DEFAULT</option>";
            html += "<option value='DRACULA'>DRACULA</option>";
            html += "</select>";
            html += "</label>";
            html += "<input type='button' value='Minify Selected' id='MINIFY' class='btn btn-default'/>";
            html += "<input type='button' value='Unminify Selected' id='UNMINIFY' class='btn btn-default'/>";
            html += "<input type='button' value='EXPLAIN Selected' id='EXPLAIN' class='btn btn-default'/>";
            html += "<input type='button' value='UNEXPLAIN Selected' id='UNEXPLAIN' class='btn btn-default'/>";
            html += "</div>";
            html += "</form>";
            html += "</div>";

            $("body").html(html);
            this.registerEventHandlers();
            this.initSelectDropdown();

            codeMirror = CodeMirror(document.getElementById(SQL_VIEWER_ID), {
                value: formattedSql,
                mode: sqlMode,
                indentUnit: 4,
                lineNumbers: true,
                readOnly: true,
                foldGutter: true,
                gutters: ["CodeMirror-foldgutter"]
            });
            codeMirror.setSize("100%", "100%");
            this.retrieveAndUpdateTheme();
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
