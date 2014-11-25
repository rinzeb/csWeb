module Dashboard {

    import Dashboard = csComp.Services.Dashboard;

    declare var c3;

    export interface IDashboardScope extends ng.IScope {
        vm: DashboardCtrl;
        gridsterOptions: any;
        dashboards: {};
        dashboard: csComp.Services.Dashboard;
        param: any;
        initDashboard: Function;
        minus: Function;
        
        
    }

    export class DashboardCtrl {
        private scope: IDashboardScope;

        //public dashboard: csComp.Services.Dashboard;

        // $inject annotation.                                                   
        // It provides $injector with information about dependencies to be in  jected into constructor
        // it is better to have it close to the constructor, because the parameters must match in count and type.
        // See http://docs.angularjs.org/guide/di
        public static $inject = [
            '$scope',
            'layerService',
            'dashboardService',
            'messageBusService'
        ];


// dependencies are injected via AngularJS $injector
        // controller's name is registered in Application.ts and specified from ng-controller attribute in index.html
        constructor(
            private $scope: IDashboardScope,
            private $layerService: csComp.Services.LayerService,
            private $dashboardService: csComp.Services.DashboardService,
            private $messageBusService: csComp.Services.MessageBusService
        ) {
            $scope.vm = this;

            $scope.gridsterOptions = {
                margins: [10, 10],
                columns: 20,
                rows: 20,
                draggable: {
                    enabled:true
                },
                resizable: {
                    enabled: true,
                    start: (event, uiWidget, $element: csComp.Services.IWidget) => {
                        $element.resize("start", uiWidget.width(), uiWidget.height());
                    },
                    stop: (event, uiWidget, $element: csComp.Services.IWidget) => {
                        $element.resize("stop", uiWidget.width(), uiWidget.height());
                    },
                    resize: (event, uiWidget, $element: csComp.Services.IWidget) => {
                        
                        $element.resize("change", uiWidget.width(),uiWidget.height());
                    }
                }
            };

            var project = $layerService.project;

           
            $scope.initDashboard = () => {

                $scope.$watch('dashboard', () => {
                    this.updateDashboard();
                });
                //alert($scope.param.name);
                

                
                this.updateDashboard();
                //alert($scope.dashboard.name);
            };


        }

        public updateDashboard() {
        if (this.$scope.dashboard && this.$scope.dashboard.widgets && this.$scope.dashboard.widgets.length > 0) {
            setTimeout(() => {
                if (this.$scope.dashboard)
                    this.$scope.dashboard.widgets.forEach((w: csComp.Services.IWidget) => {
                        w.renderer();
                    });
            }, 100);
        }

    }
    }
} 