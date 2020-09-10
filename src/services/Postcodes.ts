import { Request, Response } from 'express';
import * as _ from 'lodash';
import {
  HTTPSTATUS_BADREQUEST,
  HTTPSTATUS_NOTFOUND,
  HTTPSTATUS_OK,
} from '../constants/HttpStatus';

const userDB = 'mssql://sa:Passw0rd!@192.168.2.21/OA_OMB';

export default class DashboardServices {

  public static getAllPostcode = async (req: Request, res: Response) => {
    const mssql = require('mssql')
    try {
      await mssql.close();
      await mssql.connect(userDB)
      const { datefrom, dateto } = req.body
      const data = await mssql.query(`
        SELECT
        C.F7
        ,REPLACE(C.F25, ' ', '') as F25
        ,SUBSTRING(C.F1,5,9)+ '/' +SUBSTRING(C.F1,1,4) as noOrganization
        ,(C.PreBookNO+ C.F4) as noDepartment
        ,L.ADDRESS1 as address
        FROM [OA_OMB].[dbo].[PC_CONTENT] C
        left outer join [PC_LETTERWF] L on L.CONTENTID = C.CONTENTID
        where cast(C.F5 as date) BETWEEN '${datefrom}' AND '${dateto}'
        and C.F25 != '' and C.F25 is not null
        and (C.F25 like 'E%' or C.F25 like 'R%')
        order by C.F25,C.PREBOOKNO desc
      `);
      if (data) {
        res.status(HTTPSTATUS_OK).send(data.recordset);
      } else {
        res.status(HTTPSTATUS_NOTFOUND).send({ data: false });
      }
      await mssql.close();

    } catch (err) {
      console.error(err)
      res.status(HTTPSTATUS_BADREQUEST).send(err);
    }
  }
}
