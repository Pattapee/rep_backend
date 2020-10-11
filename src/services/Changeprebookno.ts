import { Request, Response } from 'express';
import * as _ from 'lodash';
import {
  HTTPSTATUS_BADREQUEST,
  HTTPSTATUS_NOTFOUND,
  HTTPSTATUS_OK,
} from '../constants/HttpStatus';

const OAOMB = 'mssql://sa:Passw0rd!@192.168.2.21/OA_OMB';
const CIM_PROD = 'mssql://sa:s@Ombc!m@192.168.100.24/CIM_PROD';

export default class ChangeprebooknoServices {
  public static getContentbook = async (req: Request, res: Response) => {
    const mssql = require('mssql');
    try {
      await mssql.close();
      await mssql.connect(CIM_PROD);
      const { black_number } = req.body;
      const data = await mssql.query(`
      SELECT TOP 1 PB.publish_book_id
        ,C.black_number
        ,PB.CONTENTID
        ,PB.content_no
        ,C.complain_id
        ,PB.book_number
      FROM [CIM_PROD].[dbo].[Publish_book] PB
      left outer join Complain C on C.complain_id = PB.complain_id
      where C.black_number = '${black_number}'
      order by PB.publish_book_id desc;
      `);
      if (data) {
        res.status(HTTPSTATUS_OK).send(data.recordset);
      } else {
        res.status(HTTPSTATUS_NOTFOUND).send({ data: false });
      }
      await mssql.close();
    } catch (err) {
      console.error(err);
      res.status(HTTPSTATUS_BADREQUEST).send(err);
    }
  };

  public static getPrebookname = async (req: Request, res: Response) => {
    const mssql = require('mssql');
    try {
      await mssql.close();
      await mssql.connect(OAOMB);
      const data = await mssql.query(`
      SELECT [BNID]
        ,[DEPNAME]
        ,[BOOKNO]
      FROM [OA_OMB].[dbo].[PC_BOOKNO] BN
      where BN.BNID in (7,8,9,10,20,25,26)
      and BN.Removed is null
      order by BN.BOOKNO asc;
      `);
      if (data) {
        res.status(HTTPSTATUS_OK).send(data.recordset);
      } else {
        res.status(HTTPSTATUS_NOTFOUND).send({ data: false });
      }
      await mssql.close();
    } catch (err) {
      console.error(err);
      res.status(HTTPSTATUS_BADREQUEST).send(err);
    }
  };

  public static getMaxF4 = async (req: Request, res: Response) => {
    const mssql = require('mssql');
    try {
      await mssql.close();
      await mssql.connect(OAOMB);
      const { F1RUN, year } = req.body;
      const data = await mssql.query(`
      SELECT top 1
        cast(C.F4 as int) as F4
        ,C.PREBOOKNO
        ,C.F1RUN
        ,C.F2
      FROM [OA_OMB].[dbo].[PC_CONTENT] C
      where
      YEAR(C.F2) = ${year}
      and C.ISCOMPLAIN = 1
      and C.F1RUN = ${F1RUN}
      order by F4 desc;
      `);
      if (data) {
        res.status(HTTPSTATUS_OK).send(data.recordset);
      } else {
        res.status(HTTPSTATUS_NOTFOUND).send({ data: false });
      }
      await mssql.close();
    } catch (err) {
      console.error(err);
      res.status(HTTPSTATUS_BADREQUEST).send(err);
    }
  };

  public static updatepccontent = async (req: Request, res: Response) => {
    const mssql = require('mssql');
    try {
      await mssql.close();
      await mssql.connect(OAOMB);
      const { F4, PREBOOKNO, F1RUN, CONTENTID } = req.body;
      const data = await mssql.query(`
      UPDATE [OA_OMB].[dbo].[PC_CONTENT_120425]
      SET F4 = '${F4}'
      ,PREBOOKNO = '${PREBOOKNO}'
      ,F1RUN = ${F1RUN}
      WHERE CONTENTID = ${CONTENTID};
      `);
      if (data) {
        res.status(HTTPSTATUS_OK).send({ data: true });
      } else {
        res.status(HTTPSTATUS_NOTFOUND).send({ data: false });
      }
      await mssql.close();
    } catch (err) {
      console.error(err);
      res.status(HTTPSTATUS_BADREQUEST).send(err);
    }
  };

  public static updatepublishbook = async (req: Request, res: Response) => {
    const mssql = require('mssql');
    try {
      await mssql.close();
      await mssql.connect(CIM_PROD);
      const { book_number, CONTENTID } = req.body;
      const data = await mssql.query(`
      UPDATE [CIM_PROD].[dbo].[Publish_book]
      SET book_number = '${book_number}'
      WHERE CONTENTID = ${CONTENTID}
      `);
      if (data) {
        res.status(HTTPSTATUS_OK).send({ data: book_number });
      } else {
        res.status(HTTPSTATUS_NOTFOUND).send({ data: false });
      }
      await mssql.close();
    } catch (err) {
      console.error(err);
      res.status(HTTPSTATUS_BADREQUEST).send(err);
    }
  };
}
