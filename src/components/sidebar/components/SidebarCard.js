import {
  // Button,
  Flex,
  Image,
  // Link,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import logoWhite from 'assets/img/layout/logoWhite.png';
import React from 'react';

export default function SidebarDocs() {
  const bgColor = 'linear-gradient(135deg,rgb(127, 238, 147) 0%, #045e14 100%)';
  const borderColor = useColorModeValue('white', 'navy.800');

  return (
    <Flex
      justify="center"
      direction="column"
      align="center"
      bg={bgColor}
      borderRadius="30px"
      position="relative"
    >
      <Flex
        border="5px solid"
        borderColor={borderColor}
        bg="linear-gradient(135deg,rgb(127, 238, 147) 0%, #045e14 100%)"
        borderRadius="50%"
        w="94px"
        h="94px"
        align="center"
        justify="center"
        mx="auto"
        position="absolute"
        left="50%"
        top="-47px"
        transform="translate(-50%, 0%)"
      >
        <Image src={logoWhite} w="40px" h="40px" />
      </Flex>
      <Flex
        direction="column"
        mb="12px"
        align="center"
        justify="center"
        px="15px"
        pt="55px"
      >
        <Text
          fontSize={{ base: 'lg', xl: '18px' }}
          color="white"
          fontWeight="bold"
          lineHeight="150%"
          textAlign="center"
          px="10px"
          mt="10px"
          mb="6px"
        >
          Welcome to Egale-FM
        </Text>
        <Text
          fontSize="14px"
          color={'white'}
          fontWeight="500"
          px="10px"
          mb="6px"
          textAlign="center"
        >
          Improve your experience with Egale-FM.
        </Text>
      </Flex>
    </Flex>
  );
}
