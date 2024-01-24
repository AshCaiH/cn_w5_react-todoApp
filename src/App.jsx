import { useState } from 'react'
import { FaTrashCan, FaPlus } from 'react-icons/fa6';
import { FaRegEdit } from 'react-icons/fa';
import './App.css'

class ToDoItem {
  constructor (desc) {
    this.desc = desc;
    this.complete = false;
    this.editMode = false;
    this.deleting = false;
  }

  render() {
    return (
      <></>
    )
  }
}

const startingItems = [new ToDoItem("Finish the todo assignment."), new ToDoItem("Test 2")];

function App() {
  const [items, setItems] = useState(startingItems);

  const addItem = () => {
    const item = new ToDoItem("Default description " + items.length);
    const tempItems = ([...items]);
    tempItems.push(item);
    setItems(tempItems);
  }

  const editItem = (selectedItem) => {
    items.map((item) => item.editMode = false); // Set all items editModes to false;
    selectedItem.editMode = true;
    setItems([...items]) // Force rerender.
  }

  const removeItem = (selectedItem) => {
    const tempItems = items;
    selectedItem.deleting = true;
    setItems([...tempItems])    
    
    setTimeout(() => {
      tempItems.splice(items.indexOf(selectedItem), 1);
      setItems([...tempItems]) // Force rerender.
    }, 800);
  }

  return (
    <>
      {items.map((item, index) => {
        let classes = "toDoCard";
        if (item.deleting === true) {
          console.log(item.deleting);
          classes += " deleting";
        }

        return (
          <div key={index} className={classes}>
            {item.editMode === true ? 
              (<input type="text" className="editable toDoDesc" onChange={() => {}} value={item.desc}></input>) :
              (<p className="toDoDesc">{item.desc}</p>)
            }
            <button onClick={() => editItem(item)}><FaRegEdit /></button>
            {(!item.deleting) && <button onClick={() => removeItem(item)}><FaTrashCan/></button>}
          </div>
        )
      })}

      <button onClick={addItem}><FaPlus/></button>
    </>
  )
}

export default App
