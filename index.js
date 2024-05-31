const {
  Client,
  GatewayIntentBits,
  Partials,
  Collection,
  EmbedBuilder,
} = require("discord.js");
require("./keepalive.js");
const { Guilds, GuildMembers, GuildMessages } = GatewayIntentBits;
const { User, Message, GuildMember, ThreadMember } = Partials;
const afkSchema = require("./Schemas/afkSchema");

const client = new Client({
  intents: 3276799,
  partials: [User, Message, GuildMember, ThreadMember],
});

const { loadEvents } = require("./Handlers/eventHandler");
const { loadbButtons } = require("./Handlers/buttonHandler");

client.config = require("./config.json");
client.events = new Collection();
client.commands = new Collection();
client.buttons = new Collection();

loadEvents(client);
loadbButtons(client);

client.login(client.config.token);
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  const check = await afkSchema.findOne({
    Guild: message.guild.id,
    User: message.author.id,
  });
  if (check) {
    const nick = check.Nickname;
    await afkSchema.deleteMany({
      Guild: message.guild.id,
      User: message.author.id,
    });

    await message.member.setNickname(`${nick}`).catch((err) => {
      return;
    });

    const m1 = await message.reply({
      content: `Bienvenido de nuevo, **${message.author}**! Has **removido** tu **AFK**`,
      ephemeral: true,
    });
    setTimeout(() => {
      m1.delete();
    }, 4000);
  } else {
    const members = message.mentions.users.first();
    if (!members) return;
    const Data = await afkSchema.findOne({
      Guild: message.guild.id,
      User: members.id,
    });
    if (!Data) return;

    const member = message.guild.members.cache.get(members.id);
    const msg = Data.Message || "Ninguna razón dada";

    if (message.content.includes(members)) {
      const m = await message.reply({
        content: `👤•Este miembro **${member.user.tag}** esta actualmente en estado **AFK**, No lo menciones en este momento | **Motivo:** ${msg}`,
      });
      setTimeout(() => {
        m.delete();
        message.delete();
      }, 4000);
    }
  }
});
