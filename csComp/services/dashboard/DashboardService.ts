module csComp.Services {

    class InstanceLoader {
        constructor(private context: Object) {

        }

        getInstance(name: string, ...args: any[]) {
            var instance = Object.create(this.context["csComp"]["Services"][name].prototype);
            instance.constructor.apply(instance, args);
            return instance;
        }
    }

    export class DashboardService {
        public maxBounds: IBoundingBox;
        public featureDashboard: csComp.Services.Dashboard;
        public mainDashboard: csComp.Services.Dashboard;        
        public editMode: boolean;
        public activeWidget: IWidget;
        public dashboards: any; 
        public widgetTypes : { [key : string] : IWidget};

        public init() {
            

        }
        public static $inject = [
            '$rootScope',
            '$compile',
            '$location',
            '$translate',            
            'messageBusService'            
        ];

        
        

        constructor(
            private $rootScope: any,
            private $compile : any,
            private $location: ng.ILocationService,
            private $translate: ng.translate.ITranslateService,
            private $messageBusService: Services.MessageBusService,
            
            private $mapService: Services.MapService) {  
            //$translate('FILTER_INFO').then((translation) => console.log(translation));
            // NOTE EV: private props in constructor automatically become fields, so mb and map are superfluous.

            //alert('init dashbard');

            //this.dashboards["main"] = this.mainDashboard;
            this.widgetTypes = {};
            this.widgetTypes["Title"] = new TitleWidget();
            this.widgetTypes["Text"] = new TextWidget();
            this.widgetTypes["DataSet"] = new DataSetWidget();
            this.widgetTypes["Layer"] = new LayerWidget();
            


        }

        public addNewWidget(widget: IWidget, dashboard: Dashboard) : IWidget {
            var loader = new InstanceLoader(window);
            var w = <IWidget>loader.getInstance(widget.widgetType);
            w.messageBusService = this.$messageBusService;
            //w.layerService = this.$layerService;
            w.init(widget.sizeX, widget.sizeY, 4, 0);
            
            w.elementId = w.id;
            w.dashboard = dashboard;
            dashboard.widgets.push(w);
            if (this.$rootScope.$root.$$phase != '$apply' && this.$rootScope.$root.$$phase != '$digest') { this.$rootScope.$apply(); }
            setTimeout(() => {
                if (w != null) w.renderer(this.$compile, this.$rootScope);
            }, 50);
            this.editWidget(w);
            return w;
        }

        public addWidget(widget: IWidget) : IWidget {
            return this.addNewWidget(widget, this.mainDashboard);

        }

        public editWidget(widget: csComp.Services.IWidget) {
            this.activeWidget = widget;
            (<any>$('#leftPanelTab a[href="#widgetedit"]')).tab('show'); // Select tab by name
        }

        public removeWidget() {
            if (this.activeWidget && this.mainDashboard) {
                this.mainDashboard.widgets = this.mainDashboard.widgets.filter((w: csComp.Services.IWidget) => w.id != this.activeWidget.id);
                this.activeWidget = null;
                (<any>$('#leftPanelTab a[href="#basewidgets"]')).tab('show'); // Select tab by name
            }
        } 

        
    }

}