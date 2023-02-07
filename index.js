const express = require('express');
const fs = require('fs/promises');
const path = require('path');
const app = express();
const jsonPath = path.resolve('./tasks.json');
// app.use(express.bodyParser())
app.use(express.json())

app.get('/tasks',async (req, res) => {
    const jsonFile = await fs.readFile(jsonPath, 'utf8');
    res.setHeader('Content-Type', 'application/json')
    res.send(jsonFile);// envia informacion y termina con la peticion 
})

app.post('/tasks', async (req, res) => { 
    const jsonFile = await fs.readFile(jsonPath, 'utf8');
    const tasks = JSON.parse(jsonFile);
    console.log(req.body)
    const task = req.body
    task.id = tasks.length
    tasks.push(task)
    const newJson = JSON.stringify(tasks)
    fs.writeFile(jsonPath, newJson)
    // res.send('Hola desde express');// envia informacion y termina con la peticion 
    res.sendStatus(200);
})

app.put('/tasks', async (req, res) => {
    const jsonFile = await fs.readFile(jsonPath, 'utf8'); // leemos el contenido del archivo de la ruta jsonPath y lo ponemos en la variable jsonFile
    const tasks = JSON.parse(jsonFile);//Aqui convierto el contenido del archivo (jsonFile) en un objecto de javascript (en este caso sera el arreglo de tareas)
    const updateIndex = tasks.findIndex ( task => {
        return task.id === req.body.id
    });
    if(updateIndex === -1) {
        res.sendStatus(404)
    }
    else {
        tasks[updateIndex].status = req.body.status
        const newJson = JSON.stringify(tasks)
        fs.writeFile(jsonPath, newJson)
        res.sendStatus(200)
    }
})

app.delete('/tasks',async (req, res) => {
    const jsonFile = await fs.readFile(jsonPath, 'utf8'); // leemos el contenido del archivo de la ruta jsonPath y lo ponemos en la variable jsonFile
    const tasks = JSON.parse(jsonFile);//Aqui convierto el contenido del archivo (jsonFile) en un objecto de javascript (en este caso sera el arreglo de tareas)
    const removeIndex = tasks.findIndex ( task => {
        return task.id === req.body.id
    });

    if(removeIndex >= 0 ) {
        const deletedTask = tasks[removeIndex];
        tasks.splice (removeIndex, 1)
        console.log(tasks)
        const newJson = JSON.stringify(tasks)
        fs.writeFile(jsonPath, newJson)
        res.json(deletedTask)
    }
    else {
        res.sendStatus(404)
    }
})
 
const PORT = 8000;

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`)
});
