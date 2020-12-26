import { useState, useEffect } from 'react';
import PokemonList from './PokemonList';
import Pagination from './Pagination';
import axios from 'axios';

function App() {
  const [pokemon, setPokemon] = useState([]);
  const [currentPageURL, setCurrentPageURL] = useState("https://pokeapi.co/api/v2/pokemon");
  const [nextPageUrl, setNextPageUrl] = useState();
  const [prevPageUrl, setPrevPageUrl] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => { //Use Effect chamado sempre que a currentPageUrl é alterada
    setLoading(true);
    let cancel;

    axios.get(currentPageURL, { 
      cancelToken: new axios.CancelToken( c => cancel = c)
    }).then(res => {
      setLoading(false);
      setNextPageUrl(res.data.next);
      setPrevPageUrl(res.data.previous);
      setPokemon(res.data.results.map(poke => poke.name));
    })
    return () => cancel(); //Cancela a req sempre que for feita uma nova
      
  }, [currentPageURL]);

  function gotoPrevPage() {
    setCurrentPageURL(prevPageUrl);
  }

  function gotoNextPage() {
    setCurrentPageURL(nextPageUrl);
  }

  if (loading) return "Loading..."

  return (
    <>
      <PokemonList pokemon={pokemon}/>
      <Pagination
        gotoPrevPage={prevPageUrl ? gotoPrevPage : null}
        gotoNextPage={nextPageUrl ? gotoNextPage : null}
      />
    </>
  );
}

export default App;
