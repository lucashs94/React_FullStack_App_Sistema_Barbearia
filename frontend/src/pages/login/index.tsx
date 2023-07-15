import React, { useState } from 'react'
import Head from 'next/head'
import Image from 'next/image';
import Link from 'next/link';
import { Button, Center, Flex, Input, Text } from '@chakra-ui/react'

import { canSSRGuest } from '@/utils/canSSRGuest';
import useAuthContext from '@/contexts/AuthContext';
import logoImg from "../../../public/images/logo.svg";


export default function Login(){

  const { AuthSignIn } = useAuthContext()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')


  async function handleLogin(){

    if(email === '' || password === '') return

    await AuthSignIn({ email, password })
  }
 

  return(
    <>
      <Head>
        <title>BarberPro - Login</title>
      </Head>
      
      <Flex
        background='barber.900'
        height='100vh'
        alignItems='center'
        justifyContent='center'
      >

        <Flex
          width={540}
          direction='column'
          p={14}
          rounded={8}
          color='white'
        >
          <Center p={4}>
            <Image 
              src={logoImg}
              alt='logo barberpro'
              width={340}
              quality={100}
              objectFit='fill'
            />
          </Center>

          <Input   
            value={email}
            onChange={ (e) => setEmail(e.target.value) }
            background='barber.400'
            variant='outline'
            size='lg' 
            placeholder='email@email.com'
            type='email'
            mb={3}
            color='button.default'
          />

          <Input   
            value={password}
            onChange={ (e) => setPassword(e.target.value) }
            background='barber.400'
            variant='outline'
            size='lg' 
            placeholder='********'
            type='password'
            mb={6}
            color='button.default'
          />

          <Button
            onClick={ handleLogin }
            background='button.cta'
            mb={6}
            color='gray.900'
            size='lg'
            _hover={{ bg: '#ffb13e' }}
          >
            Acessar
          </Button>

          <Center color='button.default' mt={8}>
            <Link href='/register'>
              <Text cursor='pointer'>Ainda não possui uma conta? <strong>Cadastre-se</strong></Text>
            </Link>
          </Center>

        </Flex>

      </Flex>
    </>
  )
}

export const getServerSideProps = canSSRGuest( async (ctx) => {
  
  return{
    props:{}
  }
})