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
        this.editMode = isNew; // Newly added Cards are in editMode by default.
        this.deleting = false; // Starts the deletion process
        
        // Rotates the "complete" stamp randomly for each item.
        this.stampRotation = Math.random() * 40 - 20;
    }
}

const Card = (props) => {
    // Simplifying the variable names here to make the code cleaner further down.
    const item = props.item;
    const items = props.items;
    const setItems = props.setItems;    

    // Update element classes for styling.
    let classes = "toDoCard";
    if (item.deleting === true) classes += " deleting";
    if (item.complete === true) classes += " complete";

    const editItem = (selectedItem, e) => {
        // Make sure edit mode is disabled for all items, 
        // before enabling it for the specific item we want.
        items.map((item) => item.editMode = false);
        if (selectedItem) selectedItem.editMode = true;
        refreshList();
    }

    // Starts the deletion animation. An onTransitionEnd listener on the item itself
    // will remove the item from the list after the animation finishes.
    const queueRemoveItem = (selectedItem) => {
        selectedItem.deleting = true;
        refreshList();
    }

    // Removes the element from the list completely, now the animation's finished.
    const finishRemoveItem = (e, selectedItem) => {
        if (!e.target.classList.contains("toDoCard") ) return;
        selectedItem.deleted = true;
        refreshList();
    }

    // Rerenders the page any time there are relevant changes in the list.
    const refreshList = () => {
        let tempItems = []
        items.map((item) => {
            if (!item.deleted) tempItems.push(item)
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
    
    // Prevents more than one keydown event running every time the page rerenders.
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
            (<p className="toDoDesc"
                onDoubleClick={(e) => editItem(item, e)}>
                {item.desc}
            </p>)
            }
            <button onClick={!item.deleting ? ((e) => editItem(item, e)) : () => {} }><FaRegEdit /></button>
            <button onClick={!item.deleting ? (() => queueRemoveItem(item)) : () => {} }><FaTrashCan /></button>
            <button onClick={!item.deleting ? (() => markComplete(item)) : () => {} }><FaCheck /></button>
        </div>
    )
}

export { Card, ToDoItem };