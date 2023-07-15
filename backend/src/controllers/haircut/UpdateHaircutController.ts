import { Request, Response } from "express"
import { UpdateHaircutService } from "../../services/haircut/UpdateHaircutService"


export class UpdateHaircutController{
  async handle(req: Request, res: Response){

    const { name, price, status, haircut_id } = req.body
    const user_id = req.user_id

    const updateHaircutService = new UpdateHaircutService()
    const haircut = await updateHaircutService.execute({user_id, haircut_id, name, price, status})

    return res.json(haircut)
  }
}