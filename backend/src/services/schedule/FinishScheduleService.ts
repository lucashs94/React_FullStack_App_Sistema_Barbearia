import { prismaClient } from "../../prisma"

interface ScheduleRequest{
  schedule_id: string
  user_id: string
}

export class FinishScheduleService{
  async execute({ schedule_id, user_id }: ScheduleRequest){

    if(schedule_id === '' || user_id === '') throw new Error('Invalid data')

    const belongsTo = await prismaClient.service.findFirst({
      where: { userId: user_id, id: schedule_id },
    })

    if(!belongsTo) throw new Error('Not authorized')
    
    const schedule = await prismaClient.service.update({
      where:{
        id: schedule_id,
      },
      data:{
        open: false,
      }
    })

    return {message: 'Fechado com sucesso'}
  }
}