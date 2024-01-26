import { useState, useEffect } from 'react'
import { FaPlus } from 'react-icons/fa6';
import { BiSolidCrown } from "react-icons/bi";
import { Card, ToDoItem } from "./TodoCard";
import './App.css'

function App() {
  
  const [defaultItems, setDefaultItems] = useState([
    new ToDoItem(0, "Finish making the todo app."),
    new ToDoItem(1, "Add some polish."), 
    new ToDoItem(2, "Submit the assignment")]);
  const [items, setItems] = useState(defaultItems);
  const [index, setIndex] = useState(defaultItems.length);

  const addItem = () => {
    const item = new ToDoItem(index, "Item " + (index + 1), true);
    const tempItems = ([...items]);

    tempItems.push(item);
    setItems(tempItems);

    // Every ToDoCard needs a unique ID, so increase by one every time a new Card is created.
    setIndex(index + 1);
  }
  
  // Keep track of how many tasks have been completed.
  let completedTasks = 0;
  items.map((item) => {if (item.complete) completedTasks += 1})

  return (
    <>
      <h1>To Do List</h1>
      {/* Progress bar fills depending on percentage of complete tasks, and displays a crown when the list is all checked off */}
      <h2>Tasks Complete: {completedTasks} {(completedTasks == items.length && items.length > 0) && <BiSolidCrown className="crown"/>}</h2>

      <div className="meterHolder">
        <div className="meter"
          style={{width: (completedTasks/items.length) * 100 + "%"}}>
        </div>
      </div>
      <div className="toDoCards">  
        {items.map((item) => {
          return (
            <Card 
              key={item.index} 
              item={item}
              items={items}
              setItems={setItems}
            />
          )
        })}

        <button className="plusBtn" onClick={addItem}><FaPlus/></button>
      </div>
    </>
  )
}

export default App
