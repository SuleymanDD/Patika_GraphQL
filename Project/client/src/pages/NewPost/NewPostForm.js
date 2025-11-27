import React from 'react';
import { Form, Input, Button, Select } from "antd";
import { useQuery } from '@apollo/client/react';
import { GET_USERS } from './queries';
import styles from './styles.module.css';

const { Option } = Select;

function NewPostForm() {

    const { loading: get_users_loading, data: users_data } = useQuery(GET_USERS);

    return (
        <Form
            name='basic'
            initialValues={{ remember: true }}
            autoComplete='off'
        >
            <Form.Item
                name="title"
                rules={[{ required: true, message: "Please type your title!" }]}
            >
                <Input size='medium' placeholder='Title' />
            </Form.Item>

            <Form.Item
                name="shortDescription"
            >
                <Input size='medium' placeholder='Short description' />
            </Form.Item>

            <Form.Item
                name="description"
            >
                <Input.TextArea size='large' placeholder='Description' />
            </Form.Item>

            <Form.Item
                name="cover"
            >
                <Input size='medium' placeholder='Cover' />
            </Form.Item>

            <Form.Item
                name="user"
                rules={[{ required: true, message: "Please select a user!" }]}
            >
                <Select disabled={get_users_loading} loading={get_users_loading} placeholder="Select A User">
                    {users_data && users_data.users.map((item) => <Option key={item.id} value={item.id}>{item.fullName}</Option>)}
                </Select>
            </Form.Item>

            <Form.Item className={styles.buttons}>
                <Button type='primary' htmlType='submit'>
                    Submit
                </Button>
            </Form.Item>
        </Form>
    )
}

export default NewPostForm