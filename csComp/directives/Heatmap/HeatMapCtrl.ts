module Heatmap {
    'use strict';

    import Feature       = csComp.Services.Feature;
    import IFeature      = csComp.Services.IFeature;
    import IFeatureType  = csComp.Services.IFeatureType;
    import IPropertyType = csComp.Services.IPropertyType;

    export interface IHeatmapScope extends ng.IScope {
        vm: HeatmapCtrl;
        ratingStates: any;
    }

    declare var String;//: csComp.StringExt.IStringExt;

    export class HeatmapCtrl {
        private static confirmationMsg1: string;
        private static confirmationMsg2: string;
        heatmap       : L.GeoJSON;
        heatmapModel  : HeatmapModel;
        heatmapModels : HeatmapModel[] = [];
        expertMode                     = true;
  
        selectedFeature: IFeature;
        properties     : FeatureProps.CallOutProperty[];
        showFeature    : boolean;
        showChart      : boolean;
        featureIcon    : string;
  
        static $inject = [
          '$scope',
          '$modal',
          '$translate',
          '$timeout',
          'localStorageService',
          'layerService',
          'mapService',
          'messageBusService'
        ];
  
        constructor(
          private $scope              : IHeatmapScope,
          private $modal              : any,
          private $translate          : ng.translate.ITranslateService,
          private $timeout            : ng.ITimeoutService,
          private $localStorageService: ng.localStorage.ILocalStorageService,
          private $layerService       : csComp.Services.LayerService,
          private $mapService         : csComp.Services.MapService,
          private messageBusService   : csComp.Services.MessageBusService
        ) {
          $scope.vm = this;
  
          messageBusService.subscribe('layer', (title) => {//, layer: csComp.Services.ProjectLayer) => {
            switch (title) {
              case 'deactivate':
              case 'activated':
                /*this.updateAvailableMcas();
                this.calculateMca();*/
                break;
              }
          });
  
          messageBusService.subscribe('project', (title) => {//, layer: csComp.Services.ProjectLayer) => {
                  switch (title) {
                      case 'loaded':
                          /*this.expertMode = $layerService.project != null
                              && $layerService.project.hasOwnProperty('userPrivileges')
                              && $layerService.project.userPrivileges.hasOwnProperty('mca')
                              && $layerService.project.userPrivileges.mca.hasOwnProperty('expertMode')
                              && $layerService.project.userPrivileges.mca.expertMode;*/
  
                         if (typeof $layerService.project.mcas === 'undefined' || $layerService.project.mcas == null)
                              //$layerService.project.mcas = [];
                          /*var mcas = this.$localStorageService.get(McaCtrl.mcas);*/
                          /*if (typeof mcas === 'undefined' || mcas === null) return;*/
                          /*mcas.forEach((mca) => {
                              $layerService.project.mcas.push(new Models.Mca().deserialize(mca));
                          });*/
                          //this.createDummyMca();
                          break;
                  }
              });
  
              /*messageBusService.subscribe('feature', this.featureMessageReceived);*/
  
              $translate('HEATMAP.DELETE_MSG').then(translation => {
                  HeatmapCtrl.confirmationMsg1 = translation;
              });
              $translate('HEATMAP.DELETE_MSG2').then(translation => {
                  HeatmapCtrl.confirmationMsg2 = translation;
              });

              this.initializeHeatmap();
          }

        createHeatmap() {
            var heatmap = new HeatmapModel('Heatmap');
            this.showHeatmapEditor(heatmap);
        }

        editHeatmap(heatmap: HeatmapModel) {
            this.showHeatmapEditor(heatmap);
        }

        removeHeatmap(heatmap: HeatmapModel) {
            if (!heatmap) return;
            var title = String.format(HeatmapCtrl.confirmationMsg1, heatmap.title);
            this.messageBusService.confirm(title, HeatmapCtrl.confirmationMsg2,(result) => {
                if (!result) return;
                this.$timeout(() => {
                    this.deleteHeatmap(heatmap);
                    if (this.heatmap) this.updateHeatmap();
                    //if (this.heatmap) this.$mapService.map.removeLayer(this.heatmap);
                }, 0);
            });
            this.scopeApply();
        }

        private deleteHeatmap(heatmap: HeatmapModel) {
            if (!heatmap) return;
            var index = this.heatmapModels.indexOf(heatmap);
            if (index >= 0) this.heatmapModels.splice(index, 1);
            //var mcaIndex = this.getMcaIndex(mca);
            //if (mcaIndex < 0) return;
            //var mcas = this.$layerService.project.mcas;
            //if (mcaIndex >= 0)
            //    mcas.splice(mcaIndex, 1);
            //this.removeMcaFromLocalStorage(mca);
            //this.updateAvailableMcas();
        }

        /**
         * Show the heat map editor in a modal.
         */
        private showHeatmapEditor(heatmap: HeatmapModel): void {
            var modalInstance = this.$modal.open({
                templateUrl: 'heatmapEditorView.html',
                controller: HeatmapEditorCtrl,
                resolve: {
                    heatmap: () => heatmap
                }
            });
            modalInstance.result.then((heatmap: HeatmapModel) => {
                this.heatmapModel = heatmap;
                var i = this.heatmapModels.indexOf(heatmap);
                if (i >= 0) this.heatmapModels.splice(i, 1);
                this.heatmapModels.push(heatmap);
                this.updateHeatmap();
                console.log('Updated heatmap');
            }, () => {
                //console.log('Modal dismissed at: ' + new Date());
            });
        }

        private scopeApply() {
            if (this.$scope.$root.$$phase !== '$apply' && this.$scope.$root.$$phase !== '$digest') {
                this.$scope.$apply();
            }
        }

        getVotingClass(hi: IHeatmapItem) {
            if (hi == null || this.heatmapModel == null || hi.userWeight === 0 || hi.userWeight < -5 || hi.userWeight > 5)
                return 'disabledHeatmap';
            return hi.userWeight > 0 ? 'prefer' : 'avoid';
        }

        weightUpdated() {
            if (!this.heatmapModel) return;
            this.updateHeatmap();
        }

        /**
         * Update the available pre-set heatmaps.
         */
        private updateHeatmap() {
            this.heatmapModel.updateWeights();
            this.heatmapModel.calculate(this.$layerService, this.$mapService, this.heatmap);
            //this.createDummyHeatmap();
        }

        ///**
        //* Add a WebGL heatmap layer to the map.
        //*/
        private initializeHeatmap() {
            this.heatmap = L.geoJson([], {
                style: function (feature) {
                    if (feature.properties.intensity < 0.4) {
                        return { color: "#ff0000" };
                    } else if (feature.properties.intensity < 0.6) {
                        return { color: "#ff88ff" };
                    } else {
                        return { color: "#0000ff" };
                    }
                }
            });
            this.$mapService.map.setView(new L.LatLng(52.1095, 4.3275), 14);
            this.$mapService.map.addLayer(this.heatmap);

            //var myLines = [{
            //    "type": "LineString",
            //    "coordinates": [[4.33, 52.11], [4.33, 52.18], [4.30, 52.19]]
            //}, {
            //        "type": "LineString",
            //        "coordinates": [[4.33, 52.2], [4.35, 52.18], [4.38, 52.19]]
            //}];
            //this.heatmap.addData(myLines);
        }

        //            console.log('Added heatmap layer');

        //    csComp.Utils.loadJsCssfile('js/cs/webgl-heatmap.min.js', csComp.FileType.Js, (event: Event) => {
        //        csComp.Utils.loadJsCssfile('js/cs/webgl-heatmap-leaflet.min.js', csComp.FileType.Js,(event: Event) => {
        //            //custom size for this example, and autoresize because map style has a percentage width
        //            this.heatmap = new L.TileLayer.WebGLHeatMap({
        //                size: 50, opacity: 0.8, autoresize: false });//, gradientTexture: 'images/heat_gradient.png' });
        //            this.$mapService.map.addLayer(this.heatmap);
        //            console.log('Added heatmap layer');
        //        });
        //    });
        //}

        ///**
        // * Create a dummy heatmap
        // */
        //private createDummyHeatmap() {
        //    //this.$mapService.map.setView(new L.LatLng(52.109, 4.322), 10);
        //    //// dataPoints is an array of arrays: [[lat, lng, intensity]...]
        //    var dataPoints = [[52.1095, 4.3275, 0.5], [52.10190, 4.30220, 0.5], [52.11390, 4.30220, 0.5],
        //        [52.11190, 4.30220, 0.5], [52.10690, 4.30220, 0.5], [52.11890, 4.30220, 0.5],
        //        [52.11990, 4.3020, 0.5], [52.10090, 4.30520, 0.5], [52.103150, 4.31720, 0.5],
        //        [52.10090, 4.30820, 0.5], [52.10000, 4.30990, 0.7], [52.10000, 4.3120, 9],
        //        [52.10990, 4.33920, 5]];
        //    this.heatmap.setData(dataPoints);
        //}
    }
}
