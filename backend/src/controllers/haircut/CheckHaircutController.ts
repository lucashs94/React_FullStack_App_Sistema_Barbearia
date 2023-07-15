import { Request, Response } from "express"
import { CheckHaircutService } from "../../services/haircut/CheckHaircutService";


export class CheckHaircutController{
  async handle(req: Request, res: Response){

    const user_id = req.user_id

    const checkHaircutService = new CheckHaircutService()
    const subscription = await checkHaircutService.execute({user_id})

    return res.json(subscription)
  }
}