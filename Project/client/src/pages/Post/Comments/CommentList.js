import React, { useEffect, useState } from "react";
import { Divider, Button, Avatar, List } from "antd";
import styles from "../styles.module.css";
import { useLazyQuery } from "@apollo/client/react";
import { COMMENT_SUBSCRIPTION, GET_POST_COMMENTS } from "../queries";
import NewCommentForm from "./NewCommentForm";

// Show Comments button'un görünürlülüğü ile ilgili bir sayaçtır.
let sayac = 0
function CommentList({ postId }) {
    const [isLoaded, setIsLoaded] = useState(false);

    const [loadComments, { data, loading, subscribeToMore, called }] = useLazyQuery(GET_POST_COMMENTS);

    const commentsData = data?.post?.comments || [];

    useEffect(() => {
        sayac++;
        if (sayac === 1) {
            setIsLoaded(false); // Sayfa refreshlendiğinde ve ilk girildiğinde button'u görünür kılar.
        } else if (sayac === 2) {
            loadComments({ variables: { id: postId } }); // Button'a basıldığında bir hatadan dolayı tekrardan loadcomments'in çağrılması geremkmektedir.
            setIsLoaded(true); // Ve button gizlenir.
        } else if (sayac === 3) {
            sayac = 1; // Bir sayfa açıldıktan sonra başka bir sayfaya geçildiğnde "sayac"'ın resetlenmesi durumudur.
        }
    }, [postId]);


    useEffect(() => {
        if (called && !loading) {
            subscribeToMore({
                document: COMMENT_SUBSCRIPTION,
                variables: { post_id: postId },
                updateQuery: (prev, { subscriptionData }) => {
                    if (!subscriptionData.data) return prev;

                    const newCommentItem = subscriptionData.data.commentCreated;

                    return {
                        ...prev,
                        post: {
                            ...prev.post,
                            comments: [...prev.post.comments, newCommentItem],
                        }
                    };
                }
            });
        }
    }, [loading, called, subscribeToMore, postId]);

    const handleShowComments = () => {
        loadComments({ variables: { id: postId } });
        setIsLoaded(true);
    };

    const btnIsVisible = !isLoaded;

    return (
        <>
            <Divider>Comments</Divider>
            {btnIsVisible && (
                <div className={styles.showCommentsBtnContainer}>
                    <Button loading={loading} onClick={handleShowComments}>
                        Show Comments
                    </Button>
                </div>
            )}


            {isLoaded && !loading && commentsData.length > 0 &&
                <>
                    <List
                        itemLayout="horizontal"
                        dataSource={commentsData}
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
                    <NewCommentForm post_id={postId}/>
                </>
            }
        </>
    );
}

export default CommentList;