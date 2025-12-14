import { useRef } from 'react'
import { Form, Input, Button, Select, message, Col, Row } from "antd";
import { useQuery, useMutation } from '@apollo/client/react';
import styles from './styles.module.css';
import { GET_USERS, NEW_COMMENT_MUTIATION } from './queries';
import { GET_POST_COMMENTS } from '../queries';

const { Option } = Select;

function NewCommentForm({ post_id }) {
    const { loading: get_users_loading, data: users_data } = useQuery(GET_USERS);
    const [saveComment, { loading }] = useMutation(NEW_COMMENT_MUTIATION, {refetchQueries:[{ query: GET_POST_COMMENTS, variables: {id: post_id}}]});

    const [messageApi, contextHolder] = message.useMessage();
    const formRef = useRef();

    const handleSubmit = async (values) => {
        try {
            await saveComment({
                variables: {
                    data: { ...values, post_id }
                }
            });
            messageApi.open({ type: 'success', content: 'Comment Created!', duration: 3 });
            formRef.current.resetFields();
        } catch (error) {
            messageApi.open({ type: 'error', content: 'Comment Not Created!', duration: 5 });
        }
    }

    return (
        <>
            {contextHolder}

            <Form
                name='basic'
                onFinish={handleSubmit}
                autoComplete='off'
                ref={formRef}
            >
                <Row gutter={24}>
                    <Col span={9}>
                        <Form.Item
                            name="user_id"
                            rules={[{ required: true, message: "Please select a user!" }]}
                        >
                            <Select disabled={get_users_loading || loading} loading={get_users_loading} placeholder="Select A User">
                                {users_data && users_data.users.map((item) => <Option key={item.id} value={item.id}>{item.fullName}</Option>)}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={13}>
                        <Form.Item
                            name="text"
                            rules={[{ required: true, message: "Please type your text!" }]}
                        >
                            <Input disabled={loading} size='medium' placeholder='Message' />
                        </Form.Item>
                    </Col>
                    <Col span={2}>
                        <Form.Item className={styles.buttons}>
                            <Button loading={loading} type='primary' htmlType='submit'>
                                {">"}
                            </Button>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </>
    )
}

export default NewCommentForm