module DashboardSelection {
    export interface IDashboardSelectionScope extends ng.IScope {
        vm: DashboardSelectionCtrl; 
        addWidget: Function;
        title: string;
        editMode: boolean;
       
    }

    export class DashboardSelectionCtrl {
        private scope: IDashboardSelectionScope;

        // $inject annotation.   
        // It provides $injector with information about dependencies to be injected into constructor
        // it is better to have it close to the constructor, because the parameters must match in count and type.
        // See http://docs.angularjs.org/guide/di
        public static $inject = [
            '$scope',
            'layerService',
            'dashboardService',
            'mapService',
            'messageBusService'
        ];

        // dependencies are injected via AngularJS $injector
        // controller's name is registered in Application.ts and specified from ng-controller attribute in index.html
        constructor(
            private $scope: IDashboardSelectionScope,
            private $layerService: csComp.Services.LayerService,
            private $dashboardService: csComp.Services.DashboardService,
            private $mapService : csComp.Services.MapService,
            private $messageBusService : csComp.Services.MessageBusService
            ) {
            
            $scope.vm = this;

            $scope.editMode = true;

            $messageBusService.subscribe("dashboardSelect", ((s: string, key: string) => {
                switch (s) {
                    case "selectRequest":
                        this.selectDashboard(key);
                    break;
                }
            }));


        }

        public startDashboardEdit(id: string) {
            
            for (var property in this.$layerService.project.dashboards) {
                if (property != id) this.$layerService.project.dashboards[property].editMode = false;
            }
            //this.selectDashboard(id);


        }

        public stopEdit() {
            //this.activeWidget = null;
            
            //this.$scope.gridsterOptions.draggable.enabled = false;
            //this.$scope.gridsterOptions.resizable.enabled = false;
        }

        public startEdit() {
           // this.$scope.gridsterOptions.draggable.enabled = true;
            //this.$scope.gridsterOptions.resizable.enabled = true;
        }

        /** Add new dashboard */
        public addDashboard(widget: csComp.Services.IWidget) {
            var id = csComp.Helpers.getGuid();
            var d = new csComp.Services.Dashboard(id, "New Dashboard");
            this.$layerService.project.dashboards[id] = d;
        }

        /** Remove existing dashboard */
        public removeDashboard(key: string) {
            if (this.$layerService.project.dashboards.hasOwnProperty(key)) {
                delete this.$layerService.project.dashboards[key];

            }
        }

        public toggleTimeline() {
            this.$dashboardService.mainDashboard.showTimeline = !this.$dashboardService.mainDashboard.showTimeline;
            this.checkTimeline();
        }
        

        public toggleMap() {
            setTimeout(() => {
                this.checkMap();
            }, 100);
            
        }

        public checkTimeline() {

            if (this.$dashboardService.mainDashboard.showTimeline != this.$mapService.timelineVisible) {
                if (this.$dashboardService.mainDashboard.showTimeline) {
                    this.$mapService.showTimeline();
                } else {
                    this.$mapService.hideTimeline();
                }
                this.$scope.$apply();
            }
        }

        public checkMap() {
            
            if (this.$dashboardService.mainDashboard.showMap != this.$mapService.isVisible) {
                if (this.$dashboardService.mainDashboard.showMap) {
                    this.$mapService.show();
                } else {
                    this.$mapService.hide();
                }
                this.$scope.$apply();
            }
        }

        /** publish a message that a new dashboard was selected */
        private publishDashboardUpdate() {
            this.$messageBusService.publish('dashboard', 'onDashboardSelected', this.$dashboardService.mainDashboard);
        }

        /** Select an active dashboard */
        public selectDashboard(key: string) {
            //var res = JSON.stringify(this.$dashboardService.dashboards);
            for (var property in this.$dashboardService.dashboards) {
                this.$dashboardService.dashboards[property].editMode = false;
            }
            if (this.$dashboardService.dashboards.hasOwnProperty(key)) {
                this.$dashboardService.mainDashboard = this.$dashboardService.dashboards[key];
                if (this.$scope.$root.$$phase != '$apply' && this.$scope.$root.$$phase != '$digest') { this.$scope.$apply(); }


                this.checkMap();
                this.checkTimeline();
                this.publishDashboardUpdate();

                // render all widgets
                //this.refreshDashboard();
            }
        }

    }
}  