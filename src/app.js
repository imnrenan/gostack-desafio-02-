const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validadeId(resquest, response, next){
  const{ id } = resquest.params;

  if(!isUuid(id)){
    return response.status(400).json({
      error: 'invalid respository id'
    })

    return next();
  }
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const {title, url, tech} = request.body;

  const repository = {id: uuid(), title, url, tech, likes:0};

  repositories.push(repository);

  return response.json(repository);


});

app.put("/repositories/:id", (request, response) => {
  const {id} = request.params;
  const {title, url, tech} = request.body;

  const repositoryIndex = repositories.findIndex(repository => repository.id == id)

  if(repositoryIndex < 0){
    return response.status(400).json({
      error : 'Repository not found'
    })
  }

  const repository = { ...repositories[repositoryIndex], title, url, tech}

  repositories[repositoryIndex] = repository;

  return response.json(repository)


});

app.delete("/repositories/:id", (req, res) => {
  const {id} = req.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id == id)

  if(repositoryIndex < 0){
    return response.status(400).json({
      error : 'Repository not found'
    })
  }

  repositories.splice(repositoryIndex, 1)

  res.status(204).send()
});

app.post("/repositories/:id/like", (request, response) => {
  const {id} = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id == id)

  if(repositoryIndex < 0){
    return response.status(400).json({
      error : 'Repository not found'
    })
  }
  const likes = repositories[repositoryIndex].likes + 1
  const repository = {
    ...repositories[repositoryIndex],
    likes
  }
  repositories[repositoryIndex] = repository
  return response.json(repository)
});

module.exports = app;
