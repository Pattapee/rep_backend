import dotenv from 'dotenv';
import { Request, Response } from 'express';
import * as _ from 'lodash';
import {
  HTTPSTATUS_BADREQUEST,
  HTTPSTATUS_NOTFOUND,
  HTTPSTATUS_OK,
} from '../constants/HttpStatus';
dotenv.config();

const OAOMB = process.env.DB_OA_OMB;
const CIM_PROD = process.env.DB_CIM_PROD;

export default class ChangeprebooknoServices {
  public static getContentbook = async (req: Request, res: Response) => {
    const mssql = require('mssql');
    try {
      await mssql.close();
      await mssql.connect(CIM_PROD);
      const { black_number, book_number } = req.body;
      const data = await mssql.query(`
      SELECT TOP 1 PB.publish_book_id
        ,C.black_number
        ,PB.CONTENTID
        ,PB.content_no
        ,C.complain_id
        ,PB.book_number
      FROM [Publish_book] PB
      left outer join Complain C on C.complain_id = PB.complain_id
      where C.black_number = '${black_number}'
      and PB.book_number = 'ผผ ${book_number}'
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
        ,[ORDERID]
      FROM [PC_BOOKNO] BN
      where (BN.BOOKNO like '%ผผ 090%'
        or BN.BOOKNO like '%ผผ 100%'
        or BN.BOOKNO like '%ผผ 110%'
        or BN.BOOKNO like '%ผผ 120%'
        or BN.BOOKNO like '%ผผ 070%'
        or BN.BOOKNO like '%ผผ 080%'
        or BN.BOOKNO like '%ผผ 130%')
      order by BN.ORDERID asc;
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

  public static getBNIDOmbudsmanOffice = async (req: Request, res: Response) => {
    const { prebookno } = req.body;
    const mssql = require('mssql');
    try {
      await mssql.close();
      await mssql.connect(OAOMB);
      const data = await mssql.query(`
      SELECT TOP 1
        [BNID],
        [BOOKNO]
      FROM [PC_BOOKNO]
      where BOOKNO  = '${prebookno.toString()}' and Removed is null
      `);
      if (data) {
        res.status(HTTPSTATUS_OK).send(data.recordset[0]);
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
      FROM [PC_CONTENT] C
      where
      YEAR(C.F2) = ${year}
      and C.FOLDERID = 63
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
      UPDATE [PC_CONTENT]
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
      UPDATE [Publish_book]
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
