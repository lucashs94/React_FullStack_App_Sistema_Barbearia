import { Response,  Request, NextFunction } from "express"
import { verify } from "jsonwebtoken"

interface Payload{
  sub: string
}

export function isAuthenticated(req:Request, res: Response, next: NextFunction){
  const authToken = req.headers.authorization

  if(!authToken) return res.status(400).end()


  const token = authToken.split(' ')[1]
  
  try {
    const { sub } = verify( token, process.env.JWT_SECRET) as Payload

    req.user_id = sub
    return next()

  } catch (error) {
    return res.status(401).end()
  }
}