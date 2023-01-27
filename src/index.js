import SimpleLightbox from 'simplelightbox';
import './css/style.css';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import { fetchApiImages } from './css/fetch-api';

let page = 1;
let gallery = new SimpleLightbox('div.gallery a', {
  captionsData: 'alt',
  captionDelay: 500,
});

const refs = {
  searchForm: document.querySelector('#search-form'),
  formGallery: document.querySelector('.gallery'),
  formInput: document.querySelector('input'),
  formGuard: document.querySelector('.js-guard'),
};

refs.searchForm.addEventListener('submit', onSubmitForm);
refs.formInput.addEventListener('input', onInput);

function onSubmitForm(e) {
  e.preventDefault();
  page = 1;
  getData(refs.formInput.value, page);
}

function onInput(e) {
  if (e.target.value) {
    refs.formGallery.innerHTML = '';
  }
}

async function getData(query, page) {
  try {
    const data = await fetchApiImages(query, page);
    imageList(data);
    gallery.refresh();
    observer.observe(refs.formGuard);
    return data;
  } catch (error) {
    console.log(error.message);
  }
}

function imageList({ data: { hits: photoCard }, data: { totalHits } }) {
  notifyOptions(photoCard, totalHits);

  const markup = photoCard
    .map(image => {
      const {
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      } = image;

      return `<div class="photo-card">
  <a href="${largeImageURL}" class="gallery__item"><img src="${webformatURL}" alt="${tags}" class="gallery__image"  loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      ${likes}
    </p>
    <p class="info-item">
      <b>Views</b>
      ${views}
    </p>
    <p class="info-item">
      <b>Comments</b>
      ${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>
      ${downloads}
    </p>
  </div>
</div></a>`;
    })
    .join('');

  refs.formGallery.insertAdjacentHTML('beforeend', markup);
}

function notifyOptions(photoCard, totalHits) {
  if (page === 1 && photoCard.length === 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }

  if (page > totalHits / 40 && photoCard.length !== 0) {
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
  }

  if (page === 1 && photoCard.length !== 0) {
    console.log(page);
    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
  }
}

const options = {
  root: null,
  rootMargin: '250px',
  threshold: 1.0,
};

let observer = new IntersectionObserver(onLoad, options);

function onLoad(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      page += 1;
      getData(refs.formInput.value, page).then(data => {
        const {
          data: { hits },
        } = data;

        if (page === 13 || hits.length < 40) {
          observer.unobserve(refs.formGuard);
        }
      }).catch(err => console.log(err))
    }
  });
}


