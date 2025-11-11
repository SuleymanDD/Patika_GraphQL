import React, { useEffect } from "react";
import { Divider, Button } from "antd"
import styles from "./styles.module.css"
import { useLazyQuery } from "@apollo/client/react";
import { COMMENT_SUBSCRIPTION, GET_POST_COMMENTS } from "./queries"
import { Avatar, List } from 'antd';

let comment_datas = "";
let btnIsVisible=true;
function Comments({ post_id }) {
    const [loadComments, { loading, called, subscribeToMore}] = useLazyQuery(GET_POST_COMMENTS);
    
    useEffect(() => {
        btnIsVisible=true;
    },[post_id]);

    useEffect(() => {
        if(!loading && called){
            subscribeToMore({
                document: COMMENT_SUBSCRIPTION,
                updateQuery: (prev, {subscriptionData}) => {
                    if(!subscriptionData.data) return prev;

                    const newCommentItem = subscriptionData.data.commentCreated;

                    return {
                        post:{
                            ...prev.post,
                            comments: [...prev.post.comments, newCommentItem]
                        }
                    }
                }
            })
        }
    },[loading, called, subscribeToMore]);

    return (
        <>
            <Divider>Comments</Divider>
            {btnIsVisible && (
                <div className={styles.showCommentsBtnContainer}>
                    <Button loading={loading} onClick={async() => {
                        comment_datas = await loadComments({ variables: { id: post_id } }) //loadComments asenkron bir fonk bu yüzden bizim veriyi bekleyipte kullanmamız gerekiyor
                        btnIsVisible=false;
                    }}>
                        Show Comments
                    </Button>
                </div>
            )}

            {!loading && comment_datas && !btnIsVisible &&
                <List
                    itemLayout="horizontal"
                    dataSource={comment_datas.data.post.comments}
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
            }
        </>
    );
}
export default Comments