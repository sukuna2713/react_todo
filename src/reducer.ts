import { state } from "fp-ts";
import { match, select } from "ts-pattern";

export const reducer = (state: State, action: Action): State => (
    match<Action, State>(action)
        //テキストボックスの変更反映
        .with({ type: 'change', text: select() }, (selection) => ({ ...state, text: selection }))
        //チェックボックスの入れ替え
        .with({ type: 'check', id: select('id'), checked: select('isChecked') }, (selection) => {
            const deepCopy = state.todos.map((todo) => ({ ...todo }))

            //IDが一致するTODOのチェックを入れ替える
            const newTodos = deepCopy.map(
                (todo) => (todo.id === selection.id ? { ...todo, checked: !selection.isChecked } : todo)
            )
            return { ...state, todos: newTodos }
        })
        //TODOのテキストの書き換え
        .with({ type: 'edit', id: select('id'), value: select('value') }, (selection) => {
            const deepCopy = state.todos.map((todo) => ({ ...todo }))

            //IDが一致するTODOの中身を書き換える
            const newTodos = deepCopy.map(
                (todo) => (todo.id === selection.id ? { ...todo, value: selection.value } : todo)
            )
            return { ...state, todos: newTodos }
        })
        //ゴミ箱を空にする
        .with({ type: 'empty' }, () => {
            const newTodos = state.todos.filter((todo) => !todo.removed)
            return { ...state, todos: newTodos }
        })
        //フィルターの変更
        .with({ type: 'filter', filter: select() }, (selection) => ({ ...state, filter: selection }))
        //TODOの削除
        .with({ type: 'remove', id: select('id'), removed: select('removed') }, (selection) => {
            const deepCopy = state.todos.map((todo) => ({ ...todo }))

            //IDが一致するTODOの削除済みを入れ替える
            const newTodos = deepCopy.map(
                (todo) => (todo.id === selection.id ? { ...todo, removed: !selection.removed } : todo)
            )
            return { ...state, todos: newTodos }
        })
        //TODOの追加
        .with({ type: 'submit' }, () => {
            if (!state.text) return state
            const newTodo: Todo = {
                value: state.text,
                id: new Date().getTime(),
                checked: false,
                removed: false,
            }
            return { ...state, todos: [newTodo, ...state.todos], text: '' }
        })
        .otherwise(() => state)
)