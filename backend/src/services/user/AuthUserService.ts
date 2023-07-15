import { sign } from "jsonwebtoken";
import { prismaClient } from "../../prisma"
import { compare, hash } from "bcryptjs";


interface AuthUserRequest{
  email: string
  password: string
}

export class AuthUserService{
  async execute({email, password}: AuthUserRequest){

    if(email === '' || password === '' ) throw new Error('Email/password required')

    const user = await prismaClient.user.findFirst({
      where: {email: email},
      include:{subscriptions: true},
    })

    if(!user) throw new Error('Email/password incorrects')

    const passwordCompare = await compare(password, user?.password)

    if(!passwordCompare) throw new Error('Email/password incorrects')

    const token = sign(
      {
        name: user.name,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        subject: user.id,
        expiresIn: '30d',
      }
    )
    
    return {
      id: user?.id,
      name: user?.name,
      email: user?.email,
      endereco: user?.endereco,
      token: token,
      subscriptions: user.subscriptions ? {
        id: user?.subscriptions?.id,
        status: user?.subscriptions?.status
      } : null,
    }
  }
}