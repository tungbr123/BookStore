import Link from "next/link";
import {
  ListIcon,
  Link as LinkChakra,
  Heading,
  Box,
  Badge,
  Text,
} from "@chakra-ui/react";
import React from "react";
import internal from "stream";
import { IconType } from "react-icons/lib";

interface ICollapseProps{
  collapse : boolean,
  isActive: boolean,
  item: {
    type: string;
    label: string;
    icon: IconType 
    path: string 
}
} 


export const NavItem = ({ item, isActive, collapse }: ICollapseProps) => {
  const { label } = item; 

  if (item.type === "link") {
    const { icon } = item;
    return (
      <Box display="flex" alignItems="center" my={6} justifyContent="center">
        <LinkChakra
          href=""
          as={Link}
          gap={1}
          display="flex"
          alignItems="center"
          _hover={{ textDecoration: "none", color: "black" }}
          fontWeight="medium"
          color={isActive ? "black" : "gray.400"}
          w="full"
          justifyContent={!collapse ? "center" : ""}
        >
          <ListIcon as={icon} fontSize={22} m="0" />
          {collapse && <Text>{label}</Text>}
        </LinkChakra>
        {/* {collapse && (
          <React.Fragment>
            {notifications && (
              <Badge
                borderRadius="full"
                colorScheme="yellow"
                w={6}
                textAlign="center"
              >
                {notifications}
              </Badge>
            )}
            {messages && (
              <Badge
                borderRadius="full"
                colorScheme="green"
                w={6}
                textAlign="center"
              >
                {messages}
              </Badge>
            )}
          </React.Fragment> */}
        {/* )} */}
      </Box>
    );
  }
  return (
    <Heading
      color="gray.400"
      fontWeight="medium"
      textTransform="uppercase"
      fontSize="sm"
      borderTopWidth={1}
      borderColor="gray.100"
      pt={collapse ? 8 : 0}
      my={6}
    >
      <Text display={collapse ? "flex" : "none"}>{label}</Text>
    </Heading>
  );
};
