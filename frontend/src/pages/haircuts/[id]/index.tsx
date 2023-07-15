import React, { ChangeEvent, useState } from 'react'
import Head from 'next/head'
import { Box, Button, Flex, Heading, Input, Link, Stack, Switch, Text, useMediaQuery } from '@chakra-ui/react'
import { FaArrowLeft } from 'react-icons/fa'

import { canSSRAuth } from '@/utils/canSSRAuth'
import { Sidebar } from '@/components/sidebar'
import { apiClient } from '@/services/api'
import Router from 'next/router'


interface HaircutProps{
  id: string
  name: string
  price: string | number
  status: boolean
  userId: string
}

interface SubsProps{
  id: string
  status: string
}

interface EditHaircutProps{
  haircut: HaircutProps 
  subscriptions: SubsProps | null
}


export default function EditHaircut({ haircut, subscriptions }: EditHaircutProps){

  const [isMobile] = useMediaQuery('(max-width: 500px)')

  const [name, setName] = useState(haircut?.name)
  const [price, setPrice] = useState(haircut?.price)
  const [status, setStatus] = useState(haircut?.status)

  const [disabledSwitch, setDisabledSwitch] = useState(haircut?.status ? 'disabled' : 'enabled')


  async function handleChangeStatus(e: ChangeEvent<HTMLInputElement>){
    if(e.target.value === 'disabled'){
      setDisabledSwitch('enabled')
      setStatus(false)
    }else{
      setDisabledSwitch('disabled')
      setStatus(true)
    }
  }


  async function handleUpdate(){
    if(name === '' || price === '') return

    try {
      const APIClient = apiClient()

      await APIClient.put('/haircut', {
        name: name,
        price: Number(price),
        status: status,
        haircut_id: haircut?.id
      })

      Router.push('/haircuts')

    } catch (error) {
      console.log(error);
    }
  }


  return(
    <>
      <Head>
        <title>BarberPro - Editar Corte</title>
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
              EDITAR CORTE
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
              Editar Modelo
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
              disabled={subscriptions?.status !== 'active'}
            />

            <Input 
              value={price}
              onChange={ e => setPrice(e.target.value) }
              placeholder='Valor do corte. Ex: 59,90'
              size='lg'
              type='text'
              w='85%'
              bg='gray.900'
              mb={6}
              disabled={subscriptions?.status !== 'active'}
            />

            <Stack w='85%' alignSelf='inherit' mb={6} align='center' direction='row'>
              <Text fontWeight='bold' color='white'>Desativar corte</Text>
              <Switch
                size='lg'
                colorScheme='red'
                value={disabledSwitch}
                onChange={ (e: ChangeEvent<HTMLInputElement>) => handleChangeStatus(e) }
                isChecked={disabledSwitch === 'disabled' ? false : true}
                disabled={subscriptions?.status !== 'active'}
              />
            </Stack>

            {subscriptions?.status === 'active' && (
              <Button 
                onClick={ handleUpdate }
                w='85%'
                size='lg'
                color='gray.900'
                mb={6}
                bg='button.cta'
                _hover={{ bg: '#ffb13e' }}
              >
                Salvar
              </Button>
            )}

            {!subscriptions && (
              <Flex direction='row' align='center' justifyContent='center' mt={6}>
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
  const { id } = ctx.params

  try {
    const api = apiClient(ctx)

    const check = await api.get('/haircuts/check')
    const { data } = await api.get('/haircuts/detail', {
      params:{
        haircut_id: id,
      }
    })

    return{
      props:{
        haircut: data,
        subscriptions: check.data
      }
    }

  } catch (error) {
    console.log(error)

    return{
      redirect:{
        destination: '/haircuts',
        permanent: false,
      }
    }
  }

})