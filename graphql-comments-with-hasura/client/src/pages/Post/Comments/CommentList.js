import React from "react";
import { Divider, Avatar, List } from "antd";
import { useSubscription } from "@apollo/client/react";
import { COMMENTS_SUBSCRIPTION } from "../queries";
import NewCommentForm from "./NewCommentForm";
import Loading from "components/Loading";

function CommentList({ post_id }) {

    const { loading, error, data } = useSubscription(COMMENTS_SUBSCRIPTION, {
            variables: {post_id},
    });

    if (loading) {
        return <Loading />
    }
    
    if (error) {
        return `Error: ${error} kes aw`
    }

    return (
        <>
            <Divider>Comments</Divider>
            { !loading &&
                <>
                    <List
                        itemLayout="horizontal"
                        dataSource={data.comments}
                        renderItem={(item) => (
                            <List.Item>
                                <List.Item.Meta
                                    avatar={<Avatar src={item.user.profile_photo} />}
                                    title={<div>{item.user.fullName}</div>}
                                    description={item.text}
                                />
                            </List.Item>
                        )}
                    />
                    <Divider>New Comment</Divider>
                    <NewCommentForm post_id={post_id} />
                </>
            }
        </>
    );
}

export default CommentList;