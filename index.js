const express = require("express");

const server = express();

server.use(express.json());

let numberOfRequests = 0;
const projects = [
  { id: "1", title: "Novo Projeto", task: [] },
  { id: "2", title: "Segundo Projeto", task: [] }
];

// Midleware para contar o numero de requisições
function logRequest(req, res, next) {
  numberOfRequests++;

  console.log(`Numero de requisições: ${numberOfRequests}`);
  return next();
}
// uso global do Midleware
server.use(logRequest);

//Midleware queverifica se o projeto ja existe com base no ID
function checkIdExists(req, res, next) {
  const { id } = req.params;
  const project = projects.find(p => p.id == id);

  if (!project) {
    return res.status(400).json({ error: "Project not found" });
  }
  return next();
}

//verifica se o nome ou id do projeto estão em uso. Utilização no PUT
function chekProjectIdAndName(req, res, next) {
  const { id, title } = req.body;
  const project = projects.find(p => p.id == id || p.title == title);

  if (project) {
    return res.json({ error: "Project name or project ID alredy in use" });
  }
  return next();
}

server.get("/projects", (req, res) => {
  return res.json(projects);
});

server.get("/projects/:id", checkIdExists, (req, res) => {
  const { id } = req.params;

  for (let i = 0; i <= projects.length; i++) {
    if (id === projects[i].id) {
      return res.json(projects[i]);
    }
  }
});

server.post("/projects", chekProjectIdAndName, (req, res) => {
  const { id, title } = req.body;

  projects.push({ id, title, task: [] });

  return res.json(projects);
});

server.post("/projects/:id/task", checkIdExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  for (let i = 0; i <= projects.length; i++) {
    if (id === projects[i].id) {
      projects[i].task.push(title);
      return res.json(projects);
    }
  }
});

server.put("/projects/:id", checkIdExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  for (let i = 0; i <= projects.length; i++) {
    if (id === projects[i].id) {
      projects[i].title = title;
      return res.json(projects);
    }
  }
});

server.delete("/projects/:id", checkIdExists, (req, res) => {
  const { id } = req.params;

  for (let i = 0; i <= projects.length; i++) {
    if (id === projects[i].id) {
      projects.splice(i, 1);
      return res.send();
    }
  }
});

server.listen(3000);
