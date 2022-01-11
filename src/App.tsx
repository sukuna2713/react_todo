import React from 'react';
import logo from './logo.svg';
import { useState } from 'react';
import './App.css';

/**
 * Todo単品
 */
type Todo = {
  value: string
  readonly id: number
  checked: boolean
}

export const App = () => {
  const [text, setText] = useState('')
  //Todoの集合
  const [todos, setTodos] = useState<Todo[]>([])

  //todosステートを更新するコールバック関数
  const handleOnSubmit = () => {
    if (!text) return

    //識別子として現在時刻を使用
    const newTodo: Todo = {
      value: text,
      id: new Date().getTime(),
      checked: false
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

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleOnSubmit()
        }}
      >
        <input type="text" value={text} onChange={(e) => handleOnChange(e)} />
        <input
          type="submit"
          value="追加"
          onSubmit={handleOnSubmit}
        />
      </form>
      <ul>
        {todos.map((todo) => {
          return (
            <li key={todo.id}>
              <input
                type='checkbox'
                checked={todo.checked}
                onChange={(e) => handleOnCheck(todo.id, todo.checked)}
              />
              <input
                type='text'
                //チェック済のタスクは入力フォームを無効にする
                disabled={todo.checked}
                value={todo.value}
                onChange={(e) => handleOnEdit(todo.id, e.target.value)}
              />
            </li>
          )
        })}
      </ul>
    </div>
  );
};