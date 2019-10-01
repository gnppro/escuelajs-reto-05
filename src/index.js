const $app = document.getElementById('app');
const $observe = document.getElementById('observe');
const API = 'https://pokeapi.co/api/v2/pokemon';

const getData = api => {
  fetch(api)
    .then(response => response.json())
    .then(async response => {
      const nextFetch = response.next;
      localStorage.setItem('next_fetch', nextFetch);
      const characters = response.results;
      let charactersDetail = characters.map(async character => {
        let characterDetail = await getCharacter(character.url);
        let objectCharacter = await characterDetail.json();
        return objectCharacter;
      });
      let allCharactersDetail = Promise.all(charactersDetail);
      return allCharactersDetail;
    })
    .then(characters => {
      let output = characters
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
    })
    .catch(error => console.log(error));
};

const getCharacter = url => {
  return new Promise(resolve => {
    fetch(url).then(res => resolve(res));
  });
};

const loadData = () => {
  getData(API);
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
