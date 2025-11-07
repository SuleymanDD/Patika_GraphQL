import { Avatar, Badge } from "antd";
import styles from "./styles.module.css";
import { useSubscription } from "@apollo/client/react";
import { POST_COUNT_SUBSCRIPTION } from "./queries";

function PostCounter(){
    const { data } = useSubscription(POST_COUNT_SUBSCRIPTION);

    return(
        <div className={styles.container}>
            <Badge count={data ? data.postCount : "?"} size="small">
                <Avatar shape="square" size="medium">
                    <span className={styles.counterTitle}>Posts</span>
                </Avatar>
            </Badge>
        </div>
    );
}

export default PostCounter