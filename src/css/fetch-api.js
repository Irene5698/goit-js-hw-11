import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api';
const KEY = '33123311-9a7e60ca24d50e4929545da03';

export async function fetchApiImages(query, page) {
  const response = await axios.get(
    `${BASE_URL}/?key=${KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`
  );
  return response;
}
fetchApiImages();
