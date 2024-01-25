import imgComplete from "./assets/complete.png";
import { FaTrashCan, FaCheck } from 'react-icons/fa6';
import { FaRegEdit } from 'react-icons/fa';

const Card = (props) => {
    const item = props.item;

    return (
        <div className={props.classes} onTransitionEnd={(e) => props.finishRemoveItem(e, item)}>
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
                onBlur={() => props.editItem(null)}> 
                
                </input>) :
            (<p className="toDoDesc">{item.desc}</p>)
            }
            <button onClick={!item.deleting ? (() => props.editItem(item)) : () => {} }><FaRegEdit /></button>
            <button onClick={!item.deleting ? (() => props.queueRemoveItem(item)) : () => {} }><FaTrashCan /></button>
            <button onClick={!item.deleting ? (() => props.markComplete(item)) : () => {} }><FaCheck /></button>
        </div>
    )
}

export default Card;