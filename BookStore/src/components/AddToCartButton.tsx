import { Button } from "@chakra-ui/react"


export const AddToCartButton = () => {
    return(
        <Button 
        variant="outline" 
        borderColor="brand.primary" 
        color="brand.primary" 
        rounded="full" 
        size="sm" 
        w="130px" >
            AddToCart
        </Button>
    )
}