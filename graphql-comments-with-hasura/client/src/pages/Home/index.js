import {React, useEffect} from "react";
import { Avatar, List, message} from 'antd';
import { useSubscription } from "@apollo/client/react";
import Loading from "components/Loading";
import {POSTS_SUBSCRIPTION} from "./queries"
import {Link, useLocation} from "react-router-dom"
import styles from "./styles.module.css"


function Home() {
  const { loading, error, data} = useSubscription(POSTS_SUBSCRIPTION);

  const [messageApi, contextHolder] = message.useMessage();
  const location = useLocation();
  const { state } = location;


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
                title={<Link to={`/post/${item.id}`} className={styles.listTitle}>{item.title}</Link>}
                description={<Link to={`/post/${item.id}`} className={styles.listItem}>{item.short_description}</Link>}
              />
          </List.Item>
        )}
      />
    </>
  );
}

export default Home