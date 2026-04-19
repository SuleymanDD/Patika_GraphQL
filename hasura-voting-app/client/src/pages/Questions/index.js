import { Link } from "react-router-dom"
import { useSubscription } from "@apollo/client/react"
import { QUESTIONS_SUBSCRIPTION } from "./queries"
import Loading from "../../components/Loading";
import Error from "../../components/Error";

function Questions() {

  const { loading, data, error } = useSubscription(QUESTIONS_SUBSCRIPTION);


  if (loading) {
    return <Loading />
  }

  if (error) {
    return <Error message={error.message} />
  }

  return (
    <div>
      {
        data.questions.map((question) => {
          return <div key={question.id}><Link to={`/q/${question.id}`}>{question.title}</Link></div>
        })
      }
    </div>
  )
}

export default Questions