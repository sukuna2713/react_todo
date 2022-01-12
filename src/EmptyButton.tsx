import { memo, useContext } from 'react'
import { AppContext } from './AppContext'

/**
 * ゴミ箱を空にするボタンを切り出してメモ化
 */
export const EmptyButton = memo(() => {
    const { state, dispatch } = useContext(AppContext)
    const handleOnEmpty = () => {
        dispatch({ type: 'empty' })
    }

    return <button onClick={handleOnEmpty}>ゴミ箱を空にする</button>
})

EmptyButton.displayName = 'EmptyButton'