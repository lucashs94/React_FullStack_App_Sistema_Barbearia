import { Request, Response } from "express"
import { ListScheduleService } from "../../services/schedule/ListScheduleService"


export class ListScheduleController{
  async handle(req: Request, res: Response){

    const user_id = req.user_id

    const listSchedule = new ListScheduleService()
    const schedules = await listSchedule.execute({ user_id })

    return res.json(schedules)
  }
}