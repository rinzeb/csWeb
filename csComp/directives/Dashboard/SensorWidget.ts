module SensorWidget {

    var moduleName = 'csWeb.sensorWidget';

    /**                             
      * Module                  
      */
    export var myModule;
    try {
        myModule = angular.module(moduleName);

    } catch (err) {
        // named module does not exist, so create one
        myModule = angular.module(moduleName, []);
    } 

                  
    
        myModule.directive('sensorwidget', [
            '$window', '$compile',
            function ($window, $compile,layerService : csComp.Services.LayerService): ng.IDirective {          
            return {
                
                
                    terminal: false, // do not compile any other internal directives               
                    restrict: 'E', // E = elements, other options are A=attributes and C=classes
                    scope: {
                        dashboard: '='
                    }, // isolated scope, separated from parent. Is however empty, as this directive is self contained by using the messagebus.
                    template: html, // I use gulp automatian to compile the FeatureProperties.tpl.html to a simple TS file, FeatureProperties.tpl.ts, which contains the html as string. The advantage is that you can use HTML intellisence in the html file.
                    //compile             : el          => {    // I need to explicitly compile it in order to use interpolation like {{xxx}}
                    //    var fn                        = $compile(el);
                    //    return scope                  => { 
                    //        fn(scope);
                    //    };
                    //},
                    link: (scope: any, element, attrs) => {
                        // Deal with resizing the element list  
                                            
                        scope.onResizeFunction = () => {
                            var filterHeight = 50;
                            var paginationCtrlHeight = 100;
                            var itemHeight = 60;
                            //scope.windowHeight          = $window.innerHeight;
                            //scope.windowWidth           = $window.innerWidth;
                            scope.numberOfItems = Math.floor(($window.innerHeight - filterHeight - paginationCtrlHeight) / itemHeight);
                        };

                        // Call to the function when the page is first loaded
                        scope.onResizeFunction();

                        

                        angular.element($window).bind('resize', () => {
                            scope.onResizeFunction();
                            scope.$apply();
                        });

                        //scope.dashboard = attrs.param;
                        //var s = jQuery.parseJSON(attrs.param);                    
                        scope.initDashboard();

                    },
                    replace: false,
                    transclude: true, // Add elements and attributes to the template
                controller: SensorWidgetCtrl
                }
        }
        ]);
    //var datasetWidgetModule = angular.module("datasetWidget");

    //datasetWidgetModule.directive('datasetWidget', ['$window', '$compile',function ($window, $compile): ng.IDirective {          
    //        return {
    //            terminal: false, // do not compile any other internal directives               
    //            restrict: 'E', // E = elements, other options are A=attributes and C=classes
    //            scope: {
    //                dashboard: '='
    //            }, // isolated scope, separated from parent. Is however empty, as this directive is self contained by using the messagebus.
    //            template: "dataset", 
                
    //            link: (scope: any, element, attrs) => {
                    

    //            },
    //            replace: false,
    //            transclude: true // Add elements and attributes to the template
    //            //controller: DashboardCtrl
    //        }
    //    }
    //]);

    export interface ISensorWidgetScope extends ng.IScope {
        vm: SensorWidgetCtrl;
        


    }

    export class SensorWidgetCtrl {
        private scope: ISensorWidgetScope;

        //public dashboard: csComp.Services.Dashboard;

        // $inject annotation.                                                   
        // It provides $injector with information about dependencies to be in  jected into constructor
        // it is better to have it close to the constructor, because the parameters must match in count and type.
        // See http://docs.angularjs.org/guide/di
        public static $inject = [   
            '$scope',
            '$compile',
            'layerService',
            'dashboardService',
            'messageBusService'
        ];


        // dependencies are injected via AngularJS $injector
        // controller's name is registered in Application.ts and specified from ng-controller attribute in index.html
        constructor(
            private $scope: ISensorWidgetScope,
            private $compile: any,
            public layerService: csComp.Services.LayerService,
            public dashboardService: csComp.Services.DashboardService,
            public messageBusService: csComp.Services.MessageBusService
            ) {
            $scope.vm = this;
            
                  

            var project = layerService.project;

        }

        public speed() {
            alert('speed');
        }

        public intensity() {
            alert('intensiteit');      
        }
} 
}