import React from 'react';
import { Form, Input, Button, Select} from "antd";

const { Option } = Select;

function NewPostForm() {
  return (
    <Form
        name='basic'
        initialValues={{ remember: true}}
        autoComplete='off'
    >
        <Form.Item
            name="title"
            rules={[{required: true, message: "Please type your title!"}]}
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
            rules={[{required: true, message: "Please select a user!"}]}
        >
            <Select placeholder="Select A User">
                <Option value="male">Male</Option>
                <Option value="male">Male</Option>
                <Option value="male">Male</Option>
            </Select>
        </Form.Item>

        <Form.Item>
            <Button type='primary' htmlType='submit'>
                Submit
            </Button>
        </Form.Item>
    </Form>
  )
}

export default NewPostForm