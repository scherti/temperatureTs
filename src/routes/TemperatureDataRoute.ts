import bodyParser = require('body-parser');
import path = require('path');
import {Express} from 'express';
import {addYears, subYears} from 'date-fns';
import {Between, createQueryBuilder, getRepository} from "typeorm";
import TemperatureLog from "../entity/TemperatureLog";
import moment from "moment";
// @ts-ignore
let _ = require('lodash');

// TypeORM Query Operators
export const AfterDate = (date: Date) => Between(date, addYears(date, 100));
export const BeforeDate = (date: Date) => Between(subYears(date, 100), date);

export class TemperatureDataRoute {
  private static instance: TemperatureDataRoute;

  public static getInstance(app: Express): TemperatureDataRoute {

    async function queryUniqueSensorIds() {
      let uniqueSensorIds = await createQueryBuilder()
      .select('temperatureLog.sensorId')
      .distinct(true)
      .from(TemperatureLog, "temperatureLog")
      .getRawMany();
      return uniqueSensorIds;
    }

    async function queryTemperatureValuesBySensorId(sensorId: string, startDateObject: Date, endDateObject: Date) {
      let filteredValues = await createQueryBuilder()
      .select("temperatureLog")
      .from(TemperatureLog, "temperatureLog")
      .where("temperatureLog.measurementTime >= :measurementTimeStart AND temperatureLog.measurementTime <= :measurementTimeEnd AND temperatureLog.sensorId = :sensorId",
          {measurementTimeStart: startDateObject, measurementTimeEnd: endDateObject, sensorId})
      .getMany();
      // filteredValues = _.sortBy(filteredValues, ['id']);
      filteredValues = _.sortBy(filteredValues, ['measurementTime']);
      return {label: sensorId, data: filteredValues};
    }

    async function getTemperatureValuesBySensorIds(sensorIds: string[], startDateObject: Date, endDateObject: Date, response: any) {
      let result = new Array();
      Promise.all(sensorIds.map(async (sensorId) => {
        await queryTemperatureValuesBySensorId(sensorId, startDateObject, endDateObject)
        .then((resultBySensor) => {
          result.push(resultBySensor);
        });
      })).then(() => {
        response.send(JSON.stringify(result));
      });
    }

    if (!TemperatureDataRoute.instance) {
      TemperatureDataRoute.instance = new TemperatureDataRoute();

      app.get('/', function (req, res) {
        const a = path.join(__dirname + '/index.html');
        res.sendFile(a);
      });

      app.get('/temperatureData', async (req: any, res: { send: (arg0: string) => void; }, next: any) => {
        const {startDate, endDate, sensorId} = req.query;
        const startDateObject = moment(Number.parseInt(startDate)).toDate();
        const endDateObject = moment(Number.parseInt(endDate)).toDate();

        if (sensorId) {
          const result = await getTemperatureValuesBySensorIds([sensorId], startDateObject, endDateObject, res);
          res.send(JSON.stringify(result));
        } else {
          // const sensorIds = ['def1', 'def2'];
          const uniqueSensorIdObjects = await queryUniqueSensorIds();
          const sensorIds = new Array();
          uniqueSensorIdObjects.map(sensorIdObject => {
            sensorIds.push(sensorIdObject.temperatureLog_sensorId);
          })
          getTemperatureValuesBySensorIds(sensorIds, startDateObject, endDateObject, res);
        }
      });

      let jsonParser = bodyParser.json()
      app.post('/temperatureData', jsonParser, async (req, res) => {
        const values = req.body.values;
        values.map(async (currentValue: TemperatureLog) => {
          currentValue.measurementTime = new Date(currentValue.measurementTime);
          // const newTemperatureLog = new TemperatureLog();
          // newTemperatureLog.startDateTime
          try {
            await getRepository(TemperatureLog).save(currentValue);
          } catch (e) {
            console.log(e)
          }
        });
        res.send(JSON.stringify('done'));
      });
    }
    return TemperatureDataRoute.instance;
  }
}

