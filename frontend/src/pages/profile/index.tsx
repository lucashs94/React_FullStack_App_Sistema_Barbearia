import React, { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link';
import { Box, Button, Flex, Heading, Input, Text } from '@chakra-ui/react'

import { canSSRAuth } from '@/utils/canSSRAuth';
import { Sidebar } from '@/components/sidebar';
import useAuthContext from '@/contexts/AuthContext';
import { apiClient } from '@/services/api'


interface UserProps{
  id: string
  name: string
  email: string
  endereco: string
  subscriptions: {} | null
}

interface ProfileProps{
  user: UserProps
  premium: boolean
}


export default function Profile({ user, premium }: ProfileProps){

  const { AuthSignOut } = useAuthContext()

  const [name, setName] = useState(user && user?.name)
  const [endereco, setEndereco] = useState(user && user?.endereco)


  async function handleUpdateUser(){
    if(name === '') return
    const Apiclient = apiClient()
    
    try {
      await Apiclient.put('/users', {
        name: name,
        endereco: endereco,
      })
    } catch (error) {
      console.log(error);
    }
    
  }

  async function handleLogout(){
    await AuthSignOut()
  }

  return(
    <>
      <Head>
        <title>BarberPro - Minha Conta</title>
      </Head>
      
      <Sidebar>
        <Flex direction='column' alignItems='flex-start' justifyContent='flex-start'>
          <Flex h='100%' direction='row' alignItems='center' justifyContent='flex-start'>
            <Heading fontSize='4xl' mt={4} mb={4} mr={4} color='orange.900'>MINHA CONTA</Heading>
          </Flex>

          <Flex pt={8} pb={8} maxW='900px' w='100%' direction='column' alignItems='center' justifyContent='center' bg='barber.400'>
            <Flex direction='column' w='85%'>

              <Text mb={2} fontSize='xl' fontWeight='bold' color='white'>
                Nome da barbearia:
              </Text>
              <Input 
                w='100%' 
                bg='gray.900' 
                placeholder='Nome da sua barbearia...' 
                size='lg' 
                type='text' 
                mb={3} 
                color='gray.300' 
                value={name} 
                onChange={ (e) => setName(e.target.value) }
              />

              <Text mb={2} fontSize='xl' fontWeight='bold' color='white'>
                Endereco:
              </Text>
              <Input 
                w='100%' 
                bg='gray.900' 
                placeholder='Endereço da barbearia' 
                size='lg' 
                type='text' 
                mb={3} 
                color='gray.300' 
                value={endereco}
                onChange={ e => setEndereco(e.target.value) }
              />

              <Text mb={2} fontSize='xl' fontWeight='bold' color='white'>
                Plano Atual:
              </Text>
              <Flex direction='row' w='100%' mb={3} p={2} borderWidth={1} rounded={6} bg='barber.900' alignItems='center' justifyContent='space-between'>
                <Text p={2} fontSize='lg' fontWeight='bold' color={premium ? '#fba931' : '#4dffb4' }>
                  Plano {premium ? 'Premium' : 'Grátis'}
                </Text>

                <Link href='/planos'>
                  <Box color='white' fontWeight='bold' cursor='pointer' p={2} pl={2} pr={2} bg='#00cd52' rounded={4}>
                    Mudar Plano
                  </Box>
                </Link>
              </Flex>

              <Button 
                w='100%' 
                mt={3} 
                mb={4} 
                bg='button.cta' 
                size='lg' 
                _hover={{ bg: '#ffb13e'}}
                onClick={ handleUpdateUser }
              >
                Salvar
              </Button>

              <Button 
                w='100%' 
                mb={6} 
                bg='transparent' 
                color='red.500' 
                borderWidth={2} 
                borderColor='red.500' 
                size='lg' 
                _hover={{ bg: 'transparent'}}
                onClick={ handleLogout }
              >
                Sair da conta
              </Button>

            </Flex>
          </Flex>
        </Flex>
      </Sidebar>
    </>
  )
}


export const getServerSideProps = canSSRAuth( async (ctx) => {

  try {
    const ApiClient = apiClient(ctx)
    const response = await ApiClient.get('/me')

    const user = response.data

    return{
      props:{
        user: user,
        premium: response.data?.subscriptions?.status === 'active' ? true : false
      }
    }

  } catch (error) {
    console.log(error)

    return{
      redirect:{
        destination: '/dashboard',
        permanent: false,
      }
    }
  }

})