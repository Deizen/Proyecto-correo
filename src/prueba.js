// import React, { useState } from 'react'
import React, { useState } from 'react'

export const BooleanStringTable = () => {
  const [state, setState] = useState({
    bool: true,
    text: 'text',
    table: [1, 2, 3]
  })

  const handleChange = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.value
    })
  }

  const handleCheckbox = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.checked
    })
  }

  const handleArray = (event) => {
    const { name, value } = event.target
    const index = name.split('-')[1]
    const newArray = [...state.table]
    newArray[index] = value
    setState({
      ...state,
      table: newArray
    })
  }

//   const addArray = () => {
//     setState({
//       ...state,
//       table: [...state.table, '']
//     })
//   }

//   const removeArray = (index) => {
//     const newArray = [...state.table]
//     newArray.splice(index, 1)
//     setState({
//       ...state,
//       table: newArray
//     })
//   }

  return (
    <>
      <input type="checkbox" name="bool" checked={state.bool} onChange={handleCheckbox} />
      <input type="text" name="text" value={state.text} onChange={handleChange} />
      {state.table.map((item, index) => (
        <div key={index}>
          <input type="text" name={`table-${index}`} value={item} onChange={handleArray} />
          <button onClick={() => removeArray(index)}>X</button>
        </div>
      ))}
      <button onClick={addArray}>Add</button>
      <p>{JSON.stringify(state)}</p>
    </>
  )
}
