import React, { useState } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import './Drag.css'
import { FaCheck } from 'react-icons/fa'

const skillsets = [
  {
    id: '1',
    skill: 'Team Leadership'
  },
  {
    id: '2',
    skill: 'Front End Web Development'
  },
  {
    id: '3',
    skill: 'Product Ownership'
  },
  {
    id: '4',
    skill: 'Project Management'
  },
  {
    id: '5',
    skill: 'CMS Administration'
  }
]

const Drag = () => {
    const [skills, updateSkills] = useState(skillsets)

    function handleOnDragEnd(result) {
        if (!result.destination) return

        const items = Array.from(skills)
        const [reorderedItem] = items.splice(result.source.index, 1)
        items.splice(result.destination.index, 0, reorderedItem)

        updateSkills(items)
    }

    return (
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="skills">
            {(provided) => (
              <ul className="skills" {...provided.droppableProps} ref={provided.innerRef}>
                {skills.map(({id, skill}, index) => {
                  return (
                    <Draggable key={id} draggableId={id} index={index}>
                      {(provided) => (
                        <li ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                          <div className="skill-thumb">
                            <FaCheck />
                          </div>
                          <p>
                            { skill }
                          </p>
                        </li>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
    )
}

export default Drag
