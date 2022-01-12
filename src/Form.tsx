import { useContext, memo } from 'react'
import { AppContext } from './AppContext'

export const Form = memo(() => {
    //stateとdispatchがAppContextより提供される
    const { state, dispatch } = useContext(AppContext)
    const handleOnSubmit = () => {
        dispatch({ type: 'submit' })
    }

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch({ type: 'change', text: e.target.value })
    }

    return (
        <form onSubmit={(e) => {
            e.preventDefault()
            handleOnSubmit()
        }}>
            <input
                type="text"
                value={state.text}
                disabled={state.filter === 'checked'}
                onChange={(e) => handleOnChange(e)}
            />
            <input
                type="submit"
                value="追加"
                disabled={state.filter === 'checked'}
                onSubmit={handleOnSubmit}
            />
        </form>
    )
})

Form.displayName = 'Form'