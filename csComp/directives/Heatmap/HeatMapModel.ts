module Heatmap {
    /**
    * A simple interface to describe a heat map.
    */
    export interface IHeatmapModel {
        title: string;
        heatmapItems: IHeatmapItem[];
    }

    export class HeatmapModel implements IHeatmapModel {
        heatmapItems: IHeatmapItem[] = [];
        scaleMaxValue: number = 16;
        scaleMinValue: number = 9;

        constructor(public title: string) {
            this.title = title;
        }

        /**
         * Calculate the heatmap.
         */
        calculate(layerService: csComp.Services.LayerService, mapService: csComp.Services.MapService, heatmap: L.GeoJSON) { //: L.TileLayer.WebGLHeatMap) {
            console.log('Calculating heatmap');
            var mapBounds = mapService.map.getBounds();
            var NW = mapBounds.getNorthWest();
            var NE = mapBounds.getNorthEast();
            var SW = mapBounds.getSouthWest();
            var width = NW.distanceTo(NE);  //Width of the map as it is currently visible on the screen, including padding
            var height = NW.distanceTo(SW); //Height ...

            var heatspots: IHeatspot[] = [];
            // Iterate over all applicable features on the map and find the one with the largest interest distance.
            var dataset = csComp.Helpers.loadMapLayers(layerService);
            var maxInterestDistance = 0;
            //heatmap.clearData();
            dataset.features.forEach((f) => {
                this.heatmapItems.forEach((hi) => {
                    if (hi.idealityMeasure.lostInterestDistance > maxInterestDistance) {
                        maxInterestDistance = hi.idealityMeasure.lostInterestDistance;
                    }
                });
            });

            //Calculate a grid based on the maximum number of cells and the map ratio.
            var mapRatio = width / height;
            var maxCellCount = HeatmapCtrl.MAX_HEATMAP_CELLS;
            var horizCells = Math.floor(Math.sqrt(maxCellCount * mapRatio));
            var vertCells = Math.floor(horizCells / mapRatio);
            var cellWidth = width / horizCells;
            var cellHeight = height / vertCells;
            var dLat = (NE.lat - SW.lat) / vertCells;
            var dLng = (NE.lng - SW.lng) / horizCells;
            var count: number = 0;

            var intensityGrid = [];
            for (var i = 0; i < horizCells; i++) {
                intensityGrid[i] = [];
                for (var j = 0; j < vertCells; j++) {
                    intensityGrid[i][j] = 0;
                }
            }

            // Iterate over all applicable features on the map and create a intensity "stamp" for each feature
            dataset.features.forEach((f) => {
                this.heatmapItems.forEach((hi) => {
                    var heatspot = hi.calculateHeatspots(f, cellWidth, cellHeight, horizCells, vertCells, mapBounds);
                    if (heatspot) {
                        //heatspots = heatspots.concat(heatspot);
                        //console.log('Created ' + heatspot.length + ' heatspots');
                        heatspot.forEach((hs) => {
                            //heatmap.addDataPoint(hs.i, hs.j, hs.intensity);
                            if (hs.intensity != 0 &&
                                hs.i >=0 && hs.i < horizCells && hs.j >= 0 && hs.j < vertCells) {
                                intensityGrid[hs.i][hs.j] = intensityGrid[hs.i][hs.j] + hs.intensity;
                                count = count + 1;
                            }
                        });
                    }
                });
            });
            console.log('Created ' + count + ' heatspots');

            heatmap.clearLayers();
            //Draw the intensityGrid
            for (var i = 0; i < horizCells; i++) {
                for (var j = 0; j < vertCells; j++) {
                    if (intensityGrid[i][j] != 0) {
                        var polyCoord = [[SW.lng + dLng * i, SW.lat + dLat * j],
                            [SW.lng + dLng * (i + 1), SW.lat + dLat * j],
                            [SW.lng + dLng * (i + 1), SW.lat + dLat * (j + 1)],
                            [SW.lng + dLng * i, SW.lat + dLat * (j + 1)],
                            [SW.lng + dLng * i, SW.lat + dLat * j]];
                        var feature = {
                            "type": "Feature",
                            "geometry": {
                                "type": "Polygon",
                                "coordinates": [polyCoord]
                            },
                            "properties": {
                                "gridX": i,
                                "gridY": j,
                                "intensity": intensityGrid[i][j]
                            }
                        };
                        heatmap.addData(feature);
                    }
                }
            }
        }

        /**
         * Update the weights of all heatmap items.
         */
        updateWeights() {
            var totalUserWeight = 0;
            this.heatmapItems.forEach((hi) => {
                if (hi.isSelected) totalUserWeight += Math.abs(hi.userWeight);
            });
            this.heatmapItems.forEach((hi) => {
                if (hi.isSelected) {
                    if (totalUserWeight != 0) {
                        hi.weight = hi.userWeight / totalUserWeight;
                    } else {
                        hi.weight = 0;
                    }
                    hi.reset();
                }
            });
        }

        /** 
        * Add a heatmap item to the list of items only in case we don't have it yet.
        */
        addHeatmapItem(heatmapItem: IHeatmapItem) {
            var ft = heatmapItem.featureType;
            var title = heatmapItem.title;
            for (var i = 0; i < this.heatmapItems.length; i++) {
                var hi = this.heatmapItems[i];
                if (hi.featureType === ft && hi.title === title) return;
            }
            this.heatmapItems.push(heatmapItem);
        }
    }
}
