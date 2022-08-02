import { createStore } from "vuex";
import { noteModule } from "./noteModule";

export default createStore({
	modules: {
		note: noteModule,
	}
})