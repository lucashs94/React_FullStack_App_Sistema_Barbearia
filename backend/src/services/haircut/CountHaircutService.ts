import { prismaClient } from "../../prisma"


interface HaircutRequest{
  user_id: string
}

export class CountHaircutService{
  async execute({user_id}: HaircutRequest){

    const haircuts = await prismaClient.haircut.count({
      where:{ 
        userId: user_id,
      }
    })

    return {haircuts}
  }
}