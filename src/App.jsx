import { useState } from 'react'
import { FaTrashCan, FaPlus, FaCheck } from 'react-icons/fa6';
import { FaRegEdit } from 'react-icons/fa';
import imgComplete from "./assets/complete.png";
import './App.css'

let index = 0;

class ToDoItem {
  constructor (desc) {
    // Set the index here so each individual item can be tracked separately.
    // Prevents problems when items are removed from the list.
    this.index = index;
    index += 1;
    this.desc = desc;
    this.complete = false;
    this.editMode = false;
    this.deleting = false;  // Is in the process of being deleted.
    this.deleted = false; // Can be removed from the list;
    
    // Rotates the "complete" stamp randomly for each item.
    this.stampRotation = Math.random() * 30 - 15;
  }
}

const startingItems = [new ToDoItem("Finish the todo page."), new ToDoItem("Polish it"), new ToDoItem("Submit the assignment")];

function App() {
  const [items, setItems] = useState(startingItems);

  const addItem = () => {
    const item = new ToDoItem("To Do Item " + items.length);
    const tempItems = ([...items]);

    tempItems.push(item);
    setItems(tempItems);
  }

  const editItem = (selectedItem) => {
    items.map((item) => item.editMode = false); // Set all items editModes to false;
    if (selectedItem) selectedItem.editMode = true;
    setItems([...items]) // Force rerender.
  }

  // Starts the deletion animation. An onTransitionEnd listener on the item itself
  // will remove the item from the list after the animation finishes.
  const queueRemoveItem = (selectedItem) => {
    selectedItem.deleting = true;
    refreshList();
  }

  const finishRemoveItem = (e, selectedItem) => {
    if (!e.target.classList.contains("toDoCard") ) return;
    selectedItem.deleted = true;
    refreshList();
  }

  // Removes items from the list 
  const refreshList = () => {
    let tempItems = []
    items.map((item) => {if (!item.deleted) tempItems.push(item)});
    setItems(tempItems);
  }

  const markComplete = (selectedItem) => {
    selectedItem.complete = !selectedItem.complete;
    refreshList();
  }

  return (
    <>
      {/* Remove deleted items from the list */}      
      {items.map((item) => {
        let classes = "toDoCard";
        if (item.deleting === true) classes += " deleting";
        if (item.complete === true) classes += " complete";

        return (
          <div key={item.index} className={classes} onTransitionEnd={(e) => finishRemoveItem(e, item)}>
            <img src={imgComplete} className="imgComplete" style={{rotate: item.stampRotation + "deg"}}/>
            <div className="toDoSpacer"></div>
            {item.editMode === true ? 
              (<input type="text" 
                className="editable toDoDesc" 
                onChange={(e) => {item.desc = e.target.value}} 
                defaultValue={item.desc} 
                autoFocus 
                onFocus={(e) => e.target.select()} 
                // Deactivates edit mode when textbox isn't in focus.
                onBlur={() => editItem(null)}> 
                </input>) :
              (<p className="toDoDesc">{item.desc}</p>)
            }
            <button onClick={!item.deleting ? (() => editItem(item)) : () => {} }><FaRegEdit /></button>
            <button onClick={!item.deleting ? (() => queueRemoveItem(item)) : () => {} }><FaTrashCan /></button>
            <button onClick={!item.deleting ? (() => markComplete(item)) : () => {} }><FaCheck /></button>
          </div>
        )
      })}

      <button onClick={addItem}><FaPlus/></button>
    </>
  )
}

export default App
