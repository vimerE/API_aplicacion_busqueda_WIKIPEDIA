/**
 * STEPS:
 *
 * 1. Extract all selectors, create helper functions
 * 2. Read through the API's documentation and understand what needs to be included in the params of the request,
 *    create a generic params object
 * 3. Register event listeners, fetch the data per the user's input
 * 4. Output results to the UI (success and error)
 * 5. Adjust UI states accordingly
 */

const submitButton = document.querySelector('#btnSearch');
const input = document.querySelector('#txtSearch');
const errorSpan = document.querySelector('#error');
const resultsContainer = document.querySelector('#results');

const endpoint = 'https://es.wikipedia.org/w/api.php?';
const params = {
    origin: '*',
    format: 'json',
    action: 'query',
    prop: 'extracts',
    exchars: 250,
    exintro: true,
    explaintext: true,
    generator: 'search',
    gsrlimit: 20,
};

const disableUi = () => {
    input.disabled = true;
    submitButton.disabled = true;
};

const enableUi = () => {
    input.disabled = false;
    submitButton.disabled = false;
};

const clearPreviousResults = () => {
    resultsContainer.innerHTML = '';
    errorSpan.innerHTML = '';
};

const isInputEmpty = input => {
    if (!input || input === '') return true;
    return false;
};

const showError = error => {
    //errorSpan.innerHTML = `🚨 ${error} 🚨`;
    errorSpan.innerHTML = `<div class="alert alert-danger" role="alert">
							  Error de búsqueda
							</div>`;
};

const showResults = results => {

	resultsContainer.innerHTML += `<div class="card-group">`;
	    results.forEach(result => {
	        resultsContainer.innerHTML += `
				<div class="card mb-2" style="width: 18rem;">
					<a href="https://es.wikipedia.org/?curid=${result.pageId}" target="_blank" class="card animated bounceInUp">
					  <div class="card-body">
					    <h5 class="card-title">${result.title}</h5>
					    <p class="card-text">${result.intro}</p>
					  </div>
					</a>
				</div>
	    `;
	    });
    resultsContainer.innerHTML += `</div>`;
};



const gatherData = pages => {
    const results = Object.values(pages).map(page => ({
        pageId: page.pageid,
        title: page.title,
        intro: page.extract,
    }));

    showResults(results);
};

const getData = async () => {
    const userInput = input.value;
    if (isInputEmpty(userInput)) return;

    params.gsrsearch = userInput;
    clearPreviousResults();
    disableUi();

    try {
        const { data } = await axios.get(endpoint, { params });

        if (data.error) throw new Error(data.error.info);
        gatherData(data.query.pages);
    } catch (error) {
        showError(error);
    } finally {
        enableUi();
    }
};

const handleKeyEvent = e => {
    if (e.key === 'Enter') {
        getData();
    }
};

const registerEventHandlers = () => {
    input.addEventListener('keydown', handleKeyEvent);
    submitButton.addEventListener('click', getData);
};

registerEventHandlers();