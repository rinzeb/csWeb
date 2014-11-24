module DashboardSelectionDashboard {
    export class TitleWidget extends csComp.Services.BaseWidget {

        public widgetType: string = "TitleWidget";
        public title: string = "Title";
        public sizeY: number = 1;
        public sizeX: number = 2;

        public renderer = ($scope: Dashboard.DashboardCtrl) => {
            //var html = "<h1>{{dashboard.name}}</h1>";
            //return html;
            //$compile(htmlcontent.contents())($scope);
            $("#" + this.elementId).html("<h1>" + this.dashboard.name + "<h1>");
        }


    }

    export class TextWidget extends csComp.Services.BaseWidget {

        public widgetType: string = "TextWidget";
        public title: string = "Text";

        public renderer = ($scope: Dashboard.DashboardCtrl) => {
            $("#" + this.elementId).html("hoi");
        }
    }
}