import React from 'react';
import { List } from 'antd';
import VirtualList from 'rc-virtual-list';
import styles from "./styles.module.css";
import { useQuery } from "@apollo/client/react";
import { GET_EVENTS } from './queries';
import Loading from 'components/Loading';
import {Link} from "react-router-dom"


function Home() {
    const {loading, error, data} = useQuery(GET_EVENTS);

    if(loading){
        return <Loading/>
    }
    if(error){
        return `Error: ${error} Hata bu la gardaş`
    }

    return (
        <List>
            <h1 className={styles.header}>Event Sync</h1>
            <VirtualList 
                data={data.events}
                height={400}
                loading={false}
            >
                {item => (
                    <List.Item key={item.desc} >
                        <List.Item.Meta
                            title={<Link to={`event/${item.id}`}>{item.title}</Link>}
                            description={<Link to={`event/${item.id}`}>{item.desc}</Link>}
                        />
                        <div className={styles.dateDiv}>{item.date}</div>
                    </List.Item>
                )}
            </VirtualList>
        </List>
    );
}

export default Home