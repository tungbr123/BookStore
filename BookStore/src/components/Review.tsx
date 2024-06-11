// components/Review.tsx
import { Box, Flex, Text, Avatar, Icon } from "@chakra-ui/react";
import { FaStar } from "react-icons/fa";
import { IReview } from '../model';

interface ReviewProps {
    review: IReview;
}

const Review: React.FC<ReviewProps> = ({ review }) => {
    const { name, stars, content, avatar } = review;

    return (
        <Box borderWidth="1px" borderRadius="lg" p={5} mb={4} shadow="md">
            <Flex alignItems="center" mb={2}>
                <Avatar name={name} src={avatar} mr={3} />
                <Box>
                    <Text fontWeight="bold">{name}</Text>
                    <Flex>
                        {Array(5).fill("").map((_, i) => (
                            <Icon
                                key={i}
                                as={FaStar}
                                color={i < stars ? "yellow.400" : "gray.300"}
                            />
                        ))}
                    </Flex>
                </Box>
            </Flex>
            <Text>{content}</Text>
        </Box>
    );
};

export default Review;
