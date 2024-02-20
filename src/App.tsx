import { gql, useQuery } from "@apollo/client";
import "./App.css";
import { useState } from "react";

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
        id
      }
    }
  }
`;

const CHARACTER_CHARACTER = (id: string) => gql`
  {
    character(id: ${id}) {
      __typename
      id
      name
      status
      species
      gender
      origin {
        name
      }
      location {
        name
      }
      image
    }
  }
`;

function App() {
  const [page, setPage] = useState<number>(1);
  const [id, setId] = useState<string>("1");
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);

  const { data, loading, error } = useQuery(CHARACTERS_CHARACTERS(page));
  const {
    data: dataModal,
    loading: loadingModal,
    error: errorModal,
  } = useQuery(CHARACTER_CHARACTER(id));

  let pagination = [];
  for (let i = 1; i <= data?.characters?.info.pages; i++) {
    pagination.push(
      <button key={i} onClick={() => setPage(i)}>
        {i}
      </button>
    );
  }

  if (loading) return "Loading...";
  if (error) return <pre>{error.message}</pre>;

  const showInfos = (id: string) => {
    setId(id);
    setModalIsOpen(true);
  };

  return (
    <div>
      <h1>Rick and Morty Characters</h1>
      <div>{pagination}</div>
      <div>
        {data?.characters?.results?.map((character, index) => {
          return (
            <div key={index} onClick={() => showInfos(character.id)}>
              <img src={character.image} alt={character.name} />
              <p>{character.name}</p>
            </div>
          );
        })}
        {modalIsOpen && (
          <div className="overlay">
            <div className="modal">
              <div className="modal-header">
                <h2>Character Infos</h2>
                <button
                  className="danger"
                  onClick={() => setModalIsOpen(false)}>
                  Close
                </button>
              </div>
              <div className="modal-body">
                <div>
                  {loadingModal ? (
                    <p>Loading...</p>
                  ) : (
                    <div className="modal-infos">
                      <img
                        src={dataModal?.character?.image}
                        alt={dataModal?.character?.name}
                      />
                      <ul className="list">
                        {dataModal?.character?.name ? (
                          <li>Name: {dataModal?.character?.name}</li>
                        ) : null}
                        {dataModal?.character?.origin.name ? (
                          <li>Origin: {dataModal?.character?.origin.name}</li>
                        ) : null}
                        {dataModal?.character?.gender ? (
                          <li>Gender: {dataModal?.character?.gender}</li>
                        ) : null}
                        {dataModal?.character?.status ? (
                          <li>Status: {dataModal?.character?.status}</li>
                        ) : null}
                        {dataModal?.character?.sliecies ? (
                          <li>Sliecies: {dataModal?.character?.sliecies}</li>
                        ) : null}
                        {dataModal?.character?.location.name ? (
                          <li>
                            Location: {dataModal?.character?.location.name}
                          </li>
                        ) : null}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {pagination}
    </div>
  );
}

export default App;
