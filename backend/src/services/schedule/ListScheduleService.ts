import { prismaClient } from "../../prisma"

interface ScheduleRequest{
  user_id: string
}

export class ListScheduleService{
  async execute({ user_id }: ScheduleRequest){

    if(!user_id) throw new Error('Invalid data')

    const schedules = await prismaClient.service.findMany({
      where:{
        userId: user_id,
        open: true,
      },
      select:{
        id: true,
        customer: true,
        haircut: true,
      }
    })
    
    return schedules
  }
}