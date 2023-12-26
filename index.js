const express = require('express')
const pool = require('./db.js')

const app = express()
const router = express.Router()
const PORT = 7000

app.use(express.json())
app.use('/api', router)

router.get('/get_all_tasks', async (req, res) => {
  
  const client = await pool.connect()

  try {
    const result = await client.query('SELECT * FROM tasks')

    res.status(200).json(result.rows)
  }
  catch (error) {
    res.status(500).json(message.error)
  }
  finally {
    client.release()
  }
})

router.post('/add_task', async (req, res) => {
  const { title, description } = req.body
  const client = await pool.connect()

  try {
    const values = [title, description]
    const query = 'INSERT INTO tasks(title, description) VALUES($1, $2)'
    
    await client.query(query, values)

    res.status(201).json({ success: true })
  }
  catch (error) {
    res.status(500).json({ message: error.message })
  }
  finally {
    client.release()
  }
})

router.put('/update_task', async (req, res) => {
  const { id, title, description } = req.body
  const client = await pool.connect()

  try {
    const values = [id, title, description]
    const query = `UPDATE tasks
                   SET title = $2, description = $3
                   WHERE id = $1`

    const result = await client.query(query, values)

    if (result.rowCount > 0) {
      res.status(204).json({ message: 'Successfuly updated task.' })
    }
    else {
      res.status(404).json({ message: 'Record not found.' })
    }
  } 
  catch (error) {
    res.status(500).json({ message: error.message })
  }
  finally {
    client.release()
  }
})

router.delete('/delete_task', async (req, res) => {
  const { id } = req.body
  const client = await pool.connect()

  try {
    const values = [id]
    const query = `DELETE FROM tasks
                   WHERE id = $1`

    await client.query(query, values)
    res.status(204).json({ success: true, message: 'Successfuly deleted the task.' })
  }  
  catch (error) {
    res.status(500).json({ message: error.message })
  }
  finally {
    client.release()
  }
})

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))