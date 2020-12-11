import React, {useState} from 'react';

const Checkbox = ({categories, handleFilters}) => {

    const [checked, setChecked] = useState([]);

    const handleToggle = cId => () => {
        // returns first index of category id (cId) or -1
        const currentCategoryId = checked.indexOf(cId); 
        const newCheckedCategoryId = [...checked];
        // if currently checked was not already in check state > push
        if(currentCategoryId === -1){
            newCheckedCategoryId.push(cId);
        }else {
            newCheckedCategoryId.splice(currentCategoryId, 1)
        }

       // console.log(newCheckedCategoryId);
        setChecked(newCheckedCategoryId);

        //activates handle filter in Shop component
        handleFilters(newCheckedCategoryId);
    }


    return categories.map((c, i) => (
        <li className="list-unstyled" key={i}>
            <input onChange={handleToggle(c._id)} value={checked.indexOf(c._id === -1)} type="checkbox" className="form-check-input" />
            <label className="form-check-label">{c.name}</label>
        </li>
    ))
}

export default Checkbox;