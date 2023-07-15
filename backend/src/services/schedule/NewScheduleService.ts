import { prismaClient } from "../../prisma"

interface ScheduleRequest{
  user_id: string
  haircut_id: string
  customer: string
}

export class NewScheduleService{
  async execute({ user_id, haircut_id, customer }: ScheduleRequest){

    if(customer === '' || haircut_id === '') throw new Error('Invalid data')

    const schedule = await prismaClient.service.create({
      data:{
        customer: customer,
        haircutId: haircut_id,
        userId: user_id,
      }
    })
    
    return schedule
  }
}