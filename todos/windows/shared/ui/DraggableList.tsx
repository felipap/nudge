import { AnimatePresence } from 'framer-motion'
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DraggableAttributes,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { type ReactNode } from 'react'

const DEBUG = false

interface Props<T> {
  items: T[]
  getItemId: (item: T) => string
  onReorder: (startIndex: number, endIndex: number) => void
  renderItem: (props: {
    item: T
    dragHandleProps: DraggableAttributes
  }) => ReactNode
}

export function DraggableList<T>({
  items,
  getItemId,
  onReorder,
  renderItem,
}: Props<T>) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
        // delay: 100,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) {
      return
    }

    if (DEBUG) {
      console.log('DraggableList handleDragEnd:', {
        activeId: active.id,
        overId: over.id,
        items: items.map((item, i) => ({
          index: i,
          id: getItemId(item),
        })),
      })
    }

    const oldIndex = items.findIndex((item) => getItemId(item) === active.id)
    const newIndex = items.findIndex((item) => getItemId(item) === over.id)

    if (DEBUG) {
      console.log('DraggableList indices:', { oldIndex, newIndex })
    }
    onReorder(oldIndex, newIndex)
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-col gap-0 h-full w-full">
        <SortableContext
          items={items.map(getItemId)}
          strategy={verticalListSortingStrategy}
        >
          {items.map((item) => (
            <AnimatePresence>
              <SortableItem
                key={getItemId(item)}
                id={getItemId(item)}
                renderItem={(dragHandleProps) =>
                  renderItem({ item, dragHandleProps })
                }
              />
            </AnimatePresence>
          ))}
        </SortableContext>
      </div>
    </DndContext>
  )
}

interface SortableItemProps {
  id: string
  renderItem: (dragHandleProps: DraggableAttributes) => ReactNode
}

function SortableItem({ id, renderItem }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} tabIndex={undefined}>
      {renderItem({ ...attributes, ...listeners })}
    </div>
  )
}
