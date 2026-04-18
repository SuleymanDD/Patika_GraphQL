import { useState } from 'react'

import {useMutation} from "@apollo/client/react"
import {QUESTION_MUTATION} from "./queries"


const initialOptions = [{ title: "" }, { title: "" }];
function New() {
  const [createQuestion, { loading, data }] = useMutation(QUESTION_MUTATION);

  

  const [title, setTitle] = useState("");
  const [options, setOptions] = useState(initialOptions)

  const handleChangeOption = ( {target} ) => {
    const newArray = options;
    newArray[target.id]= target.value;

    setOptions([...newArray]);
  }

  const handleSave = () => {
    const filledOptions = options.filter((option) => option.title !== "");

    if (title === "" || filledOptions.length < 2) return false;

    createQuestion({
      variables: {
        input: {
          title,
          options: {data: filledOptions.map((option) => ({ title: option }))}
        }
      }
    });

    setTitle("");
    setOptions(initialOptions);
  }

  return (
    <div>
      <h2>Question</h2>
      <input
        placeholder='Type your question..'
        value={title}
        onChange={({ target }) => setTitle(target.value)}
        disabled={loading}
      />

      <h2>Options</h2>
      {options.map((option, index) => {
          return <div key={index}><input placeholder='Type your option..' value={option.title} id={index} onChange={handleChangeOption} disabled={loading}></input></div>
      })}

      <button onClick={() => setOptions([...options, {title: ""}])} disabled={loading}>
        New Option
      </button>

      <button onClick={handleSave} disabled={loading}>
        Save
      </button>

    </div>

  )
}

export default New