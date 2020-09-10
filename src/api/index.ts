import { Router } from 'express'
import Postcodes from '../services/Postcodes'
const routes = Router()

routes.post('/postcodes', Postcodes.getAllPostcode)

export default routes
