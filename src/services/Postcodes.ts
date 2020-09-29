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
      const { datefrom, dateto, postcode, f4, prebookno } = req.body
      const whereF4 = f4 ? `where noOrganization  = '${f4}'` : `where noOrganization like '${'%'}'`
      const whereprebookno = prebookno ? `and noDepartment = '${prebookno}'` : `and noDepartment like '${'%'}'`
      const wherepostcode = postcode ? `and F25 = '${postcode}'` : `and F25 like '${'%'}'`
      const data = await mssql.query(`
      select
        F7,
        F25,
        noOrganization,
        noDepartment,
        address
      from
        (SELECT
          F7 = C.F7
          ,F25 = case
                  when REPLACE(C.F25, ' ', '') is null then case
                    when
                      REPLACE(C.F26, ' ', '') is null then C.F26
                    end
                  else C.F25
                end
          ,noOrganization = SUBSTRING(C.F1,5,9)+ '/' +SUBSTRING(C.F1,1,4)
          ,noDepartment = (C.PreBookNO + C.F4)
          ,address = case when (L.ADDRESS1 + L.ADDRESS2+ L.ADDRESS3) is null then '-' else (L.ADDRESS1 + L.ADDRESS2+ L.ADDRESS3) end
          FROM [OA_OMB].[dbo].[PC_CONTENT] C
          left outer join [PC_LETTERWF] L on L.CONTENTID = C.CONTENTID
          where cast(C.F5 as date) BETWEEN '${datefrom}' AND '${dateto}'
          and (C.F25 like 'E%' or C.F25 like 'R%')
        ) TB1
        ${whereF4}
        ${whereprebookno}
        ${wherepostcode}
      order by F25,noOrganization desc;
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