module csComp.Services {

    export class Widget {
        public content: Function;
        constructor() {

        }
    }

    export interface IWidget {
        widgetType: string;
        title: string;
        elementId: string;
        dashboard: csComp.Services.Dashboard;
        renderer: Function;
        resize: Function;
        background : string;
        init : Function;
        col: number; row: number; sizeY: number; sizeX: number; name: string; id: string;
        properties: {};
        dataSets: DataSet[];
        range: csComp.Services.DateRange;
        updateDateRange: Function;
        collapse: boolean;
        canCollapse : boolean;
        width: number;
        height:number;
    }

   

    export class BaseWidget implements IWidget {
        public widgetType: string;
        public title: string;
        public elementId: string;
        public dashboard: csComp.Services.Dashboard;
        public col: number;
        public row: number;
        public background : string;
        public sizeY: number = 2;
        public sizeX: number = 4;
        public name: string; public id: string;
        public properties: {};
        public dataSets: DataSet[];
        public range: csComp.Services.DateRange;
        public collapse: boolean;
        public canCollapse : boolean;
        public width: number;
        public height: number;

        constructor(title?: string, type?: string) {
            if (title) this.title = title;
            if (type) this.widgetType = type;
            this.properties = {};
            this.dataSets = [];

           

        }

        public init(sX: number, sY: number, c: number, r: number, id? : string, width? : number, height? : number) {
            this.sizeX = sX;
            this.sizeY = sY;
            this.col = c;
            this.row = r;
            this.background = "red";
            if (!id) id = "widget" + csComp.Helpers.getGuid().replace('-', '');
            this.width = (width) ? width : 300;
            this.height = (height) ? height : 150;            
            this.id = id;
            this.elementId = id;

        }
        public renderer = ($scope: any) => { };

        public updateDateRange(r: csComp.Services.DateRange) {
            this.range = r;
        }

        public resize = (status: string, width : number, height : number) => {};
    }



    

    export class Dashboard {        
        widgets: IWidget[];
        editMode: boolean;        
        showMap: boolean;
        showTimeline : boolean = true;
        draggable: boolean = false;
        resizable : boolean = true;
        background : string;
        constructor(public id: string, public name: string) {
            this.widgets = [];
        }
    }

    export class Timeline {
        public id : string;
        public timestamps : number[];
    }

    export class TimedDataSet {
        public timeline: Timeline;
        public timedata : number[];        
    }
    
    export class DataSet {
        public color: string;
        
        public data: { [key: number]: number };

        constructor(public id?: string, public title?: string) {
            this.data = [];
        }

        


    }

} 