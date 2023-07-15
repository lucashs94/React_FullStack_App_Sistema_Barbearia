import { prismaClient } from "../../prisma"


interface HaircutRequest{
  user_id: string
}

export class CheckHaircutService{
  async execute({user_id}: HaircutRequest){

    const subscription = await prismaClient.subscription.findFirst({
      where:{ 
        userId: user_id,
      },
      select:{
        id: true,
        status: true,
      }
    })

    return subscription
  }
}