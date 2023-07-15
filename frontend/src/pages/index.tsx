import React, { useEffect } from 'react'
import Head from 'next/head'
import { Flex, Text } from '@chakra-ui/react'
import Router from 'next/router'

export default function Home(){


  useEffect(() => {
    Router.push('/dashboard')
  }, [])


  return(
    <>
      <Head>
        <title>BarberPro</title>
      </Head>
    </>
  )
}