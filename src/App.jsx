import { useState } from 'react'
import { FaTrashCan, FaPlus, FaCheck } from 'react-icons/fa6';
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
  const [rerender, setRerender] = useState(0);

  const addItem = () => {
    const item = new ToDoItem("To Do Item " + items.length);
    const tempItems = ([...items]);
    tempItems.push(item);
    setItems(tempItems);
  }

  const editItem = (selectedItem) => {
    items.map((item) => item.editMode = false); // Set all items editModes to false;
    selectedItem.editMode = true;
    setItems([...items]) // Force rerender.
  }

  // Starts the deletion animation. An onTransitionEnd listener on the item itself
  // will remove the item from the list after the animation finishes.
  const queueRemoveItem = (selectedItem) => {
    selectedItem.deleting = true;
    setRerender(rerender + 1);
  }

  const removeItemFromList = (item) => {
    if (!item || !item.deleting) return;
    let tempItems = items.splice(items.indexOf(item), 1);
    setItems([...tempItems]);
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
          <div key={index} className={classes} onTransitionEnd={(e, item) => removeItemFromList(item)}>
            {item.editMode === true ? 
              (<input type="text" className="editable toDoDesc" onChange={(e) => {item.desc = e.target.value}} defaultValue={item.desc} autoFocus onFocus={(e) => e.target.select()} ></input>) :
              (<p className="toDoDesc">{item.desc}</p>)
            }
            {(!item.deleting) && <button onClick={() => editItem(item)}><FaRegEdit /></button>}
            {(!item.deleting) && <button onClick={() => queueRemoveItem(item)}><FaTrashCan/></button>}
            {(!item.deleting) && <button onClick={() => queueRemoveItem(item)}><FaCheck/></button>}
          </div>
        )
      })}

      <button onClick={addItem}><FaPlus/></button>
    </>
  )
}

export default App
