import React from "react";
import { Box } from "@chakra-ui/react";
import { AvatarBox } from "./AvatarBox";
import { Logo } from "./Logo";
import { Navigation } from "./Navigation";
import { SwitchButtons } from "./SwitchButtons";


interface ICollapseProps{
  collapse : boolean
} 

export const Sidebar = ({collapse}:ICollapseProps) => {
  return (
    <React.Fragment>
      <Box w="full">
        <Logo collapse={collapse} />
        <SwitchButtons collapse={collapse} />
        <Navigation collapse={collapse} />
      </Box>
      <AvatarBox collapse={collapse} />
    </React.Fragment>
  )
};
