const socket = new WebSocket('ws://localhost:8001');

var wg = new WidgetsGrid("gridview");
wg.push(new WidgetMon(1, 1, 1, 1, "dev1", 3, 0));
wg.push(new WidgetMon(1, 2, 1, 1, "dev2", 3, 0));
wg.push(new WidgetMon(1, 3, 1, 1, "dev3", 3, 0));
wg.push(new WidgetMon(1, 4, 1, 1, "dev4", 3, 0));
wg.push(new WidgetMon(1, 5, 1, 1, "dev5", 3, 0));
wg.push(new WidgetMon(1, 6, 1, 1, "dev6", 3, 0));
wg.push(new WidgetMon(2, 1, 1, 2, "ping", 3, 0));
wg.render();


socket.addEventListener('message', function (event) {
    var jdata = JSON.parse(event.data);
    if (jdata["method"]=="set_data") {
        wg.widgetList.filter(wd => wd.device == jdata["data"]["dev"])[0].el.innerHTML = jdata["data"]["info"];
    }
});

socket.addEventListener('open', function (event) {
    var listReq = [];
    wg.widgetList.forEach(function (widget) {
        listReq.push(widget.device);
    });
    socket.send(JSON.stringify({"method": "get_data", "data": listReq}));

    var iter = 0;
    setInterval(function() {
        if (iter == 720) iter = 0; //5 секунд по 720 итераций того 3600 секунд тобишь 1 час максимальное тайминг апдейта минимальное 5 сек
        iter += 1;
        var listReq = [];
        wg.widgetList.forEach(function (widget) {
            if (iter%widget.tD == widget.tO) {
                listReq.push(widget.device);
            }
        });
        socket.send(JSON.stringify({"method": "get_data", "data": listReq}));
    }, 5000); //5 секунд
});
