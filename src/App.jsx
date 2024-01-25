import { useState, useEffect } from 'react'
import { FaPlus } from 'react-icons/fa6';
import { BiSolidCrown } from "react-icons/bi";
import Card from "./TodoCard";
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
    
    // Rotates the "complete" stamp randomly for each item.
    this.stampRotation = Math.random() * 30 - 15;
  }
}

const startingItems = [new ToDoItem("Finish making the todo app."), new ToDoItem("Add some polish."), new ToDoItem("Submit the assignment")];

function App() {
  const [items, setItems] = useState(startingItems);

  const addItem = () => {
    const item = new ToDoItem("To Do Item " + index);
    const tempItems = ([...items]);

    tempItems.push(item);
    editItem(item);
    setItems(tempItems);

  }

  const editItem = (selectedItem) => {
    items.map((item) => item.editMode = false); // Set all items editModes to false;
    if (selectedItem) selectedItem.editMode = true;
    refreshList(); // Force rerender
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

  let completedTasks = 0;
  items.map((item) => {if (item.complete) completedTasks += 1})

  const keyPress = (e) => {
    // Listens for Enter keypress, and exits edit mode.
    if (e.key == "Enter") editItem(null);
  }

  useEffect(() => {
    document.addEventListener("keydown", keyPress);
    return () => document.removeEventListener("keydown" , keyPress);
  });

  return (
    <>
      <h1>To Do List</h1>
      <h2>Tasks Complete: {completedTasks} {completedTasks == items.length && <BiSolidCrown className="crown"/>}</h2>

      <div className="meterHolder">
        <div className="meter"
            style={{width: (completedTasks/items.length) * 100 + "%"}}>
        </div>
      </div>
      <div className="toDoCards">
        {/* Remove deleted items from the list */}      
        {items.map((item) => {

          // Track number of completed tasks.
          let completed = 0;
          let classes = "toDoCard";

          if (item.deleting === true) classes += " deleting";
          if (item.complete === true) classes += " complete";

          return (
            <Card 
              key={item.index} 
              item={item} 
              classes={classes}
              editItem={editItem}
              queueRemoveItem={queueRemoveItem}
              finishRemoveItem={finishRemoveItem}
              markComplete={markComplete}
            />
          )
        })}

        <button className="plusBtn" onClick={addItem}><FaPlus/></button>
      </div>
    </>
  )
}

export default App
