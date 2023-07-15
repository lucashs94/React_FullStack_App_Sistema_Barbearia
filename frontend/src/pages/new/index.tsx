import React, { ChangeEvent, useState } from 'react'
import Head from 'next/head'
import { Box, Button, Flex, Heading, Input, Link, Select, Stack, Switch, Text, useMediaQuery } from '@chakra-ui/react'
import { FaArrowLeft } from 'react-icons/fa'

import { canSSRAuth } from '@/utils/canSSRAuth';
import { Sidebar } from '@/components/sidebar';
import { apiClient } from '@/services/api'
import Router from 'next/router';

interface HaircutProps{
  id: string
  name: string
  price: number | string
  status: boolean
  userId: string
}

interface ListHaircutsProps{
  haircuts: HaircutProps[]
}

//TODO: criar alertas para todas as telas

export default function New({ haircuts }: ListHaircutsProps){

  const [isMobile] = useMediaQuery('(max-width: 500px)')

  const [customerName, setCustomerName] = useState('')
  const [haircutSelected, setHaircutSelected] = useState<HaircutProps | null>()


  async function handleChangeSelect(id: string){
    
    const Item = haircuts.find( item => item.id === id )
    setHaircutSelected(Item)
  }


  async function handleRegisterAtendance() {
    if(customerName === '' || haircutSelected === null) return
    
    try {
      const api = apiClient()
      const {} = await api.post('/schedule', {
        customer: customerName,
        haircut_id: haircutSelected?.id,
      })

      Router.push('/dashboard')

    } catch (error) {
      console.log(error);
    }
    
  }

  return(
    <>
      <Head>
        <title>BarberPro - Novo Agendamento</title>
      </Head>
      
      <Sidebar>
        <Flex direction='column' alignItems='flex-start' justifyContent='flex-start'>
          <Flex 
            w='100%' 
            direction={isMobile? 'column' : 'row'} 
            alignItems={isMobile? 'flex-start' : 'center'} 
            justifyContent='flex-start'
          >
            <Link href='/dashboard'>
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
              NOVO AGENDAMENTO
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
              Atendimento
            </Heading>

            <Input 
              value={customerName}
              onChange={ e => setCustomerName(e.target.value) }
              placeholder='Digite o nome do cliente'
              size='lg'
              type='text'
              w='85%'
              bg='gray.900'
              mb={4}
            />

            <Select
              mb={4}
              size='lg'
              w='85%'
              onChange={ (e) => handleChangeSelect(e.target.value) }
            >
              <option disabled selected key={0} value='select'>Selecione uma opção</option>
              {haircuts?.map( haircut => (
                <option style={{ backgroundColor: '#FFF', color: '#000' }} key={haircut?.id} value={haircut?.id}>{haircut?.name}</option>
              ))}
            </Select>

            <Button 
              onClick={ handleRegisterAtendance }
              w='85%'
              size='lg'
              color='gray.900'
              mb={6}
              bg='button.cta'
              fontWeight='bold'
              _hover={{ bg: '#ffb13e' }}
            >
              Registrar atendimento
            </Button>

          </Flex>
 
        </Flex>
      </Sidebar>
    </>
  )
}


export const getServerSideProps = canSSRAuth( async (ctx) => {

  try {
    const api = apiClient(ctx)

    const { data } = await api.get('/haircuts', {
      params:{
        status: true,
      }
    })

    if(data === null){
      return{
        redirect:{
          destination: '/dashboard',
          permanent: false,
        }
      }
    }

    return{
      props:{
        haircuts: data,
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