import React, { useState, useEffect } from "react";
import api from './services/api';

import "./styles.css";

function App() {
  const [repositories, setRepositories] = useState([]);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [techs, setTechs] = useState('');

  useEffect(() => {
    api.get('repositories').then(response => {

      setRepositories(response.data);
    })
  }, [])

  async function handleAddRepository() {

    const repository = {
      title,
      url,
      techs: techs.split(',').map(tech => tech.trim())
    }

    const response = await api.post('repositories', repository)

    setRepositories(prevRepo => [...prevRepo, response.data])
  }

  async function handleRemoveRepository(id) {
    try {
      await api.delete(`repositories/${id}`)
      setRepositories(prevRepo => prevRepo.filter(repo => repo.id !== id))
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div>
      <form onSubmit={handleAddRepository}>
        <input onChange={event => setTitle(event.target.value)} type="text" placeholder="title" />
        <input onChange={event => setUrl(event.target.value)} type="text" placeholder="url" />
        <input onChange={event => setTechs(event.target.value)} type="text" placeholder="techs" />
        <button type="submit">Adicionar</button>
      </form>


      <ul data-testid="repository-list">
        {repositories.map(repository =>
        (<li key={repository.id}>
          {repository.title}
          <button onClick={() => handleRemoveRepository(repository.id)}>
            Remover
          </button>
        </li>)
        )
        }
      </ul>
    </div>
  );
}

export default App;
