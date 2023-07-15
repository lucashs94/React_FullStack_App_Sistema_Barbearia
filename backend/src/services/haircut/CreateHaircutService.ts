import { prismaClient } from "../../prisma"


interface HaircutRequest{
  user_id: string
  name: string
  price: number
}

export class CreateHaircutService{
  async execute({user_id, name, price}: HaircutRequest){

    if(!name || !price) throw new Error('Invalid data')

    const haircutModels = await prismaClient.haircut.count({
      where:{ userId: user_id }
    })

    const user = await prismaClient.user.findFirst({
      where:{ id: user_id },
      include:{ subscriptions: true }
    })

    if(haircutModels >= 3 && user?.subscriptions?.status !== 'active'){
      throw new Error('Not authorized')
    }

    const haircut = await prismaClient.haircut.create({
      data:{
        name: name,
        price: price,
        userId: user_id,
      }
    })
    
    return haircut
  }
}