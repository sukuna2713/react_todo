import { Dispatch, memo } from 'react'

//Propsに変化がない限りFormで描画されるコンポーネントは再計算されない
type Props = {
    state: State
    dispatch: Dispatch<Action>
}

export const Form = memo((props: Props) => {
    const handleOnSubmit = () => {
        props.dispatch({ type: 'submit' })
    }

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        props.dispatch({ type: 'change', text: e.target.value })
    }

    return (
        <form onSubmit={(e) => {
            e.preventDefault()
            handleOnSubmit()
        }}>
            <input
                type="text"
                value={props.state.text}
                disabled={props.state.filter === 'checked'}
                onChange={(e) => handleOnChange(e)}
            />
            <input
                type="submit"
                value="追加"
                disabled={props.state.filter === 'checked'}
                onSubmit={handleOnSubmit}
            />
        </form>
    )
})

Form.displayName = 'Form'