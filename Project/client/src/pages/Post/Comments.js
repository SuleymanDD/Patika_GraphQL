import React, { useEffect } from "react";
import { Divider, Button } from "antd"
import styles from "./styles.module.css"
import { useLazyQuery } from "@apollo/client/react";
import { GET_POST_COMMENTS } from "./queries"
import { Avatar, List } from 'antd';

let comment_datas = "";
let btnIsVisible=true;
function Comments({ post_id }) {
    const [loadComments, { loading }] = useLazyQuery(GET_POST_COMMENTS);
    
    useEffect(() => {
        btnIsVisible=true;
    },[post_id]);

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