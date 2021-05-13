import { useState } from 'react' 

const AddTask = ({ onAdd }) => {
    const [text, setText] = useState('')
    const [day, setDay] = useState('')
    const [reminder, setReminder] = useState(false)

    const onSubmit = (e) => {
        e.preventDefault()

        if(!text) {
            alert('Please add an interview.')
            return
        }
        
        onAdd({ text, day, reminder })

        setText('')
        setDay('')
        setReminder(false)
    }

    return (
        <form className='add-form' onSubmit={onSubmit}>
            <div className='form-control'>
                <label>Interview</label>
                <input 
                  type='text' 
                  placeholder='Add Interview' 
                  value={text} 
                  onChange={
                    (e) => setText(e.target.value)
                  } 
                />
            </div>
            <div className='form-control'>
                <label>Date and Time</label>
                <input 
                  type='text' 
                  placeholder='Add Day & Time' 
                  value={day} 
                  onChange={
                    (e) => setDay(e.target.value)
                  } 
                />
            </div>
            <div className='form-control form-control-check'>
                <label>Set Active</label>
                <input 
                  type='checkbox'
                  checked={reminder}
                  value={reminder} 
                  onChange={
                    (e) => setReminder(e.currentTarget.checked)
                  } 
                />
            </div>

            <input 
              type='submit' 
              value='Save Interview' 
              className='btn btn-block' 
            />
        </form>
    )
}

export default AddTask
