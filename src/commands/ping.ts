import { CommandInteraction, SlashCommandBuilder } from "discord.js";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("is this thing on??"),
  async execute(interaction : CommandInteraction) {
    await interaction.reply("Pong!");
  },
};
