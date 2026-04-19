import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSubscription, useMutation } from '@apollo/client/react'
import { DETAIL_SUBSCRIPTION, VOTE_MUTATION } from './queries'

import Loading from '../../components/Loading'
import Error from '../../components/Error'

function Detail() {
    const { id } = useParams();

    const [selectedVoteId, setSelectedVoteId] = useState();
    const [isVoted, setIsVoted] = useState(false);

    const { loading, error, data } = useSubscription(DETAIL_SUBSCRIPTION, {
        variables: { id: parseInt(id) }
    });

    const [newVote, { loading: voteLoading }] = useMutation(VOTE_MUTATION, {
        onCompleted: () => {
            setIsVoted(true);
        }
    });

    const handleClickVote = () => {
        newVote({
            variables: {
                input: { option_id: selectedVoteId }
            }
        })
    }

    if (loading) {
        return <Loading />
    }

    if (error) {
        return <Error message={error.message} />
    }

    const {
        questions_by_pk: {
            title,
            options
        }
    } = data;

    const totalVotes = options.reduce((t, option) => t + option.votes_aggregate.aggregate.count, 0);


    return (
        <div>
            <h2>{title}</h2>
            {
                options.map((option, i) => {
                    return (
                        <div key={i}>
                            <label htmlFor={i}>
                                <input type="radio" name="selected" id={i} value={option.id} onChange={({ target }) => { setSelectedVoteId(target.value) }} />
                                <span>{option.title}</span>
                                {isVoted && (
                                    <span className='vote_count'>(%{(option.votes_aggregate.aggregate.count * 100 / (totalVotes === 0 ? 1 : totalVotes)).toFixed(2)})</span>
                                )}
                            </label>

                            {isVoted && (
                                <div>
                                    <progress value={option.votes_aggregate.aggregate.count} max={totalVotes} />
                                </div>
                            )}

                        </div>
                    )
                })
            }
            {!isVoted && (
                <button disabled={voteLoading} onClick={handleClickVote}>Vote</button>
            )}

        </div>
    )
}

export default Detail