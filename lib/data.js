import got from 'got';

const endpointUrl = 'https://dev-site4school.pantheonsite.io/wp-json/twentytwentyone-child/v1/special';

export async function getAllIds() {
  const data = await fetchData();
  return data.map(post => ({
    params: {
      id: post.ID.toString(),
    },
  }));
}

export async function getSortedList() {
  const data = await fetchData();

  // Sort the data by post_date in descending order (newest first)
  const sortedData = data.sort((a, b) => {
    const dateA = new Date(a.post_date).getTime();
    const dateB = new Date(b.post_date).getTime();
    return dateB - dateA;
  });

  return sortedData;
}

export async function getData(id) {
  const data = await fetchData();
  return data.find(post => post.ID.toString() === id);
}

export async function getLatestPosts(count = 5) {
  const data = await fetchData();
  return data.slice(0, count);
}

export async function getPostsByCategory(categoryId) {
  const data = await fetchData();
  return data.filter(post => post.category_id === categoryId);
}

async function fetchData() {
  const response = await got(endpointUrl);
  const data = JSON.parse(response.body);
  return data;
}
