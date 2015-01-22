module csComp.Services {
    export interface IDrawTypes {
        name        : string;
        drawingMode : string;
        iconUri     : string;
        description : string;
    }

    export interface IMapLayersScope extends ng.IScope {
        map: L.Map;
        vm: MapCtrl;
        drawItems: IDrawTypes[];
        selectedFeatureLayer: string;
        initDrawMode: boolean;
    }

    export class MapCtrl {
        // $inject annotation.
        // It provides $injector with information about dependencies to be injected into constructor
        // it is better to have it close to the constructor, because the parameters must match in count and type.
        // See http://docs.angularjs.org/guide/di
        public static $inject = [
            '$scope',
            '$location',
            'mapService',
            'messageBusService',
            'layerService'
        ];

        // dependencies are injected via AngularJS $injector
        // controller's name is registered in Application.ts and specified from ng-controller attribute in index.html
        constructor(
            private $scope              : IMapLayersScope,
            private $location           : ng.ILocationService,
            private $mapService         : MapService,
            private $messageBusService  : csComp.Services.MessageBusService,
            private $layerService       : csComp.Services.LayerService
            ) {
            // 'vm' stands for 'view model'. We're adding a reference to the controller to the scope
            // for its methods to be accessible from view / HTML
            $scope.vm = this;
            $scope.selectedFeatureLayer = '';
            $scope.initDrawMode = false;

            this.$mapService.baseLayers = {};

            this.$messageBusService.subscribe("drawmode", this.drawModeMessageReceived);

            var map = $scope.map = $mapService.getMap();

            //Den Haag
            //map.setView(new L.LatLng(52.555193, 5.438660), 10);
            //Amsterdam
            //map.setView(new L.LatLng(52.3978949803545, 4.90466079148125), 14);

            map.invalidateSize();

            // Zoom in/out layer control (above, I've turned it off, as the default location is top left).
            L.control.zoom({
                position: "bottomright"
            }).addTo(map);

            // GPS enabled geolocation control set to follow the user's location 
            L.control.locate({
                position:                "bottomright",
                drawCircle:              true,
                follow:                  true,
                setView:                 true,
                keepCurrentZoomLevel:    true,
                markerStyle:             {
                    weight:              1,
                    opacity:             0.8,
                    fillOpacity:         0.8
                },
                circleStyle:             {
                    weight:              1,
                    clickable:           false
                },
                icon:                    "icon-direction",
                metric:                  true,
                strings:                 {
                    title:               "My location",
                    popup:               "You are within {distance} {unit} from this point",
                    outsideMapBoundsMsg: "You seem located outside the boundaries of the map"
                },
                locateOptions:           {
                    maxZoom:             18,
                    watch:               true,
                    enableHighAccuracy:  true,
                    maximumAge:          10000,
                    timeout:             10000
                }
            }).addTo(map);

            //L.control.groupedLayers(this.$mapService.baseLayers, $layerService.overlays, {
            //    collapsed: true
            //}).addTo(map);
            
        }

        /**
         * Enables of disables the Leaflet.Draw toolbar depending on the received message
         */
        private drawModeMessageReceived = (title: string): void => {
            if (!this.$scope.initDrawMode) {
                // Get all the features
                var drawTypes = this.updateDrawTypes();
                // Add the items to the (current) map layer
                this.$mapService.initDrawableMap(drawTypes);
                this.$scope.initDrawMode = true;
            }
            if (title !== '') {
                if (this.$scope.selectedFeatureLayer != '' && title != this.$scope.selectedFeatureLayer) {
                    // Remove the Leaflet.Draw from the layer if it exists
                    this.$mapService.disableDrawableMap();
                }
                // Show the Leaflet.Draw toolbar
                this.$mapService.enableDrawableMap(drawTypes);
            } else {
                // Remove the Leaflet.Draw toolbar
                this.$mapService.disableDrawableMap();
            }

            this.$scope.selectedFeatureLayer = title;

            // NOTE EV: You need to call apply only when an event is received outside the angular scope.
            // However, make sure you are not calling this inside an angular apply cycle, as it will generate an error.
            if (this.$scope.$root.$$phase != '$apply' && this.$scope.$root.$$phase != '$digest') {
                this.$scope.$apply();
            }
        }
        
        private updateDrawTypes() {
            var drawItems: Array<IDrawTypes> = [];
            var existingItems: Array<String> = [];
            for (var key in this.$layerService.featureTypes) {
                var ft = this.$layerService.featureTypes[key];
                var name        = this.getName(key, ft);
                var drawingMode = ft.style.drawingMode;
                var iconUri     = this.getImageUri(ft);
                var description = 'Klik op het icoon om een nieuw ' + name + ' aan te maken.';
                this.injectIconCSS(name, iconUri);
                var existingItem = name;
                if (existingItems.indexOf(existingItem) < 0) {
                    existingItems.push(existingItem);
                    drawItems.push({
                        "name": name,
                        "drawingMode": drawingMode,
                        "iconUri": iconUri,
                        "description": description
                    });
                }
            }
            drawItems.sort((a: IDrawTypes, b: IDrawTypes) => {
                if (a.name > b.name) return 1;
                if (a.name < b.name) return -1;
                return 0;
            });
            return drawItems;
        }

        private getImageUri(ft: csComp.Services.IFeatureType): string {
            if (ft.style != null && ft.style.drawingMode != null && ft.style.drawingMode.toLowerCase() != "point") {
                if (ft.style.iconUri && ft.style.iconUri.indexOf('_Media') < 0)
                    return ft.style.iconUri;
                else
                    return "includes/images/polygon.png";
            }
            else if (ft.style != null && ft.style.iconUri != null) {
                return ft.style.iconUri;
            }
            else {
                return "includes/images/marker.png";
            }
        }

        private getName(key: string, ft: csComp.Services.IFeatureType): string {
            if (ft.name != null) {
                return ft.name;
            }
            else {
                return key;
            }
        }

        private injectIconCSS(name, iconUri) {
            var t = "{\"." + name.replace(/\s+/g, '-').toLowerCase() + "\":";
            if (iconUri != null) {
                t += " { \"background-image\": \"url('" + iconUri + "') !important\",";
            };
            t += " \"background-size\": \"20px 20px\",\"background-color\": \"#fff !important\",\"border-style\": \"none\"} }";
            var json = $.parseJSON(t);
            (<any>$).injectCSS(json);
        }

        //private popUp(f,l) : void {
        //    var out = [];
        //    if (f.properties) {
        //        for (var key in f.properties) {
        //            out.push(key + ": " + f.properties[key]);
        //        }
        //        l.bindPopup(out.join("<br />"));
        //    }
        //}
    }
}

//export = MapLayersCtrl;