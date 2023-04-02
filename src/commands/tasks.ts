import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { getTasks, TasksResponse } from "../services/task";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("tasks")
    .addBooleanOption((option) =>
      option.setName("all").setDescription("Display all of your tasks?")
    )
    .setDescription("List tasks"),
  async execute(interaction: CommandInteraction) {
    const showAll = interaction.options.get("all")?.value as boolean;

    const allTasks: TasksResponse = await getTasks(
      interaction.user.username,
      interaction.user.id
    );
    const allTasksArray = Object.values(allTasks)
      .map((val) => val.tasks)
      .flat();

    // all OPTION SET TO TRUE:
    if (showAll) {
      const allTaskContents = allTasksArray.map((t) => t.content);
      const interactionResponse = allTaskContents.reduce(
        (acc, content) => (acc += `- ${content} \n`),
        ""
      );

      interaction.reply(interactionResponse);
    }

    // all OPTION FALSE OR OMITTED
    else {
      const pendingTasks = allTasksArray.filter((t) => t.taskStatus === 0);
      if (pendingTasks.length === 0) {
        interaction.reply({
          content: `You have no pending tasks (add option "all" to see all tasks)`,
          ephemeral: true,
        });
      } else {
        const pendingTasksContents = pendingTasks.map(t => t.content);
        const interactionResponse = pendingTasksContents.reduce(
          (acc, content) => (acc += `- ${content} \n`),
          ""
        );
        interaction.reply(interactionResponse);
      }
    }
  },
};
