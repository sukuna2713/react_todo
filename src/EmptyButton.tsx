import { Dispatch, memo } from 'react'

//Propsに変化がない限りEmptyButtonで描画されるコンポーネントは再計算されない
type Props = {
    dispatch: Dispatch<Action>
}

/**
 * ゴミ箱を空にするボタンを切り出してメモ化
 */
export const EmptyButton = memo((props: Props) => {
    const handleOnEmpty = () => {
        props.dispatch({ type: 'empty' })
    }

    return <button onClick={handleOnEmpty}>ゴミ箱を空にする</button>
})

EmptyButton.displayName = 'EmptyButton'