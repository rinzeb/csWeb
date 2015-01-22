module LayersDirective {
    export interface ILayersDirectiveScope extends ng.IScope {
        vm: LayersDirectiveCtrl;
        editMode: boolean;
        drawMode: boolean;
        selectedFeatureLayer: string;
        showDrawMode: any;
    }

    export class LayersDirectiveCtrl {
        private scope: ILayersDirectiveScope;

        // $inject annotation.
        // It provides $injector with information about dependencies to be injected into constructor
        // it is better to have it close to the constructor, because the parameters must match in count and type.
        // See http://docs.angularjs.org/guide/di
        public static $inject = [
            '$scope',
            'layerService',
            'messageBusService'
        ];

        // dependencies are injected via AngularJS $injector
        // controller's name is registered in Application.ts and specified from ng-controller attribute in index.html
        constructor(
            private $scope: ILayersDirectiveScope,
            private $layerService: csComp.Services.LayerService,
            private $messageBusService: csComp.Services.MessageBusService
            ) {
            $scope.vm = this;
            $scope.editMode = false;
            $scope.drawMode = false;
            $scope.selectedFeatureLayer = '';

            this.$messageBusService.subscribe("editmode", this.editModeMessageReceived);

            $scope.showDrawMode = (featureId: string): void => {
                if ($scope.drawMode && featureId == $scope.selectedFeatureLayer) {
                    this.$messageBusService.publish("drawmode", '');
                    $scope.drawMode = false;
                    $scope.selectedFeatureLayer = '';
                } else {
                    this.$messageBusService.publish("drawmode", featureId);
                    $scope.drawMode = true;
                    $scope.selectedFeatureLayer = featureId;
                }
            }
        }

        public toggleLayer(layer: csComp.Services.ProjectLayer): void {
            layer.enabled = !layer.enabled;
            if (layer.enabled) {
                this.$layerService.addLayer(layer);
            } else {
                this.$layerService.removeLayer(layer);
            }

            // NOTE EV: You need to call apply only when an event is received outside the angular scope.
            // However, make sure you are not calling this inside an angular apply cycle, as it will generate an error.
            if (this.$scope.$root.$$phase != '$apply' && this.$scope.$root.$$phase != '$digest') {
                this.$scope.$apply();
            }
        }

        private editModeMessageReceived = (title: string): void => {
            switch (title) {
                case "enable":
                    this.$scope.editMode = true;
                    break;
                case "disable":
                    this.$scope.editMode = false;
                    break;
                default:
            }
        }
    }
} 