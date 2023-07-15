import { ReactNode, createContext, useContext, useEffect, useState } from 'react'
import Router from 'next/router'
import { destroyCookie, parseCookies, setCookie } from 'nookies'
import { api } from '@/services/apiClient'


interface AuthContextData{
  user: UserProps
  isAuthenticated: boolean
  loading: boolean
  AuthSignUp: (credentials: SignUpProps) => Promise<void>
  AuthSignIn: (credentials: SignInProps) => Promise<void>
  AuthSignOut: () => Promise<void>
}

interface UserProps{
  id: string
  name: string
  email: string
  endereco: string | null
  subscriptions?: SubscriptionProps | null
}

interface SubscriptionProps{
  id: string
  status: string
}

interface SignInProps {
  email: string
  password: string
}

interface SignUpProps {
  name: string
  email: string 
  password: string
}

type AuthProviderProps = {
  children: ReactNode
}

export function signOut(){
  try {
    destroyCookie(null, '@barber.token', { path: '/'})
    Router.push('/login')
    
  } catch (error) {
    console.log('Error ao deslogar');
  }
}

export const AuthContext = createContext({} as AuthContextData)

export function AuthProvider({ children }: AuthProviderProps){

  const [user, setUser] = useState<UserProps>()
  const isAuthenticated = !!user
  const [loading, setLoading] = useState(false)


  useEffect(() => {

    const { '@barber.token': token } = parseCookies()

    if(token){
      api.get('/me')
      .then( (response) => {
        
        setUser(response.data)
      })
      .catch( () => {
        signOut()
      })
    }

  }, [])


  async function AuthSignUp({name, email, password}: SignUpProps){
    try {
      const { data } = await api.post('/users', {
        email,
        password,
        name,
      })

      Router.push('/login')
      
    } catch (error) {
      console.log(error);
    }
    
  }


  async function AuthSignIn({email, password}: SignInProps){
    
    try {
      const { data } = await api.post('/users/auth', {
        email,
        password,
      })

      const { id, name, token, subscriptions, endereco } = data

      setCookie(undefined, '@barber.token', token, {
        maxAge: 60 * 60 * 24 * 30,
        path: '/'
      })
      
      setUser({ id, name, email, endereco, subscriptions })

      api.defaults.headers.common['Authorization'] = `Bearer ${token}`

      Router.push('/dashboard')
      
    } catch (error) {
      console.log(error);
    }
  }


  async function AuthSignOut(){
    try {
      destroyCookie(null, '@barber.token', { path: '/' })
      setUser(null)
      Router.push('/login')

    } catch (error) {
      console.log(error);
    }
  }


  return(
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        AuthSignUp,
        AuthSignIn,
        AuthSignOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}


export default function useAuthContext(){
  return(
    useContext(AuthContext)
  )
}