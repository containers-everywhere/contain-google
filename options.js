function validate_list(htmlId) {
    domain_regex = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/;
    list_element = document.querySelector(htmlId);
    if (list_element.value == "") {return [];}
    list_domains = list_element.value.split("\n");
    validated_domains = [];
    for (list_domain of list_domains) {
	if (list_domain == "") {continue;}
	if (list_domain.match(domain_regex)) {validated_domains.push(list_domain); continue;}
	alert("'" + list_domain + "' is not a valid domain.");
	return [];
    }
    return validated_domains;
}

function fill_list_option(stored_list, idHtml) {
    list_text = (stored_list === undefined) ? "" : stored_list.join("\n");
    document.querySelector(idHtml).value = list_text ? list_text : "";
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
    "whitelist": validate_list("#whitelist"),
    "allowlist": validate_list("#allowlist")
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
	        fill_list_option(res.whitelist, "#whitelist");
          fill_list_option(res.allowlist, "#allowlist");
	});
}

document.addEventListener("DOMContentLoaded", onOptionsPageLoaded);
document.querySelector("form").addEventListener("submit", onOptionsPageSave);
