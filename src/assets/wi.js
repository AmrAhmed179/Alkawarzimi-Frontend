var haskUrl = location.hash;
var params = haskUrl.split("/");

if (params.length > 3) {

    if (params[1] == "analytics" || params[1] == "conversationAnalysis" || params[1] == "Options") {
        projectName = params[3];
        projectId = params[4];
    } else {
        projectName = params[2];
        projectId = params[3];
    }
    var animatedIcon = 1;
    if (projectId == 147 || projectId == 150 || projectId == 171 || projectId == 242 || projectId == 172 || projectId == 225)
        animatedIcon = 0;

    (function(w, d, s, o, f, js, fjs) {
        w['alkawarizmi'] = o;
        w[o] = w[o] || function() {
            (w[o].q = w[o].q || []).push(arguments)
        };
        js = d.createElement(s), fjs = d.getElementsByTagName(s)[0];
        js.id = o;
        js.src = f;
        js.async = 1;
        fjs.parentNode.insertBefore(js, fjs);
    }(window, document, 'script', 'myBbot', 'https://orchestrator.alkhwarizmi.xyz/plugins/alkhwarizmi.sdk.1.1.0.js'));
    myBbot('init', { id: projectId, title: "", draggable: true, animatedIcon: animatedIcon });
}