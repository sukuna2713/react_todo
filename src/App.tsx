import React from 'react';
import { useState } from 'react';
import { match, select, when, not, __ } from 'ts-pattern';
import './App.css';

/**
 * 現在のフィルターの状態
 */
type Filter = 'all' | 'checked' | 'unchecked' | 'removed'

/**
 * Todo単品
 */
type Todo = {
  value: string
  readonly id: number
  checked: boolean
  removed: boolean
}

export const App = () => {
  const [text, setText] = useState('')
  //Todoの集合
  const [todos, setTodos] = useState<Todo[]>([])
  //現在のフィルター
  const [filter, setFilter] = useState<Filter>('all')
  //todosステートを更新するコールバック関数
  const handleOnSubmit = () => {
    if (!text) return

    //識別子として現在時刻を使用
    const newTodo: Todo = {
      value: text,
      id: new Date().getTime(),
      checked: false,
      removed: false
    }

    setTodos([newTodo, ...todos])
    setText('')
  }

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value)
  }

  /**
   * 登録済みtodoが編集されたときのコールバック関数
   */

  const handleOnEdit = (id: number, value: string) => {
    //元のTodosのディープコピーをつくる
    const deepCopy = todos.map((todo) => ({ ...todo }))
    //IDが一致するTodoの値をvalueで書き換える
    const newTodos = deepCopy.map((todo) => todo.id === id ? { ...todo, value: value } : todo)

    setTodos(newTodos)
  }

  /**
   * チェックボックスがチェックされたときのコールバック関数
   */
  const handleOnCheck = (id: number, checked: boolean) => {
    const deepCopy = todos.map((todo) => ({ ...todo }))

    const newTodos = deepCopy.map((todo) => todo.id === id ? { ...todo, checked: !checked } : todo)

    setTodos(newTodos)
  }

  /**
   * 削除ボタンを押したときのコールバック関数
   */
  const handleOnRemove = (id: number, removed: boolean) => {
    const deepCopy = todos.map((todo) => ({ ...todo }))

    const newTodos = deepCopy.map((todo) => (todo.id === id ? { ...todo, removed: !removed } : todo))

    setTodos(newTodos)
  }

  /**
   * ゴミ箱を空にするボタンのコールバック関数
   */
  const handleOnEmpty = () => {
    const newTodos = todos.filter((todo) => !todo.removed)
    setTodos(newTodos)
  }

  /**
   * フィルタリング済のTodoリスト
   */
  const filteredTodos = todos.filter((todo) => (
    //filterの内容に応じて返す真偽値を変える
    match(filter)
      .with('all', () => !todo.removed)
      .with('checked', () => todo.checked && !todo.removed)
      .with('unchecked', () => !todo.checked && !todo.removed)
      .with('removed', () => todo.removed)
      .otherwise(() => false)
  ))

  return (
    <div>
      <select defaultValue="all" onChange={(e) => setFilter(e.target.value as Filter)}>
        <option value='all'>すべてのタスク</option>
        <option value='checked'>完了したタスク</option>
        <option value='unchecked'>現在のタスク</option>
        <option value='removed'>ゴミ箱</option>
      </select>
      {filter === 'removed' ? (
        //ゴミ箱表示時のフォーム
        <button
          onClick={handleOnEmpty}
          disabled={todos.filter((todo) => todo.removed).length === 0}
        >
          ゴミ箱を空にする
        </button>
      ) : (
        //ゴミ箱以外の表示時のフォーム
        <form onSubmit={(e) => {
          e.preventDefault()
          handleOnSubmit()
        }}>
          <input
            type="text"
            value={text}
            disabled={filter === 'checked'}
            onChange={(e) => handleOnChange(e)}
          />
          <input
            type="submit"
            value="追加"
            disabled={filter === 'checked'}
            onSubmit={handleOnSubmit}
          />
        </form>
      )}
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
    </div>
  );
};