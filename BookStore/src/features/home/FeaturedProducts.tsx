"use client"

import { ProductCard } from "@/components/ProductCard"
import { SectionHeading } from "@/components/SectionHeading"
import { SwiperNavButton } from "@/components/SwiperNavButton"
import { Box } from "@chakra-ui/react"
import { CSSProperties } from "react"
import { Autoplay, Navigation } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import { SwiperOptions } from "swiper/types"


const slideStyles: CSSProperties ={
    boxSizing: "border-box",
    maxWidth: "350px"
}

interface FeaturedProductsProp{
    title: string;
}

export const FeaturedProducts = ({title} : FeaturedProductsProp) => {
    const SwiperSettings: SwiperOptions = {
        modules: [Navigation, Autoplay],
        spaceBetween: 10,
        slidesPerView: 'auto',
        speed: 1000,
        autoplay:{
            delay: 5000,
            disableOnInteraction:   false
        }
      };
    return(
        <Box w={{base: '100%', lg:'90%'}} mx="auto" p="2rem">
            <SectionHeading title={title}/>
            <Swiper {...SwiperSettings} style={{width:'100%', height:'100%'}}>
                <SwiperSlide style={slideStyles}>
                    <ProductCard />
                </SwiperSlide>

                <SwiperSlide style={slideStyles}>
                    <ProductCard />
                </SwiperSlide>
                
                <SwiperSlide style={slideStyles}>
                    <ProductCard />
                </SwiperSlide>

                <SwiperSlide style={slideStyles}>
                    <ProductCard />
                </SwiperSlide>

                <SwiperSlide style={slideStyles}>
                    <ProductCard />
                </SwiperSlide>

                <SwiperNavButton />
            </Swiper>
        </Box>
    )
}