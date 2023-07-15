import React from 'react'
import { 
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Flex,
  Text,
  Button
} from "@chakra-ui/react"

import { FiUser, FiScissors } from "react-icons/fi"
import { FaMoneyBillAlt } from "react-icons/fa"

import { ScheduleProps } from '@/pages/dashboard'


interface ModalInfoProps{
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
  data: ScheduleProps
  finishService: () => Promise<void>
}

export function ModalInfo({ isOpen, onOpen, onClose, data, finishService }: ModalInfoProps){
  return(
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent bg='barber.400' color='white'>
          <ModalHeader fontWeight='bold' fontSize='2xl' borderBottomColor='gray.700' borderBottomWidth={0.5}>Atendimento</ModalHeader>
          <ModalCloseButton mt={3} mr={2}/>

          <ModalBody mt={8} ml={3} mb={3}>

            <Flex align='center' mb={6}>
              <FiUser size={28} color='#ffb13e'/> 
              <Text ml={4} fontSize='2xl'fontWeight='bold'>{data?.customer}</Text>
            </Flex>

            <Flex align='center' mb={6}>
              <FiScissors size={28} color='#ffb13e'/> 
              <Text ml={4} fontSize='xl'>{data?.haircut?.name}</Text>
            </Flex>

            <Flex align='center' mb={6}>
              <FaMoneyBillAlt size={28} color='#46ef75'/> 
              <Text ml={4} fontSize='xl'>R$ {data?.haircut?.price}</Text>
            </Flex>

            <ModalFooter>
              <Button 
                bg='button.cta' 
                mr={-6} 
                _hover={{ bg: '#ffb13e'}}
                onClick={ () => finishService() }
              >
                Finalizar serviço
              </Button>
            </ModalFooter>

          </ModalBody>

        </ModalContent>
      </Modal>
    </>
  )
}