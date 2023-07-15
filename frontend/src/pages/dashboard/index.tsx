import React, { useState } from 'react'
import Head from 'next/head'
import { Button, Flex, Heading, Link, Text, useDisclosure, useMediaQuery } from '@chakra-ui/react'
import { IoMdPerson } from 'react-icons/io'

import { canSSRAuth } from '@/utils/canSSRAuth';
import { Sidebar } from '@/components/sidebar';
import { apiClient } from '@/services/api';
import { ModalInfo } from '@/components/modal';


interface HaircutProps{
  id: string
  name: string
  price: number | string
  status: boolean
  userId: string
}

export interface ScheduleProps{
  id: string
  customer: string
  haircut: HaircutProps
}

interface SchedulesListProps{
  schedules: ScheduleProps[]
}

export default function Dashboard({ schedules }: SchedulesListProps){

  const [isMobile] = useMediaQuery('(max-width: 500px)')

  const [schedule, setSchedule] = useState(schedules)
  const [service, setService] = useState<ScheduleProps>()

  const { isOpen, onClose, onOpen } = useDisclosure()


  function handleOpenModal(item: ScheduleProps){
    setService(item)
    onOpen()
  }

  async function handleFinish(id: string){
    try {
      const api = apiClient()

      await api.put('/schedule', {}, { params:{ schedule_id: id } })

      const filterItem = schedule.filter( item => item.id !== id)
      setSchedule(filterItem)
      onClose()

    } catch (error) {
      console.log(error)
      onClose()
    }
    
  }

  return(
    <>
      <Head>
        <title>BarberPro - Dashboard</title>
      </Head>
      
      <Sidebar>
        <Flex direction='column' align='flex-start' justify='flex-start' color='white'>
          
          <Flex w='100%' direction='row' align='center' justify='flex-start'>
            <Heading fontSize='4xl' mt={4} mb={4} mr={4} color='orange.900'>
              AGENDA
            </Heading>

            <Link href='/new'>
              <Button
                fontWeight='bold'
                bg='gray.600'
                color='white'
                _hover={{ bg: 'gray.500', color: 'black' }}
              >
                Registrar
              </Button>
            </Link>
          </Flex>

          {schedule.map( item => (
            <Link
              key={item.id}
              w='100%'
              m={0}
              p={0}
              mt={1}
              bg='transparent'
              style={{ textDecoration: 'none' }}
              onClick={ () => handleOpenModal(item) }
            >
              <Flex
                w='100%'
                direction={isMobile ? 'column' : 'row'}
                p={4}
                pl={8}
                pr={12}
                rounded={4}
                mb={4}
                bg='barber.400'
                justify='space-between'
                align={isMobile ? 'flex-start' : 'center'}
              >
                <Flex direction='row' mb={isMobile ? 2 : 0} align='center' justify='center'>
                  <IoMdPerson size={28} color='orange'/>
                  <Text fontWeight='bold' ml={4} noOfLines={1}>
                    {item?.customer}
                  </Text>
                </Flex>

                <Text fontWeight='bold'>
                  {item?.haircut?.name}
                </Text>
                <Text fontWeight='bold'>
                  R$ {item?.haircut?.price}
                </Text>
              </Flex>
            </Link>
          ))}

        </Flex>
      </Sidebar>

      <ModalInfo 
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        data={service}
        finishService={ () => handleFinish(service?.id) }
      />
    </>
  )
}


export const getServerSideProps = canSSRAuth( async (ctx) => {

  try {
    const api = apiClient(ctx)

    const { data } = await api.get('/schedule')

    return{
      props:{
        schedules: data,
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