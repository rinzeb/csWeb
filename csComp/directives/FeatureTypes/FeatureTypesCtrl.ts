module FeatureTypes {

    import IFeature = csComp.Services.IFeature;

    export interface IFeatureTypesScope extends ng.IScope {
        vm: FeatureTypesCtrl;
        updateFeatureTypes;
    }

    export class FeatureTypesCtrl {
        private scope: IFeatureTypesScope;

        // $inject annotation.                                                   
        // It provides $injector with information about dependencies to be in  jected into constructor
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
            private $scope       : IFeatureTypesScope,
            private $layerService: csComp.Services.LayerService,
            private $messageBusService: csComp.Services.MessageBusService
            ) {
            this.$scope.vm = this;

            $scope.updateFeatureTypes = () => {
                this.$layerService.project.features.forEach((feature: IFeature) => {
                    this.$layerService.updateFeature(feature);
                });
            };
        }

        private sidebarMessageReceived = (title: string): void => {
            switch (title) {
                case "show":
                    this.$scope.vm = this;
                    break;
                default:
            }
            // NOTE EV: You need to call apply only when an event is received outside the angular scope.
            // However, make sure you are not calling this inside an angular apply cycle, as it will generate an error.
            if (this.$scope.$root.$$phase != '$apply' && this.$scope.$root.$$phase != '$digest') {
                this.$scope.$apply();
            }
        }
    }
} 