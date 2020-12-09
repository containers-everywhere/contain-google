function validate_whitelist() {
    domain_regex = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/;
    whitelist_element = document.querySelector("#whitelist");
    if (whitelist_element.value == "") {return [];}
    whitelist_domains = whitelist_element.value.split("\n");
    validated_domains = [];
    for (whitelist_domain of whitelist_domains) {
	if (whitelist_domain == "") {continue;}
	if (whitelist_domain.match(domain_regex)) {validated_domains.push(whitelist_domain); continue;}
	alert("'" + whitelist_domain + "' is not a valid domain.");
	return [];
    }
    return validated_domains;
}

function fill_whitelist_option(stored_whitelist) {
    whitelist_text = stored_whitelist.join("\n");
    document.querySelector("#whitelist").value = whitelist_text ? whitelist_text : "";
}


function onOptionsPageSave(e)
{
	e.preventDefault();

	// Save settings
	browser.storage.sync.set({
		"ignore_youtube": document.querySelector("#ignore_youtube").checked,
		"ignore_searchpages": document.querySelector("#ignore_searchpages").checked,
		"ignore_prefpages": document.querySelector("#ignore_prefpages").checked,
		"ignore_maps": document.querySelector("#ignore_maps").checked,
		"ignore_flights": document.querySelector("#ignore_flights").checked,
	        "dont_override_containers": document.querySelector("#dont_override_containers").checked,
	        "whitelist": validate_whitelist()
	});

	browser.runtime.reload();
}

function onOptionsPageLoaded()
{
	// Load saved settings or use defaults when nothing was saved yet
	var storageItem = browser.storage.sync.get();
	storageItem.then((res) =>
	{
		document.querySelector("#ignore_youtube").checked = res.ignore_youtube || false;
		document.querySelector("#ignore_searchpages").checked = res.ignore_searchpages || false;
		document.querySelector("#ignore_prefpages").checked = res.ignore_prefpages || false;
		document.querySelector("#ignore_maps").checked = res.ignore_maps || false;
		document.querySelector("#ignore_flights").checked = res.ignore_flights || false;
		document.querySelector("#dont_override_containers").checked = res.dont_override_containers || false;
	        fill_whitelist_option(res.whitelist);
	});
}

document.addEventListener("DOMContentLoaded", onOptionsPageLoaded);
document.querySelector("form").addEventListener("submit", onOptionsPageSave);
