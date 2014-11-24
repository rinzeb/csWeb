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
            'messageBusService'
        ];

        // dependencies are injected via AngularJS $injector
        // controller's name is registered in Application.ts and specified from ng-controller attribute in index.html
        constructor(
            private $scope: IDashboardSelectionScope,
            private $layerService: csComp.Services.LayerService,
            private $dashboardService: csComp.Services.DashboardService,
            private $messageBusService : csComp.Services.MessageBusService
            ) {
            
            $scope.vm = this;

            $scope.editMode = true;
            

        }

        public startDashboardEdit(id: string) {
            for (var property in this.$layerService.project.dashboards) {
                if (property != id) this.$layerService.project.dashboards[property].editMode = false;
            }


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

        /** Select an active dashboard */
        public selectDashboard(key: string) {
            for (var property in this.$dashboardService.dashboards) {
                this.$dashboardService.dashboards[property].editMode = false;
            }
            if (this.$dashboardService.dashboards.hasOwnProperty(key)) {
                this.$dashboardService.mainDashboard = this.$dashboardService.dashboards[key];
                if (this.$scope.$root.$$phase != '$apply' && this.$scope.$root.$$phase != '$digest') { this.$scope.$apply(); }

                this.$messageBusService.publish('dashboard', 'onDashboardSelected', this.$dashboardService.mainDashboard);
                
                // render all widgets
                //this.refreshDashboard();
            }
        }

    }
}  