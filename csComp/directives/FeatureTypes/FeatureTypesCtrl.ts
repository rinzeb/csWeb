module FeatureTypes {

    import IFeature = csComp.Services.IFeature;

    export interface IFeatureTypesScope extends ng.IScope {
        vm: FeatureTypesCtrl;
        showMenu: boolean;
        showMenuEdit: boolean;
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
            this.$scope.showMenu = false;
            this.$scope.showMenuEdit = false;

            this.$messageBusService.subscribe("sidebar", this.sidebarMessageReceived);

            $scope.updateFeatureTypes = () => {
                this.$layerService.project.features.forEach((feature: IFeature) => {
                    this.$layerService.updateFeature(feature);
                });

                // NOTE EV: You need to call apply only when an event is received outside the angular scope.
                // However, make sure you are not calling this inside an angular apply cycle, as it will generate an error.
                if (this.$scope.$root.$$phase != '$apply' && this.$scope.$root.$$phase != '$digest') {
                    this.$scope.$apply();
                }
            };
        }

        /** 
         * Callback function
         * @see {http://stackoverflow.com/questions/12756423/is-there-an-alias-for-this-in-typescript}
         * @see {http://stackoverflow.com/questions/20627138/typescript-this-scoping-issue-when-called-in-jquery-callback}
         * @todo {notice the strange syntax using a fat arrow =>, which is to preserve the this reference in a callback!}
         */
        private sidebarMessageReceived = (title: string): void => {
            //console.log("sidebarMessageReceived");
            switch (title) {
                case "toggle":
                    this.$scope.showMenu = !this.$scope.showMenu;
                    break;
                case "show":
                    this.$scope.vm = this;
                    this.$scope.showMenu = true;
                    break;
                case "showEdit":
                    this.$scope.showMenuEdit = true;
                    break;
                case "hide":
                    this.$scope.showMenu = false;
                    break;
                case "hideEdit":
                    this.$scope.showMenuEdit = false;
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