var widgetBody_loading = "Loading...";

class WidgetMon {

    constructor(row, col, height, width, device, tD, tO) {
        this.row = row;
        this.col = col;
        this.height = height;
        this.width = width;
        this.device = device;
        this.tD = tD;
        this.tO = tO;
    }

    setElement(ll){
        this.el = ll;
    }

}

class WidgetsGrid {

    constructor(elementId) {
        this.el = document.getElementById(elementId);
        this.widgetList = [];
    }

    push(addWidget){
        this.widgetList.push(addWidget);
    }

    render(){
        this.widgetList.sort( function(widgetA, widgetB){
            if(widgetA.row < widgetB.row) return -1;
            if (widgetA.row > widgetB.row) return 1;
            if (widgetA.col < widgetB.col) return -1;
            if (widgetA.col > widgetB.col) return 1;
            return 0;
        });
        if (this.widgetList.length != 0) {
            var rowF = 1;
            var elRow = document.createElement("tr");
            var t = this;
            this.widgetList.forEach(function (widget, index, array) {
                if (widget.row != rowF) {
                    t.el.appendChild(elRow);
                    elRow = document.createElement("tr");
                    rowF = widget.row;
                }
                var elCol = document.createElement("td");
                elCol.setAttribute("colspan", widget.width);
                elCol.setAttribute("rowspan", widget.height);
                elCol.innerHTML = widgetBody_loading;
                widget.setElement(elCol);
                elRow.appendChild(elCol);
            });
            this.el.appendChild(elRow);
        }

    }

}
