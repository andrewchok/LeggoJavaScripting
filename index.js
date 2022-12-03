// get bot token
const myBotToken = process.env['TOKEN'];
const globalPrefix = "!$";

// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits } = require("discord.js");

// Create a new client instance
const client = new Client(
{
  intents:
    [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent
    ]
});

// database setup
const Keyv = require('keyv');
const keyv = new Keyv(); // for in-memory storage
keyv.on('error', err => console.error('Keyv connection error:', err));

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, c => 
{
  console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on(Events.MessageCreate, async message => 
{
  if (message.author.bot) return;

  if (message.content === "ping") {
    message.reply("pong");
  }
  if (message.content === "hello") {
    message.reply("goodbye");
  }
  
	let args;
	// handle messages in a guild
	if (message.guild) 
  {
		let prefix;

		if (message.content.startsWith(globalPrefix)) 
    {
			prefix = globalPrefix;
		}

		// if we found a prefix, setup args; otherwise, this isn't a command
		if (!prefix) return;
		args = message.content.slice(prefix.length).trim().split(/\s+/);
	} 
  else 
  {
		// handle DMs
		const slice = message.content.startsWith(globalPrefix) ? globalPrefix.length : 0;
		args = message.content.slice(slice).split(/\s+/);
	}

	// get the first space-delimited argument after the prefix as the command
	const command = args.shift().toLowerCase();

	if (command === 'set') 
  {
		// if there's two argument
		if (args.length >= 2) 
    {
			await keyv.set(args[0], args[1]);
			return message.channel.send(`Successfully set \`${args[0]}\` to \`${args[1]}\``);
		}

		return message.channel.send(`not enought args for command set`);
	}
  else if (command === 'get')
  {
		// if there's one argument
		if (args.length) 
    {
			returnString = await keyv.get(args[0]);
      if (returnString)
      {
        return message.channel.send(`Successfully get \`${args[0]}\` = \`${returnString}\``);
      }
      else
      {
        return message.channel.send(`\`${args[0]}\` not found in database`);
      }			
		}

		return message.channel.send(`not enought args for command get`);
  }
  else if (command === 'clear')
  {
    await keyv.clear();
    return message.channel.send(`Successfully cleared`);
  }
  else if (command === 'delete')
  {
		// if there's an argument
		if (args.length) 
    {
			if(await keyv.delete(args[0]))
      {        
			  return message.channel.send(`Successfully delete \`${args[0]}\``);
      }
      else
      {
			  return message.channel.send(`\`${args[0]}\` was not found to delete`); 
      }
		}

		return message.channel.send(`not enought args for command delete`);
  }
});

// Log in to Discord with your client's token
client.login(myBotToken);

