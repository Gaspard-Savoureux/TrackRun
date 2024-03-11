import { Parser } from 'xml2js';
import * as fs from 'fs';
import {getDistance} from 'geolib';

export class gpxParser {
  private parser: Parser;

  constructor() {
    this.parser = new Parser({explicitArray: false});
  }

  public async parseGpxFile(filePath: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          reject(err);
        } else {
          this.parser.parseString(data, async (error: any, result: any) => {
            if (error) {
              reject(error);
            } else {
              try {
                // calculate total distance and duration
                const totalDistance = await this.getTotalDistance(filePath);
                const totalDuration = await this.getTotalDuration(filePath);

                // add to result
                result.totalDistance = totalDistance;
                result.totalDuration = totalDuration;

                resolve(result);
              } catch (err) {
                reject(err);
              }
            }
          });
        }
      });
    });
  }

  public async getTotalDistance(filePath: string): Promise<number> {
    const data = await this.parseGpxFile(filePath);
    let totalDistance = 0;
    for (let i = 1; i < data.trk.trkseg.trkpt.length; i++) {
      const point1 = {
        latitude: data.trk.trkseg.trkpt[i - 1].$.lat,
        longitude: data.trk.trkseg.trkpt[i - 1].$.lon,
      };
      const point2 = {
        latitude: data.trk.trkseg.trkpt[i].$.lat,
        longitude: data.trk.trkseg.trkpt[i].$.lon,
      };
      // Calculating 2D distance
      const distance2D = getDistance(point1, point2);

      // Getting elevation difference and converting it to meters if it's not
      const elev1 = data.trk.trkseg.trkpt[i - 1].ele;
      const elev2 = data.trk.trkseg.trkpt[i].ele;
      const elevDifference = Math.abs(elev2 - elev1);

      // Calculating 3D distance
      totalDistance += Math.sqrt(Math.pow(distance2D, 2) + Math.pow(elevDifference, 2));
    }
    return totalDistance;
  }

  public async getTotalDuration(filePath: string): Promise<number> {  // new function
    const data = await this.parseGpxFile(filePath);
    const startTime = new Date(data.trk.trkseg.trkpt[0].time);
    const endTime = new Date(data.trk.trkseg.trkpt[data.trk.trkseg.trkpt.length - 1].time);
    const totalDuration = Math.abs(endTime.getTime() - startTime.getTime()) / 1000;  // duration in seconds
    return totalDuration;
  }
  
}

