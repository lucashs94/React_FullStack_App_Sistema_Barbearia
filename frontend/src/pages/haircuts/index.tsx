import React, { ChangeEvent, useState } from 'react'
import Head from 'next/head'
import { Box, Button, Flex, Heading, Link, Stack, Switch, Text, useMediaQuery } from '@chakra-ui/react'
import { IoMdPricetag } from 'react-icons/io'

import { canSSRAuth } from '@/utils/canSSRAuth';
import { Sidebar } from '@/components/sidebar';
import useAuthContext from '@/contexts/AuthContext';
import { apiClient } from '@/services/api'


interface HaircutsItem{
  id: string
  name: string
  price: number | string
  status: boolean
  userId: string
}

interface HaircutsProps{
  haircuts: HaircutsItem[]
}

export default function Haircuts({ haircuts }: HaircutsProps){

  const [isMobile] = useMediaQuery('(max-width: 500px)')
  const { AuthSignOut } = useAuthContext()

  const [haircutsList, setHaircutsList] = useState<HaircutsItem[]>(haircuts || [])

  const [haircutsStatusSwitch, setHaircutsStatusSwitch] = useState('enabled')


  async function handleSwitchChange(e: ChangeEvent<HTMLInputElement>){

    const api = apiClient()
    
    if(e.target.value === 'disabled'){
      setHaircutsStatusSwitch('enabled')

      const { data } = await api.get('/haircuts', {
        params:{
          status: true,
        }
      })

      setHaircutsList(data)

    }else{
      setHaircutsStatusSwitch('disabled')

      const { data } = await api.get('/haircuts', {
        params:{
          status: false,
        }
      })

      setHaircutsList(data)
    }
  }


  async function handleLogout(){
    await AuthSignOut()
  }

  return(
    <>
      <Head>
        <title>BarberPro - Cortes</title>
      </Head>
      
      <Sidebar>
        <Flex direction='column' alignItems='flex-start' justifyContent='flex-start'>
          <Flex 
            w='100%' 
            direction={isMobile? 'column' : 'row'} 
            alignItems={isMobile? 'flex-start' : 'center'} 
            justifyContent='flex-start'
          >
            <Heading 
              fontSize={isMobile? '2xl' : '4xl'} 
              mt={4} 
              mb={4} 
              mr={4} 
              color='orange.900'
            >
              MODELOS DE CORTES
            </Heading>

            <Link href='/haircuts/new'>
              <Button
                fontWeight='bold'
                bg='gray.600'
                color='white'
                _hover={{ bg: 'gray.500', color: 'black' }}
              >
                Cadastrar Corte
              </Button>
            </Link>

            <Stack
              ml='auto'
              align='center'
              direction='row'
            >
              <Text fontWeight='bold' color='white'>ATIVOS</Text>
              <Switch 
                colorScheme='green'
                size='lg'
                value={haircutsStatusSwitch}
                onChange={ e => handleSwitchChange(e) }
                isChecked={haircutsStatusSwitch === 'disabled' ? false : true }
              />
            </Stack>
          </Flex>

          {haircutsList.map( haircut => (
            <Link key={haircut.id} w='100%' href={`/haircuts/${haircut.id}`}>
              <Flex
                minWidth='max-content'
                w='100%'
                cursor='pointer'
                p={4}
                bg='barber.400'
                direction='row'
                rounded='4'
                mb={2}
                mt={2}
                justifyContent='space-between'
              >
                <Flex direction='row' alignItems='center' justifyContent='center'>
                  <IoMdPricetag size={28} color='#fba931'/>
                  <Text color='white' fontWeight='bold' ml={4} noOfLines={1}>
                    {haircut.name}
                  </Text>
                </Flex>

                <Text fontWeight='bold' color='white'>
                  Preço: R$ {haircut.price}
                </Text>
              </Flex>
            </Link>
 
          ))}

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