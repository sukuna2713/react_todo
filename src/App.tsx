import { useReducer } from 'react'
import { reducer } from './reducer'
import { initialState } from './initialState'
import './App.css';

import { Form } from './Form'
import { Selector } from './Selector'
import { EmptyButton } from './EmptyButton'
import { FilteredTodos } from './FilteredTodos'

export const App = (): JSX.Element => {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <div>
      <Selector dispatch={dispatch} />
      {state.filter === 'removed' ? (
        <EmptyButton dispatch={dispatch} />
      ) : (
        <Form state={state} dispatch={dispatch} />
      )}
      <FilteredTodos state={state} dispatch={dispatch} />
    </div>
  )
}