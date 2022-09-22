var wg = new WidgetsGrid("gridview");
const socket = new WebSocket('ws://localhost:8001');

socket.addEventListener('open', function (event) {
    socket.send(JSON.stringify({"method": "get_settings"}));
});

socket.addEventListener('message', function (event) {
    var jdata = JSON.parse(event.data);
    if (jdata["method"]=="set_data") {
        wg.widgetList.filter(wd => wd.device == jdata["data"]["dev"])[0].el.innerHTML = jdata["data"]["info"];
    }
    if (jdata["method"]=="set_grid" && jdata["data"]["status"]=="ok") {
        wg.widgetList=[];
        var devlist=[];
        jdata["data"]["grid"].forEach(function (device) {
            wg.push(new WidgetMon(device[0], device[1], device[2], device[3], device[6], device[4], device[5] ));
            devlist.push(device[6]);
        });
        wg.render();
        socket.send(JSON.stringify({"method": "get_data", "data": devlist}));
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
    }

});
