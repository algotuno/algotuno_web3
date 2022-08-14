import React from 'react';
import {Container, Box, Flex, Heading, Text} from 'theme-ui';
import tf_logo from '../../public/images/tf_logo.png';
import sci_kit_learn from '../../public/images/sci_kit_learn.png';
import Image from 'next/image';


const image_url = 'images/bg_img/bg_2.jpg';

const WHY_CHOOSE_DATA = {
    blockTitle: {
        title: 'Our Technology',
        text: '',
    },
    posts: [
        {
            image: tf_logo,
            title: 'Tensorflow + Javascript',
            text: 'Using deep learning with neural networks. to be implemented to markets with rather stable volatility.',
        },
        {
            image: sci_kit_learn,
            title: 'Si kit Learn + Python',
            text: 'Using random forest. to be implemented to markets with rather unstable / unpredictable volatility.',
        },
    ],
};

const OurTech = () => {
    const {blockTitle, posts} = WHY_CHOOSE_DATA;
    return (
        <Box as="section" id="services" sx={styles.section} style={styles.bg_image}>
            {/* //@ts-ignore */}
            <Container sx={styles.container}>
                <Box sx={styles.blockTitle}>

                    <Heading as="h2">{blockTitle.title}</Heading>
                    <Text as="p">{blockTitle.text}</Text>
                </Box>
                <Flex sx={styles.row}>
                    {posts.map(({image, text, title}, index) => (
                        <Box key={`${index}`} sx={styles.post}>
                            <Box sx={styles.imageWrap}>
                                <Image src={image} alt="icon image"/>
                            </Box>

                            <Heading as="h3">{title}</Heading>
                            <Text as="p">{text}</Text>
                        </Box>
                    ))}
                </Flex>
            </Container>
        </Box>
    );
};

export default OurTech;


const styles = {
    section: {
        paddingTop: "2em",
        paddingBottom: "3em",
    },
    bg_image: {
        opacity: "0.8",
        background: "linear-gradient(to right, #bdc5d1, #b3d0db, #addad8, #b8e2c9, #d7e5b7);",
        boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px"
    },
    container: {
        position: "relative",

    },
    blockTitle: {
        textAlign: 'center',
        marginBottom: "3em",
        h2: {
            fontSize: ['26px', null, '30px', '36px'],
            lineHeight: [1.35],
            color: 'heading',
            fontWeight: 'body',
        },
        p: {
            fontSize: ['15px', null, '16px'],
            lineHeight: 1.85,
            color: 'white',
        },
    },
    row: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 0,
    },
    post: {
        mb: ['32px', null, null, null, 0],
        flex: ['0 0 100%', null, '0 0 50%', null, '0 0 25%'],
        textAlign: 'center',
        h3: {
            fontSize: ['18px', null, null, null, null, '20px'],
            lineHeight: 1.45,
            letterSpacing: '-0.5px',
            fontWeight: '500',
            color: '#02073E',
            mt: ['18px', '20px', null, null, '25px', '30px', null, '40px'],
            mb: ['10px', '15px', null, null, null, '20px'],
        },
        p: {
            maxWidth: '266px',
            mx: 'auto',
            color: '#02073E',
            fontSize: ['14px', '15px'],
            lineHeight: 2,
            px: [null, null, null, null, '5px', 0],
        },
    },
    imageWrap: {
        display: 'flex',
        minHeight: ['auto', '100px'],
        alignItems: 'center',
        justifyContent: 'center',
        img: {
            width: ['80px', null, null, null, 'auto'],
        },
    },
};
