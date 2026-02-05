// BROWSER-ONLY: Uses document.body

export const grab = {
	start: () => document.body.classList.add("gesture-grabbing"),
	end: () => document.body.classList.remove("gesture-grabbing"),
};
