module Heatmap {
    /**
     * A heat spot represents an lat-lon-point on the map with a certain intensity.
     */
    export interface IHeatspot {
        lat        : number;
        lon        : number;
        intensity  : number;

        AddLocation(lat, lon): IHeatspot;
    }

    /**
     * A heat spot represents a point on the map with a certain intensity.
     */
    export class Heatspot implements IHeatspot {
        constructor(public lat: number, public lon: number, public intensity: number) { }

        AddLocation(lat, lon) {
            // TODO
            //return new Heatspot(this.latitude + lat, this.longitude + lon, this.intensity);
            return new Heatspot(this.lat + lat, this.lon + lon, this.intensity / 10);
        }
    }

}
