import React from "react";
import { useParams } from "react-router-dom"
import {GET_POST} from "./queries"
import { useQuery } from "@apollo/client/react";
import Loading from "components/Loading";
import styles from "./styles.module.css"
import Comments from "./Comments";

import { Typography, Image } from 'antd';
const { Title } = Typography;


function Post() {
    const { id } = useParams();

    const { loading, error, data } = useQuery(GET_POST,{
        variables: {
            id,
        },
    });

    if (loading) {
        return <Loading />
    }
    if (error) {
        return `Error: ${error} kes aw`
    }

    const { post } = data
    return (
        <div>
        <Title level={3}>{post.title}</Title>
        <Image src={post.cover}/>
        <div className={styles.description}>{post.description}</div>
        <Comments postId={id}/>
        </div>
    );
}

export default Post