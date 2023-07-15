import React, { useState } from 'react'
import Head from 'next/head'
import { Box, Button, Flex, Heading, Input, Link, Stack, Switch, Text, useMediaQuery } from '@chakra-ui/react'
import { FaArrowLeft } from 'react-icons/fa'

import { canSSRAuth } from '@/utils/canSSRAuth';
import { Sidebar } from '@/components/sidebar';
import { apiClient } from '@/services/api'
import Router from 'next/router';


interface NewHaircutProps{
  subscription: boolean
  count: number
}


export default function NewHaircut({ subscription, count }: NewHaircutProps){

  const [isMobile] = useMediaQuery('(max-width: 500px)')

  const [name, setName] = useState('')
  const [price, setPrice] = useState('')


  async function handleNewHaircut(){
    if(name === '' || price === '') return

    try {
      const APIClient = apiClient()

      await APIClient.post('/haircut', {
        name: name,
        price: Number(price),
      })

      Router.push('/haircuts')

    } catch (error) {
      console.log(error);
    }
  }


  return(
    <>
      <Head>
        <title>BarberPro - Novo Corte</title>
      </Head>
      
      <Sidebar>
        <Flex direction='column' alignItems='flex-start' justifyContent='flex-start'>
          <Flex 
            w='100%' 
            direction={isMobile? 'column' : 'row'} 
            alignItems={isMobile? 'flex-start' : 'center'} 
            justifyContent='flex-start'
          >
            <Link href='/haircuts'>
              <Button
                fontWeight='bold'
                size='sm'
                mr={4}
                bg='gray.600'
                color='white'
                _hover={{ bg: 'gray.500', color: 'black' }}
              >
                <FaArrowLeft/>
                <Text ml={2}>VOLTAR</Text>
              </Button>
            </Link>

            <Heading 
              fontSize={isMobile? '2xl' : '4xl'} 
              mt={4} 
              mb={4} 
              mr={4} 
              color='orange.900'
            >
              NOVO CORTE
            </Heading>
          </Flex>

          <Flex
            maxW='900px'
            bg='barber.400'
            w='100%'
            align='center'
            justifyContent='center'
            color='white'
            pt={8}
            pb={8}
            direction='column'
          >
            <Heading fontSize={isMobile? '22px' : '3xl'} mb={8}>
              Cadastrar Modelo
            </Heading>

            <Input 
              value={name}
              onChange={ e => setName(e.target.value) }
              placeholder='Nome do corte'
              size='lg'
              type='text'
              w='85%'
              bg='gray.900'
              mb={4}
              disabled={!subscription && count >= 3}
              autoCapitalize='words'
            />

            <Input 
              value={price}
              onChange={ e => setPrice(e.target.value) }
              placeholder='Valor do corte ex: 59,90'
              size='lg'
              type='text'
              w='85%'
              bg='gray.900'
              mb={6}
              disabled={!subscription && count >= 3}
            />

            {(!subscription && count >= 3) ? (
              <></>
            ) : (
              <Button 
                onClick={ handleNewHaircut }
                w='85%'
                size='lg'
                color='gray.900'
                mb={6}
                bg='button.cta'
                _hover={{ bg: '#ffb13e' }}
              >
                Cadastrar
              </Button>
            )}

            {!subscription && count >= 3 && (
              <Flex direction='row' align='center' justifyContent='center'>
                <Text>
                  Você atingiu seu limite de cortes.
                </Text>
                <Link href='/planos'>
                  <Text fontWeight='bold' color='#31fb6a' ml={1}>Seja premium!</Text>
                </Link>
              </Flex>
            )}
          </Flex>
 
        </Flex>
      </Sidebar>
    </>
  )
}


export const getServerSideProps = canSSRAuth( async (ctx) => {

  try {
    const api = apiClient(ctx)

    const response = await api.get('/haircuts/check')
    const count = await api.get('/haircuts/count')

    return{
      props:{
        subscription: response.data?.status === 'active' ? true : false,
        count: count.data?.haircuts
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