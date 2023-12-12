import got from 'got';

const teamOneEndpoint = 'https://dev-site4school.pantheonsite.io/wp-json/twentytwentyone-child/v1/team-one';
const teamTwoEndpoint = 'https://dev-site4school.pantheonsite.io/wp-json/twentytwentyone-child/v1/team-two';
const teamThreeEndpoint = 'https://dev-site4school.pantheonsite.io/wp-json/twentytwentyone-child/v1/team-three';

export async function getAllIds() {
  const teamOneData = await fetchData(teamOneEndpoint);
  const teamTwoData = await fetchData(teamTwoEndpoint);
  const teamThreeData = await fetchData(teamThreeEndpoint);

  const allData = [...teamOneData, ...teamTwoData, ...teamThreeData];

  return allData.map(team => ({
    params: {
      id: team.ID.toString(),
    },
  }));
}

export async function getSortedList() {
  const teamOneData = await fetchData(teamOneEndpoint);
  const teamTwoData = await fetchData(teamTwoEndpoint);
  const teamThreeData = await fetchData(teamThreeEndpoint);

  const allData = [...teamOneData, ...teamTwoData, ...teamThreeData];

  const sortedData = allData.sort((a, b) => compareDates(b.post_date, a.post_date));
  return sortedData;
}

export async function getData(id) {
  const teamOneData = await fetchData(teamOneEndpoint);
  const teamTwoData = await fetchData(teamTwoEndpoint);
  const teamThreeData = await fetchData(teamThreeEndpoint);

  const allData = [...teamOneData, ...teamTwoData, ...teamThreeData];

  return allData.find(team => team.ID.toString() === id);
}

export async function getLatestTeams(count = 5) {
  const sortedData = await getSortedList();
  return sortedData.slice(0, count);
}

// Add function to get data by category
export async function getTeamsByCategory(categoryId) {
  const teamOneData = await fetchData(teamOneEndpoint);
  const teamTwoData = await fetchData(teamTwoEndpoint);
  const teamThreeData = await fetchData(teamThreeEndpoint);

  const allData = [...teamOneData, ...teamTwoData, ...teamThreeData];

  return allData.filter(team => team.category_id === categoryId);
}

// Modify the fetch function to handle different endpoints
async function fetchData(url) {
  try {
    const response = await got(url);
    const data = JSON.parse(response.body);
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return []; // Return an empty array or handle the error as needed
  }
}

function compareDates(dateA, dateB) {
  const timeA = new Date(dateA).getTime();
  const timeB = new Date(dateB).getTime();
  return timeB - timeA;
}
