import React, { useState } from 'react'
import Head from 'next/head'
import { Box, Button, Flex, Heading, Input, Text, useMediaQuery } from '@chakra-ui/react'

import { canSSRAuth } from '@/utils/canSSRAuth';
import { Sidebar } from '@/components/sidebar';
import { apiClient } from '@/services/api'
import { getStripeJs } from '@/services/stripe-js';

interface PlanosProps{
  premium: boolean
}

export default function Planos({ premium }: PlanosProps){

  const [isMobile] = useMediaQuery('(max-width: 500px)')


  async function handleSubscribe(){
    if(premium) return

    try {
      const api = apiClient()
      
      const { data } = await api.post('/subscribe')

      const stripe = await getStripeJs()
      await stripe.redirectToCheckout({ sessionId: data?.sessionId })

    } catch (error) {
      console.log(error)
    }
  }


  async function handleCreatePortal(){

    try {
      
      if(!premium) return

      const api = apiClient()
      const { data } = await api.post('/create-portal')

      window.location.href = data.sessionId

    } catch (error) {
      console.log(error);
    }
  }


  return(
    <>
      <Head>
        <title>BarberPro - Planos</title>
      </Head>
      
      <Sidebar>
        <Flex direction='column' alignItems='flex-start' justifyContent='flex-start'>
          <Flex h='100%' direction='row' alignItems='center' justifyContent='flex-start'>
            <Heading fontSize='4xl' mt={4} mb={4} mr={4} color='orange.900'>PLANOS</Heading>
          </Flex>

          <Flex pt={8} pb={8} maxW='900px' w='100%' direction='column' alignItems='center' justifyContent='center' color='white'>
            <Flex direction={isMobile ? 'column' : 'row'} w='100%' gap={4}>
              <Flex rounded={4} p={2} flex={1} bg='barber.400' direction='column'>
                <Heading 
                  textAlign='center'
                  fontSize='2xl'
                  mt={2} mb={4}
                  color='gray.100'
                >
                  Plano Grátis
                </Heading>

                <Text fontWeight='medium' ml={4} mb={2}>Registrar Cortes</Text>
                <Text fontWeight='medium' ml={4} mb={2}>Apenas 3 modelos</Text>
                <Text fontWeight='medium' ml={4} mb={2}>Cores alterar</Text>
              </Flex>
              
              <Flex rounded={4} p={2} flex={1} bg='barber.400' direction='column'>
                <Heading 
                  textAlign='center'
                  fontSize='2xl'
                  mt={2} mb={4}
                  color='#31fb6a'
                >
                  Premium
                </Heading>

                <Text fontWeight='medium' ml={4} mb={2}>Registrar Cortes Ilimitados</Text>
                <Text fontWeight='medium' ml={4} mb={2}>Apenas modelos Ilimitados</Text>
                <Text fontWeight='medium' ml={4} mb={2}>Edita modelos de cortes</Text>
                <Text fontWeight='medium' ml={4} mb={2}>Recebr atualizações</Text>
                <Text fontWeight='medium' ml={4} mb={2}>Editar dados usuarios</Text>
                <Text color='#31fb6a' fontWeight='bold' fontSize='2xl' ml={4} mb={2}>R$ 99,99</Text>

                <Button
                  bg={premium ? 'barber.900' : 'button.cta'}
                  m={2}
                  color='white'
                  fontWeight='bold'
                  _hover={{ bg: 'barber.500'}}
                  disabled={premium} 
                  onClick={ premium ? () => {} : handleSubscribe }
                >
                  {premium ? (
                    "Você já é Premium"
                  ) : (
                    "VIRAR PREMIUM"
                  )}
                </Button>

                {premium && (
                  <Button
                    bg='white'
                    m={2}
                    fontWeight='bold'
                    onClick={ handleCreatePortal }
                  >
                    ALTERAR ASSINATURA
                  </Button>
                )}
              </Flex>

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

    const { data } = await ApiClient.get('/me')

    return{
      props:{
        premium: data?.subscriptions?.status === 'active' ? true : false
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