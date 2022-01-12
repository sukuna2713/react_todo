import React from 'react';
import { useReducer } from 'react';
import { reducer } from './reducer'
import { initialState } from './initialState';
import { match, select, when, not, __ } from 'ts-pattern';
import './App.css';
import { userInfo } from 'os';

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
  const [state, dispatch] = useReducer(reducer, initialState)
  //todosステートを更新するコールバック関数
  const handleOnSubmit = () => {
    dispatch({ type: 'submit' })
  }

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'change', text: e.target.value })
  }

  /**
   * 登録済みtodoが編集されたときのコールバック関数
   */

  const handleOnEdit = (id: number, value: string) => {
    dispatch({ type: 'edit', id, value })
  }

  /**
   * チェックボックスがチェックされたときのコールバック関数
   */
  const handleOnCheck = (id: number, checked: boolean) => {
    dispatch({ type: 'check', id, checked })
  }

  /**
   * 削除ボタンを押したときのコールバック関数
   */
  const handleOnRemove = (id: number, removed: boolean) => {
    dispatch({ type: 'remove', id, removed })
  }

  /**
   * ゴミ箱を空にするボタンのコールバック関数
   */
  const handleOnEmpty = () => {
    dispatch({ type: 'empty' })
  }

  /**
   * フィルター変更時のコールバック関数
   */
  const handleOnFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch({ type: 'filter', filter: e.target.value as Filter })
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
    <div>
      <select defaultValue="all" onChange={handleOnFilter}>
        <option value='all'>すべてのタスク</option>
        <option value='checked'>完了したタスク</option>
        <option value='unchecked'>現在のタスク</option>
        <option value='removed'>ゴミ箱</option>
      </select>
      {state.filter === 'removed' ? (
        //ゴミ箱表示時のフォーム
        <button
          onClick={handleOnEmpty}
          disabled={state.todos.filter((todo) => todo.removed).length === 0}
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