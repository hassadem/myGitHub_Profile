const name = 'Isa Hassan';
const specialization = 'Software-Engineer';
const username = 'hassadem';
const apiUrl = `https://api.github.com/users/${username}`;
const reposPerPage = 8;
let currentPage = 1;
let repositories = [];

async function fetchData() {
  try {
    const profileData = await fetchProfile();
    repositories = await fetchRepositories();
    showProfile(profileData);
    displayRepositories();
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

async function fetchProfile() {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching profile data:', error);
    return {};
  }
}

async function fetchRepositories() {
  try {
    const response = await fetch(`${apiUrl}/repos`);
    const repositories = await response.json();
    return repositories;
  } catch (error) {
    console.error('Error fetching repositories:', error);
    return [];
  }
}

function showProfile(data) {
  const profilePicture = document.querySelector('.profile-picture');
  const fullNameElement = document.querySelector('.full-name');
  const usernameElement = document.querySelector('.username');
  const specializationElement = document.querySelector('.specialization');
  const followersElement = document.querySelector('.followers');
  const followingElement = document.querySelector('.following');
  const repositoriesCountElement = document.querySelector('.repositories-count');

  profilePicture.src = data.avatar_url;
  fullNameElement.textContent = name;
  usernameElement.textContent = `${data.login}`;
  specializationElement.textContent = `${specialization}`;
  followersElement.textContent = `${data.followers} Followers`;
  followingElement.textContent = `Following ${data.following}`;
  repositoriesCountElement.textContent = `Repositories: ${repositories.length}`;
}

async function fetchRepositories() {
  try {
    const response = await fetch(`${apiUrl}/repos`);
    const repositories = await response.json();
    return repositories;
  } catch (error) {
    console.error('Error fetching repositories:', error);
    return [];
  }
}

function displayRepositories() {
  const repoGrid = document.querySelector('.repo-grid');
  repoGrid.innerHTML = '';

  const startIndex = (currentPage - 1) * reposPerPage;
  const endIndex = startIndex + reposPerPage;

  const reposToShow = repositories.slice(startIndex, endIndex);

  reposToShow.forEach((repo) => {
    const repoBlock = document.createElement('a');
    repoBlock.href = repo.html_url;
    repoBlock.target = '_blank'; // Open the link in a new tab
    repoBlock.classList.add('repo-block');

    const repoName = document.createElement('span');
    repoName.classList.add('repo-name');
    repoName.textContent = repo.name;

    const repoLanguage = document.createElement('span');
    repoLanguage.classList.add('repo-language');
    repoLanguage.textContent = repo.language || 'N/A';

    repoBlock.appendChild(repoName);
    repoBlock.appendChild(repoLanguage);
    repoGrid.appendChild(repoBlock);
  });

  updatePaginationButtons();
}

function updatePaginationButtons() {
  const prevButton = document.querySelector('.prev-button');
  const nextButton = document.querySelector('.next-button');

  prevButton.disabled = currentPage === 1;
  nextButton.disabled = currentPage === Math.ceil(repositories.length / reposPerPage);
}

function goToPrevPage() {
  currentPage--;
  displayRepositories();
}

function goToNextPage() {
  currentPage++;
  displayRepositories();
}

document.querySelector('.prev-button').addEventListener('click', goToPrevPage);
document.querySelector('.next-button').addEventListener('click', goToNextPage);

fetchData();

