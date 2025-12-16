import { randomUUID } from 'node:crypto'
import { Database } from './database.js'
import { buildRoutePath } from './utils/build-route-path.js';

const database = new Database()

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { search } = req.query


      const tasks = database.select('tasks', search ? {
        title: search,
        description: search
      } : null)

      return res.end(JSON.stringify(tasks))
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.body

      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date(),
        updated_at: new Date()
      }

      database.insert('tasks', task)

      return res.end(JSON.stringify(task))
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res ) => {
      const { id } = req.params
      const { title, description } = req.body

      const task = database.find('tasks', id)

      if (!task) {
        return res.writeHead(404).end(
          JSON.stringify({ message: 'Task not found!' })
        )
      }

      const updatedTask = database.update('tasks', id, {
        title,
        description,
        updated_at: new Date()
      })

      return res.end(JSON.stringify(updatedTask))
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const { id } = req.params
      const task = database.find('tasks', id)

      if (!task) {
        return res.writeHead(404).end(
          JSON.stringify({ message: 'Task not found!' })
        )
      }

      const completedAt = task.completed_at ? null : new Date()

      const updatedTask = database.update('tasks', id, {
        completed_at: completedAt,
        updated_at: new Date()
      })

      return res.end(JSON.stringify(updatedTask))
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params
      const task = database.find('tasks', id)
      
      if (!task) {
        return res.writeHead(404).end(
          JSON.stringify({ message: 'Task not found!' })
        )
      }

      database.delete('tasks', id)
      return res.writeHead(204).end()
    }
  },
  // {
  //   method: 'POST',
  //   path: buildRoutePath('/tasks/import'),
  //   handler: () => {}
  // }
];