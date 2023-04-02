import { CommandInteraction, SlashCommandBuilder, time } from "discord.js";
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
      const interactionResponse = allTasksArray.reduce((acc, current) => {
        const isoDate = Date.parse(current.taskDate);
        const jsDate = new Date();
        jsDate.setTime(+isoDate);
        const discDate = time(jsDate, "R");
        return (acc += `- ${current.content} (${discDate}) \n`);
      }, "");

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
        const interactionResponse = pendingTasks.reduce((acc, current) => {
          const isoDate = Date.parse(current.taskDate);
          const jsDate = new Date();
          jsDate.setTime(+isoDate);
          const discDate = time(jsDate, "R");
          return (acc += `- ${current.content} (${discDate}) \n`);
        }, "");

        interaction.reply(interactionResponse);
      }
    }
  },
};
