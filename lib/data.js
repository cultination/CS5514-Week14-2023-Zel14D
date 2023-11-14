import got from 'got';

const endpointUrl = 'https://dev-site4school.pantheonsite.io/wp-json/twentytwentyone-child/v1/latest-posts/1';

export async function getAllIds() {
  const response = await got(endpointUrl);
  const data = JSON.parse(response.body);

  return data.map(post => ({
    params: {
      id: post.ID.toString(),
    },
  }));
}

export async function getSortedList() {
  const response = await got(endpointUrl);
  const data = JSON.parse(response.body);

  // Sort the data by post_date in descending order (newest first)
  const sortedData = data.sort((a, b) => {
    const dateA = new Date(a.post_date).getTime();
    const dateB = new Date(b.post_date).getTime();
    return dateB - dateA;
  });

  return sortedData;
}

export async function getData(id) {
  const response = await got(`${endpointUrl}/${id}`);
  const data = JSON.parse(response.body);

  return data;
}

export async function getLatestPosts(count = 5) {
  const response = await got(`${endpointUrl}?per_page=${count}`);
  const data = JSON.parse(response.body);

  return data;
}

export async function getPostsByCategory(categoryId) {
  const response = await got(`${endpointUrl}?category_id=${categoryId}`);
  const data = JSON.parse(response.body);

  return data;
}
