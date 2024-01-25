import imgComplete from "./assets/complete.png";
import { FaTrashCan, FaCheck } from 'react-icons/fa6';
import { FaRegEdit } from 'react-icons/fa';
import { useEffect } from "react";

class ToDoItem {
    constructor (id, desc, isNew) {
        // Set the index here so each individual item can be tracked separately.
        // Prevents problems when items are removed from the list.
        this.index = id;
        this.desc = desc;
        this.complete = false;
        this.editMode = isNew;
        this.deleting = false;  // Starts the deletion process
        
        // Rotates the "complete" stamp randomly for each item.
        this.stampRotation = Math.random() * 40 - 20;
    }
}

const Card = (props) => {
    const item = props.item;
    const items = props.items;
    const setItems = props.setItems;    

    let classes = "toDoCard";

    if (item.deleting === true) classes += " deleting";
    if (item.complete === true) classes += " complete";

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
        items.map((item) => {
            if (!item.deleted) tempItems.push(item)
            // If an item should be in edit mode, run the editItem function.
            // Required to automatically trigger edit mode on new items.
            if (item.editMode) editItem(item); 
        });
        setItems(tempItems);
    }

    const markComplete = (selectedItem) => {
        selectedItem.complete = !selectedItem.complete;
        refreshList();
    }
        
    const keyPress = (e) => {
        // Listens for an enter key press and quits edit mode.
        if (e.key == "Enter") editItem(null);
    }
        
    useEffect(() => {
        document.addEventListener("keydown", keyPress);
        return () => document.removeEventListener("keydown" , keyPress);
    });

    return (
        <div className={classes} onTransitionEnd={(e) => finishRemoveItem(e, item)}>
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
}

export { Card, ToDoItem };