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
      id: new Date().getTime()
    }

    setTodos([newTodo, ...todos])
    setText('')
  }

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value)
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
          return <li key={todo.id}>{todo.value}</li>
        })}
      </ul>
    </div>
  );
};