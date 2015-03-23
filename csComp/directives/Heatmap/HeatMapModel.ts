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

        constructor(public title: string) { }

        /**
         * Calculate the heatmap.
         */
        calculate(layerService: csComp.Services.LayerService, mapService: csComp.Services.MapService, heatmap: L.GeoJSON) { //: L.TileLayer.WebGLHeatMap) {
            console.log('Calculating heatmap');
            var mapBounds = mapService.map.getBounds();
            //TODO add a padding that takes the current zoom into account
            mapBounds.pad(1.25);
            var NW = mapBounds.getNorthWest();
            var NE = mapBounds.getNorthEast();
            var SW = mapBounds.getSouthWest();
            var width = NW.distanceTo(NE);  //Width of the map as it is currently visible on the screen
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
            var maxCellCount = 1000;
            var horizCells = Math.floor(Math.sqrt(maxCellCount * mapRatio));
            var vertCells = Math.floor(horizCells / mapRatio);
            var cellWidth = width / horizCells;
            var cellHeight = height / vertCells;

            this.drawGrid(heatmap, SW, NE, horizCells, vertCells);

            // Iterate over all applicable features on the map and create a intensity "stamp" for each feature
            dataset.features.forEach((f) => {
                this.heatmapItems.forEach((hi) => {
                    var heatspot = hi.calculateHeatspots(f, cellWidth, cellHeight, horizCells, vertCells, mapBounds);
                    if (heatspot) {
                        //heatspots = heatspots.concat(heatspot);
                        //console.log('Created ' + heatspot.length + ' heatspots');
                        heatspot.forEach((hs) => {
                            //heatmap.addDataPoint(hs.i, hs.j, hs.intensity);
                        });
                    }
                });
            });
            console.log('Created ' + ' heatspots');
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
                    hi.weight = hi.userWeight / totalUserWeight;
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

        /**
         * Draw the heatmap grid using geoJSON
         */
        drawGrid(heatmap: L.GeoJSON, SW: L.LatLng, NE: L.LatLng, horizCells: number, vertCells: number) {
            var dLat = (NE.lat - SW.lat) / vertCells;
            var dLng = (NE.lng - SW.lng) / horizCells;
            //var polyCoord = [];
            //for (var i = 0; i <= horizCells; i++) {
            //    for (var j = 0; j <= vertCells; j++) {
            //        polyCoord.push([SW.lng + dLng * i, SW.lat + dLat * j]);
            //    }
            //}
            //var grid = {
            //    "type": "Feature",
            //    "properties": { "grid": "myGrid" },
            //    "geometry": {
            //        "type": "Polygon",
            //        "coordinates": [polyCoord]
            //    }
            //};
            for (var i = 0; i <= horizCells; i++) {
                for (var j = 0; j <= vertCells; j++) {
                    var polyCoord = [[SW.lng + dLng * i, SW.lat + dLat * j],
                                    [SW.lng + dLng * (i + 1), SW.lat + dLat * j],
                                    [SW.lng + dLng * (i + 1), SW.lat + dLat * (j + 1)],
                                    [SW.lng + dLng * i, SW.lat + dLat * (j + 1)]];
                    var feature = {
                        "type": "Feature",
                        "properties": {
                            "gridX": i,
                            "gridY": j,
                            "intensity": 0
                        },
                        "geometry": {
                            "type": "Polygon",
                            "coordinates": [polyCoord]
                        }
                    };
                    heatmap.addData(feature);
                }
            }
        }
    }
}
