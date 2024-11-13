const inputBox =  document.querySelector('.input-box');
const resultsContainer = document.querySelector('.results-container');
const apiUrl = 'https://jsonplaceholder.typicode.com/users';
const container = document.getElementById('searchUsers');

// Debounce function to limit API calls
function debounce(fn, delay) {
    let timeoutId = null;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn.apply(this,args), delay);
    };
}


const fetchUsers = ((query) =>{
     // Check if the query is empty, if so, clear results and return
    if(query.trim()===""){
        clearResults();
        return;
    }
    container.classList.add('instant-search-loading');
    fetch(`${apiUrl}?name_like=${query}`)
    .then(response=> response.json())
    .then(data=>{
        displayResults(data);
        container.classList.remove('instant-search-loading');
    })
    .catch(error=>{
        console.error("Erropr fetching users:", error);
    })
});

const displayResults = (users) =>{
    resultsContainer.innerHTML = "";
    if(users.length===0){
        resultsContainer.innerHTML = "<p>No users found</p>";
    }else{
        users.forEach(user => {
            const resultItem = document.createElement('div');
            resultItem.classList.add('result-item');
            resultItem.textContent = user.name;
            resultItem.addEventListener('click', ()=>{
                inputBox.value = user.name;
                clearResults();
            });
            resultsContainer.appendChild(resultItem);
        });
    }
    resultsContainer.classList.add('results-container--visible');
}

const clearResults = () =>{
    resultsContainer.innerHTML = "";
    resultsContainer.classList.remove('results-container--visible');
}

const handleInput = debounce((e) =>{
    const query = e.target.value;
    console.log(query);
    fetchUsers(query);
},300);

inputBox.addEventListener('input',handleInput);