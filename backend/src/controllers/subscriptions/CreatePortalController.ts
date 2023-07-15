import { Request, Response, json } from "express"
import { CreatePortalService } from "../../services/subscriptions/CreatePortalService"


export class CreatePortalController{
  async handle(req: Request, res: Response){

    const user_id = req.user_id

    const createPortal = new CreatePortalService()
    const portal = await createPortal.execute({ user_id })

    return res.json(portal)
  }
}