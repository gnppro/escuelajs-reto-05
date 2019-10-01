const $app = document.getElementById('app');
const $observe = document.getElementById('observe');
const API = 'https://pokeapi.co/api/v2/pokemon';
localStorage.setItem('next_fetch', API);

const getData = async api => {
  try {
    let getCharactersList = await fetch(api);
    let objectCharactersList = await getCharactersList.json();

    const nextFetch = objectCharactersList.next;
    localStorage.setItem('next_fetch', nextFetch);
    const characters = objectCharactersList.results;

    let charactersDetail = characters.map(async character => {
      let characterDetail = await getCharacter(character.url);
      let objectCharacter = await characterDetail.json();
      return objectCharacter;
    });

    let allCharactersDetail = await Promise.all(charactersDetail);

    let output = allCharactersDetail
      .map(character => {
        return `
      <article class="Card">
        <img src="${character.sprites.front_default}" />
        <h2>${character.name}<span>${character.id}</span></h2>
      </article>
    `;
      })
      .join('');

    let newItem = document.createElement('section');
    newItem.classList.add('Items');
    newItem.innerHTML = output;
    $app.appendChild(newItem);
  } catch (error) {
    console.log(error);
  }
};

const getCharacter = url => {
  return new Promise(resolve => {
    fetch(url).then(res => resolve(res));
  });
};

const loadData = () => {
  let url = localStorage.getItem('next_fetch');
  if (url) {
    getData(url);
  } else {
    // getData(API);
    console.log('Ya no hay personajes');
  }
};

const intersectionObserver = new IntersectionObserver(
  entries => {
    if (entries[0].isIntersecting) {
      loadData();
    }
  },
  {
    rootMargin: '0px 0px 100% 0px'
  }
);

intersectionObserver.observe($observe);
