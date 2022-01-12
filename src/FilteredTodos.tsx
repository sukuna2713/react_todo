import { Dispatch, memo, useContext } from 'react'
import { match, select, when, not, __ } from 'ts-pattern'
import { AppContext } from './AppContext'

export const FilteredTodos = memo(() => {
    const { state, dispatch } = useContext(AppContext)

    const handleOnEdit = (id: number, value: string) => {
        dispatch({ type: 'edit', id, value })
    }

    const handleOnCheck = (id: number, checked: boolean) => {
        dispatch({ type: 'check', id, checked })
    }

    const handleOnRemove = (id: number, removed: boolean) => {
        dispatch({ type: 'remove', id, removed })
    }

    /**
     * フィルタリング済のTodoリスト
     */
    const filteredTodos = state.todos.filter((todo) => (
        //filterの内容に応じて返す真偽値を変える
        match(state.filter)
            .with('all', () => !todo.removed)
            .with('checked', () => todo.checked && !todo.removed)
            .with('unchecked', () => !todo.checked && !todo.removed)
            .with('removed', () => todo.removed)
            .otherwise(() => false)
    ))

    return (
        <ul>
            {filteredTodos.map((todo) => {
                return (
                    <li key={todo.id}>
                        <input
                            type='checkbox'
                            disabled={todo.removed}
                            checked={todo.checked}
                            onChange={(e) => handleOnCheck(todo.id, todo.checked)}
                        />
                        <input
                            type='text'
                            //チェック済のタスクは入力フォームを無効にする
                            disabled={todo.checked || todo.removed}
                            value={todo.value}
                            onChange={(e) => handleOnEdit(todo.id, e.target.value)}
                        />
                        <button onClick={() => handleOnRemove(todo.id, todo.removed)}>
                            {todo.removed ? '復元' : '削除'}
                        </button>
                    </li>
                )
            })}
        </ul>
    )
})

FilteredTodos.displayName = 'FilteredTodos'