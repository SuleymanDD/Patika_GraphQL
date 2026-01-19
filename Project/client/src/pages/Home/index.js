import {React, useEffect} from "react";
import { Avatar, List, message} from 'antd';
import { useQuery } from "@apollo/client/react";
import Loading from "components/Loading";
import {GET_POSTS, POSTS_SUBSCRIPTION} from "./queries"
import {Link, useLocation} from "react-router-dom"
import styles from "./styles.module.css"


function Home() {
  const { loading, error, data, subscribeToMore } = useQuery(GET_POSTS);

  const [messageApi, contextHolder] = message.useMessage();
  const location = useLocation();
  const { state } = location;

  useEffect(()=>{
    subscribeToMore({
      document: POSTS_SUBSCRIPTION,
      updateQuery: (prev, {subscriptionData}) => {
        if(!subscriptionData.data) return prev;

        return {
          posts: [subscriptionData.data.postCreated, ...prev.posts ],
        };
      },
    });
  },[subscribeToMore]);

  useEffect(() => {
    if(state && state.showSuccess){
      messageApi.open({type: "success", content: "Post Created!", duration: 3});
      window.history.replaceState({}, document.title, window.location.pathname); // State'i temizlemeyi sağlar.
    }
  },[state, messageApi]);

  
  if(loading){
    return <Loading />
  }
  if(error){
    return `Error: ${error} kes aw`
  }


  return (
    <>
      {contextHolder}      

      <List
        className="demo-loadmore-list"
        loading={false}
        itemLayout="horizontal"
        //loadMore={loadMore}
        dataSource={data.posts}
        renderItem={item => (
          <List.Item>
              <List.Item.Meta
                avatar={<Avatar src={item.user.profile_photo} />}
                title={<Link to={`/post/${item._id}`} className={styles.listTitle}>{item.title}</Link>}
                description={<Link to={`/post/${item._id}`} className={styles.listItem}>{item.short_description}</Link>}
              />
          </List.Item>
        )}
      />
    </>
  );
}

export default Home