import { useState } from 'react'
import { FaTrashCan, FaPlus, FaCheck } from 'react-icons/fa6';
import { FaRegEdit } from 'react-icons/fa';
import imgComplete from "./assets/complete.png";
import './App.css'

class ToDoItem {
  constructor (desc) {
    this.desc = desc;
    this.complete = false;
    this.editMode = false;
    this.deleting = false;  // Is in the process of being deleted.
    
    // Rotates the "complete" stamp randomly for each item.
    this.stampRotation = Math.random() * 30 - 15;
  }
}

const startingItems = [new ToDoItem("Finish the todo page."), new ToDoItem("Polish it"), new ToDoItem("Submit the assignment")];

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

  const removeItemFromList = (e, selectedItem) => {
    if (!e.target.classList.contains("toDoCard") ) return;

    
    // console.log("Deleting");
    // let tempItems = items.splice(items.indexOf(item), 1);
    // setItems([...tempItems]);
  }

  const markComplete = (selectedItem) => {
    selectedItem.complete = !selectedItem.complete;
    setRerender(rerender + 1);
  }

  return (
    <>
      {/* Remove deleted items from the list */}      
      {items.map((item, index) => {
        let classes = "toDoCard";
        if (item.deleting === true) classes += " deleting";
        if (item.complete === true) classes += " complete";

        return (
          <div key={index} className={classes} onTransitionEnd={(e) => removeItemFromList(e, item)}>
            <img src={imgComplete} className="imgComplete" style={{rotate: item.stampRotation + "deg"}}/>
            <div className="toDoSpacer"></div>
            {item.editMode === true ? 
              (<input type="text" className="editable toDoDesc" onChange={(e) => {item.desc = e.target.value}} defaultValue={item.desc} autoFocus onFocus={(e) => e.target.select()} ></input>) :
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
