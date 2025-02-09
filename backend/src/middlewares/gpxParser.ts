import {Parser, parseStringPromise} from 'xml2js';
import {getDistance} from 'geolib';
import {readFile} from 'fs/promises';


interface GpxPoint {
  $: {
    lat: string;
    lon: string;
  };
  ele: string[];
  time: string[];
}

interface GpxTrkSeg {
  trkpt: GpxPoint[];
}

interface GpxTrk {
  name: string[];
  type: string[];
  trkseg: GpxTrkSeg[];
}

interface Gpx {
  gpx: {
    trk: GpxTrk[];
    metadata: [
      {
        time: string[];
      }
    ];
  };
}

async function readGpxFileAsString(filePath: string): Promise<string> {
  return await readFile(filePath, {encoding: 'utf8'});
}

async function convertGpxToJson(gpxContent: string): Promise<Gpx> {
  return await parseStringPromise(gpxContent);
}

export class gpxParser {
  private parser: Parser;

  constructor() {
    this.parser = new Parser({explicitArray: false});
  }

  public async parseGpxFile(filePath: string): Promise<any> {
    try {
      const gpxContent = await readGpxFileAsString(filePath);
      const gpxJson = await convertGpxToJson(gpxContent);
      const result = {
        metadata: {
          durationTotal: await this.getTotalDuration(gpxJson.gpx.trk[0].trkseg),
          distanceTotal: await this.getTotalDistance(gpxJson.gpx.trk[0].trkseg),
          date: gpxJson.gpx.metadata[0].time
        },
        segments: gpxJson.gpx.trk[0].trkseg
      };
      return result;
    } catch (error) {
      return JSON.stringify(error);
    }
  }

  private async getTotalDistance(data: GpxTrkSeg[]): Promise<number> {
    let totalDistance = 0;
    for (let i = 0; i < data.length; i++) {
      for (let j = 1; j < data[i].trkpt.length; j++) {
        const point1 = {
          latitude: data[i].trkpt[j - 1].$.lat,
          longitude: data[i].trkpt[j - 1].$.lon,
        };
        const point2 = {
          latitude: data[i].trkpt[j].$.lat,
          longitude: data[i].trkpt[j].$.lon,
        };
        const distance2D = getDistance(point1, point2);

        const elev1 = data[i].trkpt[j - 1].ele;
        const elev2 = data[i].trkpt[j].ele;
        const elevDifference = Math.abs(parseFloat(elev1.join('')) - parseFloat(elev2.join('')));

        totalDistance += Math.sqrt(Math.pow(distance2D, 2) + Math.pow(elevDifference, 2));
      }
    }
    return totalDistance;
  }

  private async getTotalDuration(data: GpxTrkSeg[]): Promise<number> {
    let totalDuration = 0;
    for (let i = 0; i < data.length; i++) {
      const length = data[i].trkpt.length;
      const startTime = new Date(data[i].trkpt[0].time.join(''));
      const endTime = new Date(data[i].trkpt[length - 1].time.join(''));
      totalDuration += Math.abs(endTime.getTime() - startTime.getTime()) / 1000;
    }
    return totalDuration;
  }
}
