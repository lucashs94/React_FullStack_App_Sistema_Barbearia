import { prismaClient } from "../../prisma"


interface HaircutRequest{
  user_id: string
  status: string | boolean
}

export class ListHaircutService{
  async execute({user_id, status}: HaircutRequest){

    const haircuts = await prismaClient.haircut.findMany({
      where:{ 
        userId: user_id,
        status: status === 'true' ? true : false,
      }
    })

    return haircuts
  }
}