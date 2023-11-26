import { reactive } from "vue";

export const store = reactive({
    chatActive: false,
    profileActive: true,
	foreignProfileActive: false,
	foreignProfileID: 0,
    chatArray: [
        { message_name: "test", message_content: "chat history didn't load :(", from_myself: true },
    ]
})