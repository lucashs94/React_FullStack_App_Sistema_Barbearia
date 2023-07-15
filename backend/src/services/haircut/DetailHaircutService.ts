import { prismaClient } from "../../prisma"

interface HaircutRequest{
  haircut_id: string
}

export class DetailHaircutService{
  async execute({ haircut_id }: HaircutRequest){

    const haircut = await prismaClient.haircut.findFirst({
      where:{ 
        id: haircut_id,
      }
    })

    return haircut
  }
}