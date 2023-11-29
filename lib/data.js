import got from 'got';

const endpointUrl = 'https://dev-site4school.pantheonsite.io/wp-json/twentytwentyone-child/v1/special';

export async function getAllIds() {
  const data = await fetchSpecialData();
  return data.map(post => ({
    params: {
      id: post.ID.toString(),
    },
  }));
}

export async function getSortedList() {
  const data = await fetchSpecialData();
  const sortedData = data.sort((a, b) => compareDates(b.post_date, a.post_date));
  return sortedData;
}

export async function getData(id) {
  const data = await fetchSpecialData();
  return data.find(post => post.ID.toString() === id);
}

export async function getLatestPosts(count = 5) {
  const data = await fetchSpecialData();
  return data.slice(0, count);
}

export async function getPostsByCategory(categoryId) {
  const data = await fetchSpecialData();
  return data.filter(post => post.category_id === categoryId);
}

async function fetchSpecialData() {
  try {
    const response = await got(endpointUrl);
    const data = JSON.parse(response.body);
    return data;
  } catch (error) {
    console.error('Error fetching special data:', error);
    return []; // Return an empty array or handle the error as needed
  }
}

function compareDates(dateA, dateB) {
  const timeA = new Date(dateA).getTime();
  const timeB = new Date(dateB).getTime();
  return timeB - timeA;
}
