import axios, { AxiosError } from "axios"
import { parseCookies } from "nookies"

import { AuthTokenError } from "./errors/AuthTokenError"
import useAuthContext, { signOut } from "@/contexts/AuthContext"


export function apiClient(ctx = undefined){
  
  let cookies = parseCookies(ctx) 

  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers:{
      Authorization: `Bearer ${cookies['@barber.token']}`
    }
  })

  api.interceptors.response.use( response => {
    return response
  }, (err: AxiosError) => {
    if(err.response.status === 401){
      if(typeof window !== undefined){
        signOut()
        
      }else{
        return Promise.reject(new AuthTokenError())
      }
    }

    return Promise.reject(err)
  })

  return api
}

