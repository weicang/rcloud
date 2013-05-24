var oob_handlers = {
    "browsePath": function(v) {
        $("#help-output").empty();
        $("#help-output").append("<iframe class='help-iframe' src='" + window.location.protocol + '//' + window.location.host + v+ "'></iframe>");
    }
};

function main_init() {
    rclient = RClient.create({ 
        debug: false,
        host: "ws://"+location.hostname+":8081/", 
        on_connect: function() {
            $("#new-md-cell-button").click(function() {
                shell.terminal.disable();
                shell.new_markdown_cell("", "markdown");
                var vs = shell.notebook.view.sub_views;
                vs[vs.length-1].show_source();
            });
            $("#share-notebook").click(function() {
                shell.serialize_state(function() {
                    window.location="share.html?user=" + shell.user + "&filename=" + shell.filename;
                });
            });
            $("#rcloud-logout").click(function() {
                $.cookies.set('user', null);
                $.cookies.set('sessid', null);
                window.location.href = '/login.html';
            });
            $(".collapse").collapse();
            $("#input-text-search").click(function() {
                shell.terminal.disable();
            });
            rcloud.init_client_side_data();

            editor.init();

            if (location.search.length > 0) {
                function getURLParameter(name) {
                    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
                }
                editor.load_file(getURLParameter("user"), getURLParameter("filename"));
                $("#tabs").tabs("select", "#tabs-2");
            }
        }, on_data: function(v) {
            v = v.value.json();
            oob_handlers[v[0]] && oob_handlers[v[0]](v.slice(1));
        }
    });
}

window.onload = main_init;
