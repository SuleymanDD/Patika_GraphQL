import React from "react";
import { useParams } from "react-router-dom"
import {GET_POST} from "./queries"
import { useQuery } from "@apollo/client/react";
import Loading from "components/Loading";
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
        <div>{post.description}</div>
        </div>
    );
}

export default Post