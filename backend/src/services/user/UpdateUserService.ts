import { prismaClient } from "../../prisma"
import { hash } from "bcryptjs";


interface UserRequest{
  user_id: string
  name: string
  endereco: string
}

export class UpdateUserService{
  async execute({user_id, name, endereco}: UserRequest){

    try {
      
      const userExists = await prismaClient.user.findFirst({
        where:{ id: user_id, }
      })

      if(!userExists) throw new Error('User not exists')

      const userUpdated = await prismaClient.user.update({
        where:{
          id: user_id,
        },
        data:{
          name,
          endereco,
        },
        select:{
          name: true,
          email: true,
          endereco: true, 
        }
      })
      
      return userUpdated

    } catch (error) {
      throw new Error('Error on update user')
    }
  }
}