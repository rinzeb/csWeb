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

            var project = $layerService.project;

            //$messageBusService.subscribe("dashboard", (action: string, dashboard: csComp.Services.Dashboard) => {
            //    switch (action) {
            //        case "onDashboardSelected":
            //            alert('dashboard selected');
            //            this.updateDashboard();
            //        break;
            //    }
            //});
            $scope.initDashboard = () => {

                $scope.$watch('dashboard', () => {
                    this.updateDashboard();
                });
                //alert($scope.param.name);

                if ($scope.dashboard && $scope.dashboard.widgets && $scope.dashboard.widgets.length > 0) {
                    setTimeout(() => {

                        $scope.gridsterOptions = {
                            margins: [10, 10],
                            columns: 20,
                            rows: 20,
                            draggable: {
                                enabled: $scope.dashboard.draggable
                            },
                            resizable: {
                                enabled: $scope.dashboard.resizable,
                                start: (event, uiWidget, $element: csComp.Services.IWidget) => {
                                    $element.resize("start");
                                },
                                stop: (event, uiWidget, $element: csComp.Services.IWidget) => {
                                    $element.resize("stop");
                                },
                                resize: (event, uiWidget, $element: csComp.Services.IWidget) => {
                                    $element.resize("change");
                                }
                            }
                        };


                    }, 100);
                }
                this.updateDashboard();
                //alert($scope.dashboard.name);
            };


        }

        public updateDashboard() {
            setTimeout(() => {
                if (this.$scope.dashboard)
                    this.$scope.dashboard.widgets.forEach((w: csComp.Services.IWidget) => {
                        w.renderer();
                    });
            }, 100);

        }
    }
} 