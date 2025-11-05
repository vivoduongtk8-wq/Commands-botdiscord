import {
  Client,
  GatewayIntentBits,
  SlashCommandBuilder,
  Routes,
  REST,
  EmbedBuilder,
} from "discord.js";
import dotenv from "dotenv";
dotenv.config();

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID; // ID server test của bạn nè

// ===== Đăng ký slash command (theo guild) =====
const commands = [
  new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Kiểm tra độ trễ (ping) của bot"),
].map((cmd) => cmd.toJSON());

const rest = new REST({ version: "10" }).setToken(TOKEN);

(async () => {
  try {
    console.log("🔁 Đang đăng ký lệnh /ping cho server test...");
    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
      body: commands,
    });
    console.log("✅ Slash command đã được đăng ký trong guild!");
  } catch (error) {
    console.error(error);
  }
})();

// ===== Khi bot online =====
client.once("ready", () => {
  console.log(`✅ Bot đã đăng nhập với tên ${client.user.tag}!`);
});

// ===== Xử lý lệnh /ping =====
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName === "ping") {
    const start = Date.now();
    await interaction.reply({ content: "🏓 Đang kiểm tra ping...", fetchReply: true });
    const end = Date.now();

    const apiPing = interaction.client.ws.ping;
    const botPing = end - start;

    const embed = new EmbedBuilder()
      .setColor("Random")
      .setTitle("🏓 Pong!")
      .setDescription(`**Độ trễ bot:** \`${botPing}ms\`\n**Độ trễ API:** \`${apiPing}ms\``)
      .setFooter({
        text: `Yêu cầu bởi ${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setTimestamp();

    await interaction.editReply({ content: "", embeds: [embed] });
  }
});

client.login(TOKEN);
