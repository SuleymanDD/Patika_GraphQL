import React from "react";

import { Avatar, List, Skeleton } from 'antd';

const data = [
  {
    "createdAt": "2025-04-26T19:13:38.338Z",
    "name": "Let go boizz",
    "avatar": "https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait/male/512/12.jpg",
    "gender": "female",
    "email": "youngboizzz@gmail.com",
    "city": "Lake Lorenzo",
    "birthdate": "1955-04-13T21:25:22.777Z",
    "id": "7",
    "address": "Lake Lorenzo"
  },
  {
    "createdAt": "2025-04-27T03:03:49.295Z",
    "name": "Israel Friesen",
    "avatar": "https://avatars.githubusercontent.com/u/63156927",
    "gender": "male",
    "email": "Lizeth_Hagenes@hotmail.com",
    "city": "Franeckitown",
    "birthdate": "1964-07-01T13:57:11.140Z",
    "id": "8"
  },
  {
    "createdAt": "2025-04-27T12:14:11.838Z",
    "name": "Terence Hilpert II",
    "avatar": "https://avatars.githubusercontent.com/u/25132279",
    "gender": "female",
    "email": "Alva_Tillman@gmail.com",
    "city": "North Aimee",
    "birthdate": "1979-01-14T21:17:21.365Z",
    "id": "9"
  },
]

function Home() {
    return (
        <div>
            <List
                className="demo-loadmore-list"
                loading={false}
                itemLayout="horizontal"
                //loadMore={loadMore}
                dataSource={data}
                renderItem={item => (
                    <List.Item>
                        <Skeleton avatar title={false} loading={item.loading} active>
                            <List.Item.Meta
                                avatar={<Avatar src={item.avatar} />}
                                title={<a href="https://ant.design">{item.name}</a>}
                                description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                            />
                        </Skeleton>
                    </List.Item>
                )}
            />
        </div>
    );
}

export default Home