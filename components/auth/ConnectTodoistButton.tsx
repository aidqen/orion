import { connectTodoist } from "@/services/client/todoist";
import { TodoistIcon } from "../Icons/TodoistIcon";
import { Button } from "../ui/button";

export function ConnectTodoistButton({}) {
	return (
		<Button
			onClick={connectTodoist}
			className="bg-[#E44332] hover:bg-[#c93a2b] text-white"
		>
			<TodoistIcon />
			Connect Todoist
		</Button>
	);
}
