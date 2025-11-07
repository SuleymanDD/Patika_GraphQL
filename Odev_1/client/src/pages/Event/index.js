import React from "react";
import { useQuery } from "@apollo/client/react";
import { useParams } from "react-router-dom";
import { GET_EVENT } from "./queries";
import Loading from "components/Loading";
import { Typography, Image, Tag } from 'antd';
import styles from "./styles.module.css"

const { Title } = Typography;
const colors = ["red", "magenta", "volcano", "orange", "gold", "lime", "green", "cyan", "blue", "geekblue", "purple"];

function Event() {
    const id = useParams();

    const { loading, data, error } = useQuery(GET_EVENT, { variables: id })

    if (loading) {
        return <Loading />
    }
    if (error) {
        return `Error: ${error} Hata bu la gardaş`
    }

    const { event } = data

    const renderLocationTag = () => {
        if (event.participants.length > 0) {
            return event.participants.map((participant, index) => {

                const colorIndex = Math.floor(Math.random() * colors.length);
                const tagColor = colors[colorIndex];

                return (
                    <Tag
                        key={index} 
                        color={tagColor}
                    >
                        {participant.user.username}
                    </Tag>
                );
            });
        }
        return null;
    };

    return (
        <div>
            <div className={styles.imageDiv}>
                <Image src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png" />
            </div>
            <div className={styles.titleDiv}>
                <Title level={3}>{event.title}</Title>
                <Title level={3}>by {event.user.username}</Title>
            </div>
            <div>{event.desc}</div>
            <div><Tag className={styles.tag}>{event.location.name}</Tag></div>
            <div>{renderLocationTag()}</div>

        </div>
    );
}

export default Event