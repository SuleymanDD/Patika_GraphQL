import React from 'react';
import { Form, Input, Button, Select, message } from "antd";
import { useQuery, useMutation } from '@apollo/client/react';
import { GET_USERS, NEW_POST_MUTIATION } from './queries';
import { GET_POSTS } from 'pages/Home/queries';
import styles from './styles.module.css';
import {useNavigate} from "react-router-dom"

const { Option } = Select;

function NewPostForm() {
    const { loading: get_users_loading, data: users_data } = useQuery(GET_USERS);
    const [savePost, { loading }] = useMutation(NEW_POST_MUTIATION, {refetchQueries: [{ query: GET_POSTS },],}); // refetchQueries kullanarak cachedeki post verilerini güncelledik

    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate();

    const handleSubmit = async (values) => {
        try {
            await savePost({
                variables: {
                    data: values,
                }
            });
            navigate("/", {state: {showSuccess: true}});
        } catch (error) {
            messageApi.open({ type: 'error', content: 'Post Not Created!', duration: 5});
        }
    }

    return (
        <>

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
                name="short_description"
            >
                <Input disabled={loading} size='medium' placeholder='Short description' />
            </Form.Item>

            <Form.Item
                name="description"
            >
                <Input.TextArea disabled={loading} size='large' placeholder='Description' />
            </Form.Item>

            <Form.Item
                name="cover"
            >
                <Input disabled={loading} size='medium' placeholder='Cover' />
            </Form.Item>

            <Form.Item
                name="user"
                rules={[{ required: true, message: "Please select a user!" }]}
            >
                <Select disabled={get_users_loading || loading} loading={get_users_loading} placeholder="Select A User">
                    {users_data && users_data.users.map((item) => <Option key={item._id} value={item._id}>{item.fullName}</Option>)}
                </Select>
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

export default NewPostForm