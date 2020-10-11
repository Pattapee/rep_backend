import { Router } from 'express'
import { Change } from 'ldapts'
import Changeprebookno from '../services/Changeprebookno'
import Postcodes from '../services/Postcodes'
const routes = Router()

routes.post('/postcodes', Postcodes.getAllPostcode)
routes.get('/getprebookname', Changeprebookno.getPrebookname)
routes.post('/getcontentbook', Changeprebookno.getContentbook)
routes.post('/getmaxf4', Changeprebookno.getMaxF4)
routes.post('/updatepccontent', Changeprebookno.updatepccontent)
routes.post('/updatepublishbook', Changeprebookno.updatepublishbook)

export default routes
