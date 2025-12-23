import React from 'react'
import { Form, Input, Button, Select, Typography, message, DatePicker } from "antd";
import { useNavigate } from "react-router-dom"
import { useMutation, useQuery } from '@apollo/client/react';
import { EVENT_MUTIATION, GET_LOCATIONS, GET_USERS } from './queries';
import styles from "./styles.module.css";
import { GET_EVENTS } from 'pages/Home/queries';

const { Option } = Select;
const { Title } = Typography;

function NewEvent() {
    const { data: locations_data, loading: get_loaction_loading } = useQuery(GET_LOCATIONS);
    const { data: users_data, loading: get_user_loading } = useQuery(GET_USERS);
    const [saveEvent, { loading }] = useMutation(EVENT_MUTIATION, {refetchQueries: [{ query: GET_EVENTS },],});

    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate();

    let dateData;
    const onChange = (date,dateString) => {
        dateData = dateString;
    };
    
    const handleSubmit = async(values) =>{
        try {
            values.date = dateData
            await saveEvent({
                variables: {
                    data: values,
                }
            })
            navigate("/", { state: { showSuccess: true } });
        } catch (error) {
            messageApi.open({type: "error", content: "Event Not Created", duration: 4});
        }
    };

    return (
        <>
            <Title level={3}>New Event</Title>
            
            {contextHolder}

            <Form
                name='basic'
                onFinish={handleSubmit}
                autoComplete='off'
            >
                <Form.Item
                    name="title"
                    rules={[{ required: true, message: "Please type your title!" }]}
                >
                    <Input disabled={loading} size='medium' placeholder='Title' />
                </Form.Item>

                <Form.Item
                    name="desc"
                >
                    <Input disabled={loading} size='medium' placeholder='Description' />
                </Form.Item>

                <Form.Item
                    name="location_id"
                    rules={[{ required: true, message: "Please select a location!" }]}
                >
                    <Select disabled={get_loaction_loading || loading} loading={get_loaction_loading} placeholder="Select A Location">
                        {locations_data && locations_data.locations.map((item) => <Option key={item.id} value={item.id}>{item.name}</Option>)}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="user_id"
                    rules={[{ required: true, message: "Please select a user!" }]}
                >
                    <Select disabled={get_user_loading || loading} loading={get_user_loading} placeholder="Select A User">
                        {users_data && users_data.users.map((item) => <Option key={item.id} value={item.id}>{item.username}</Option>)}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="date"
                    rules={[{ required: true, message: "Please select a date!" }]}
                >
                    <DatePicker disabled={loading} onChange={onChange} picker='date' format={"DD.MM.YYYY"} />
                </Form.Item>

                <Form.Item className={styles.buttons}>
                    <Button loading={loading} type='primary' htmlType='submit'>
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </>
    )
}

export default NewEvent