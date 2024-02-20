import { gql, useQuery } from '@apollo/client'
import './App.css'
import { useState } from 'react';

const CHARACTERS_CHARACTERS = (page: number) => gql`
  {
    characters(page: ${page}) {
      __typename
      info {
        count
        pages
        next
        prev
      }
      results {
        __typename
        name
        image
      }
    }
  }
`

function App() {

  const [page, setPage] = useState<number>(1)

  const { data, loading, error } = useQuery(CHARACTERS_CHARACTERS(page));

  let pagination = []
  for(let i = 1; i <= data?.characters?.info.pages; i++) {
    pagination.push(<button onClick={() => setPage(i)}>{i}</button>)
  }

  if (loading) return "Loading...";
  if (error) return <pre>{error.message}</pre>

  return (
    <div>
      <h1>Rick and Morty Characters</h1>
      <div>
        {pagination}
      </div>
      <div>
        {
          data?.characters?.results?.map(character => {
            return (<div>
              <img src={character.image} alt={character.name} />
              <p>{character.name}</p>
            </div>)
          })
        }
      </div>
      {pagination}
    </div>
  )
}

export default App
