module PropertyTypes {

    export interface IPropertyTypesScope extends ng.IScope {
        vm: PropertyTypesCtrl;
        filterProperty;
        propertyTypes;
        getSections;
        addSection;
        sections;
    }

    export class PropertyTypesCtrl {
        private scope: IPropertyTypesScope;

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
            private $scope       : IPropertyTypesScope,
            private $layerService: csComp.Services.LayerService,
            private $messageBusService: csComp.Services.MessageBusService
            ) {
            this.$scope.vm = this;

            if (this.$scope.$root.$$phase != '$apply' && this.$scope.$root.$$phase != '$digest') {
                this.$scope.$apply();
            }

            this.$messageBusService.subscribe("editmode", this.editModeMessageReceived);

            $scope.getSections = () => {
                var propertyTypeData = this.$layerService.project.propertyTypeData;
                var newSections = new Array();

                for (var indexData in propertyTypeData) {
                    var add = true;

                    if (propertyTypeData[indexData].section != undefined) {
                        if (newSections.length == 0) {
                            newSections.push(propertyTypeData[indexData].section);
                        }

                        for (var indexNew in newSections) {
                            if (propertyTypeData[indexData].section == newSections[indexNew]) {
                                add = false;
                            }
                        }

                        if (add) {
                            newSections.push(propertyTypeData[indexData].section);
                        }
                    }
                }

                $scope.sections = newSections;
            }

            $scope.addSection = (name: String) => {
                var sections = $scope.sections;
                var add = true;

                for (var index in sections) {
                    if (name == sections[index]) {
                        add = false;
                    }
                }

                if (add) {
                    $scope.sections.push(name);
                }
            }

            $scope.filterProperty = (selectedData) => {
                var allPropertyTypes = this.$layerService.project.propertyTypeData;
                var propertyTypes = new Array();

                if (selectedData == undefined) {
                    // All property types are selected
                    for (var index in allPropertyTypes) {
                        propertyTypes.push(allPropertyTypes[index]);
                    }

                    $scope.propertyTypes = propertyTypes;
                } else {
                    // Property types of a feature is selected 
                    var selectedPropertyTypes;

                    if (selectedData.propertyTypeKeys !== undefined) {
                        selectedPropertyTypes = selectedData.propertyTypeKeys.split(';');
                    }

                    for (var indexSelected in selectedPropertyTypes) {
                        for (var indexAll in allPropertyTypes) {
                            if (allPropertyTypes.hasOwnProperty(indexAll)) {
                                if (selectedPropertyTypes[indexSelected] == allPropertyTypes[indexAll].label) {
                                    propertyTypes.push(allPropertyTypes[indexAll]);
                                }
                            }
                        }
                    }

                    $scope.propertyTypes = propertyTypes;
                }
            }

        }

        private editModeMessageReceived = (title: string): void => {
            switch (title) {
                case "enable":
                    this.$scope.vm = this;
                    this.$scope.propertyTypes = this.$layerService.project.propertyTypeData;
                    break;
                case "disable":
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