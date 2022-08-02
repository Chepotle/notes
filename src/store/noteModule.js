export const noteModule = {
	state: () => ({
		newNote: false,
	}),
	getters: {

	},
	mutations: {
		setNewNote(state) {
			state.newNote = true;
		},
		unsetNewNote(state) {
			state.newNote = false;
		},
	},
	actions: {

	},
	namespaced: true
}