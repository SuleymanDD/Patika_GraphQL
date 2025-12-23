import React, { useEffect } from 'react';
import { Button, List, message } from 'antd';
import { FormOutlined } from '@ant-design/icons';
import VirtualList from 'rc-virtual-list';
import styles from "./styles.module.css";
import { useQuery } from "@apollo/client/react";
import { EVENTS_SUBSCRIPTION, GET_EVENTS } from './queries';
import Loading from 'components/Loading';
import { Link, useLocation } from "react-router-dom"


function Home() {
    const { loading, error, data, subscribeToMore } = useQuery(GET_EVENTS);

    const [messageApi, contextHolder] = message.useMessage();
    const location = useLocation();
    const { state } = location;


    useEffect(() => {
        subscribeToMore({
            document: EVENTS_SUBSCRIPTION,
            updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data) return prev;

                return {
                    events: [subscriptionData.data.eventCreated, ...prev.events],
                };
            },
        });
    }, [subscribeToMore]);

    useEffect(() => {
        if (state?.showSuccess) {
            setTimeout(() => {
                messageApi.open({type: "success",content: "Event Created!",duration: 4,});
                window.history.replaceState({}, document.title, window.location.pathname);
            }, 100); 
        }
    }, [state, messageApi]);


    if (loading) {
        return <Loading />
    }
    if (error) {
        return `Error: ${error} Hata bu la gardaş`
    }

    return (
        <>
            {contextHolder}

            <List>
                <h1 className={styles.header}>
                    <div className={styles.balanceSpacer}></div>
                    <span className={styles.titleText}>Event Sync</span>
                    <Button href='/createEvent' className={styles.createButton}><FormOutlined /></Button>
                </h1>
                <VirtualList
                    data={data.events}
                    height={400}
                >
                    {item => (
                        <List.Item>
                            <List.Item.Meta
                                title={<Link to={`event/${item.id}`}>{item.title}</Link>}
                                description={<Link to={`event/${item.id}`}>{item.desc}</Link>}
                            />
                            <div className={styles.dateDiv}>{item.date}</div>
                        </List.Item>
                    )}
                </VirtualList>
            </List>

        </>
    );
}

export default Home