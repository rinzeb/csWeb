module csComp.Services {

    export class DashboardService {
        public maxBounds: IBoundingBox;
        public featureDashboard: csComp.Services.Dashboard;
        public mainDashboard: csComp.Services.Dashboard;
        public dashboards: { [id:string] : csComp.Services.Dashboard} = {};
        public editMode: boolean;
        public activeWidget : IWidget;

        public static $inject = [
            '$location',
            '$translate',
            'messageBusService'            
        ];

        
        public init(d: { [id: string]: csComp.Services.Dashboard }) {
            if (!d) {
                d = {};

            }
            this.dashboards = d;
            this.featureDashboard = new csComp.Services.Dashboard("feature", "feature");
            

            if (Object.keys(this.dashboards).length == 0) {
                this.dashboards["map"] = new csComp.Services.Dashboard("map", "map");
                this.dashboards["main"] = new csComp.Services.Dashboard("main", "main");
                this.mainDashboard = this.dashboards["main"];                

            }

        }

        constructor(
            private $location: ng.ILocationService,
            private $translate: ng.translate.ITranslateService,
            private $messageBusService: Services.MessageBusService,
            private $mapService: Services.MapService) {
            //$translate('FILTER_INFO').then((translation) => console.log(translation));
            // NOTE EV: private props in constructor automatically become fields, so mb and map are superfluous.

            
            
            //this.dashboards["main"] = this.mainDashboard;


        }

        
    }

}