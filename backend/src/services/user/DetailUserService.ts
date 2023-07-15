import { prismaClient } from "../../prisma"
import { compare, hash } from "bcryptjs"


interface DetailUserRequest{
  email: string
  password: string
}

export class DetailUserService{
  async execute(user_id: string){

    const user = await prismaClient.user.findFirst({
      where:{id: user_id},
      select:{
        id: true,
        name: true,
        email: true,
        endereco: true,
        subscriptions:{
          select:{
            id: true,
            priceId: true,
            status: true,
          }
        }
      }
    })
    
    return user
  }
}