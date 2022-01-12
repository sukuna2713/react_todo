import { Dispatch, memo } from 'react'
import { match, select, when, not, __ } from 'ts-pattern'

//Propsに変化がない限りFilteredTodosで描画されるコンポーネントは再計算されない
type Props = {
    state: State
    dispatch: Dispatch<Action>
}

export const FilteredTodos = memo((props: Props) => {
    const handleOnEdit = (id: number, value: string) => {
        props.dispatch({ type: 'edit', id, value })
    }

    const handleOnCheck = (id: number, checked: boolean) => {
        props.dispatch({ type: 'check', id, checked })
    }

    const handleOnRemove = (id: number, removed: boolean) => {
        props.dispatch({ type: 'remove', id, removed })
    }

    /**
     * フィルタリング済のTodoリスト
     */
    const filteredTodos = props.state.todos.filter((todo) => (
        //filterの内容に応じて返す真偽値を変える
        match(props.state.filter)
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