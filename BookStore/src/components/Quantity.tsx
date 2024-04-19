import { Button, HStack, Input, useNumberInput } from "@chakra-ui/react";

interface IQuantityProps {
    step?: number;
    defaultValue?: number;
    min?: number;
    max?: number;
    disabled?: boolean;
}

export const Quantity = ({
    step = 1,
    defaultValue = 1,
    min = 1,
    max = 20,
    disabled = false
}: IQuantityProps) => {
    const { getInputProps, getIncrementButtonProps, getDecrementButtonProps } =
        useNumberInput({
            step,
            defaultValue ,
            min,
            max,
        })

    const inc = getIncrementButtonProps()
    const dec = getDecrementButtonProps()
    const input = getInputProps()

    return (
        <HStack maxW='140px' my="0.5rem">
            <Button {...dec}>-</Button>
            <Input {...input} readOnly={true} min="52px" />
            <Button {...inc}>+</Button>
        </HStack>
    )
}