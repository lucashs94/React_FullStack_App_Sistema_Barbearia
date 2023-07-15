import express, { Request, Response, NextFunction } from "express"
import "express-async-errors"
import cors from 'cors'

require("dotenv").config()

import { router } from "./routes";


const app = express()
app.use(cors())

app.use((req, res, next) => {
  if(req.originalUrl === '/webhooks'){
    next()
  }else{
    express.json()(req, res, next)
  }
})

app.use(router)

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  if(error instanceof Error){
    console.log(error);
    
    return res.status(400).json({
      error: error.message
    })
  }

  return res.status(500).json({
    status: 'error',
    message: 'Internal server error'
  })
})

app.listen(process.env.PORT, () => console.log(`server running on port: http://localhost:${process.env.PORT}`))
