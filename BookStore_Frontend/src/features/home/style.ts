import { FlexProps, HeadingProps, TextProps } from "@chakra-ui/react";

export const bannerStyles: FlexProps={
    justify:"center",
    align:"center",
    gap :"2",
    flexDir:{base: 'column', lg:'row'},
    w:{base:'100px', lg:'90%'} ,
    mx:"auto" ,
    p:"2rem"
}

export const bannerHeadingStyles: HeadingProps={
    size: {base:'xl', lg:'3xl'},
    lineHeight:"4rem",
    color:"brand.primary"
}

export const bannerTextStyles: TextProps={
    fontSize:{base:'md', lg:'lg'},
    py:"1rem",
    maxW:"600px"
}

