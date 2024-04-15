import { BoxProps, FlexProps, StackProps } from "@chakra-ui/react";

export const navbarStyles: BoxProps = {
    pos: "fixed" ,  
    w: "100%" , 
    bgColor: "white" , 
    mb: "irem", 
    zIndex: 10
}

export const desktopNavStyles: FlexProps ={
    justify: "space-between",
    align: "center",
    px: "2rem",
    py: "1rem",
    borderBottomWidth: "1px",
    borderColor: "gray-200",
    display: {base: 'none', lg: 'flex'}
}

export const logoSectionStyles: StackProps = {
    direction: "row",
    gap: 6,
    flex: 1,
    alignItems: 'center'
}

export const cartSectionStyles: StackProps={
    direction: 'row',
    spacing: 2
}
export const mobileNavContainerStyles: FlexProps ={
    justify: 'space-between',
    align: "center",
    px: '2em',
    py: '1em',
    borderBottom: '1px',
    borderColor: 'gray.200',
    display: {base: 'flex', lg: 'none'}
}
export const mobileSearchWrapper: BoxProps={
    px:"2em",
    py:"0.5rem", 
    display:{base: 'block', lg: 'none'}
}