import 'dotenv/config';
import { Markup, Telegraf, session } from 'telegraf';
import { callbackQuery, message } from 'telegraf/filters';
import { JokesService } from './services';
import { logger } from './utils';

const token = process.env.BOT_TOKEN as string;

if (!token) {
  console.error('Error: no token provided');
  process.exit();
}

const bot = new Telegraf(token);
bot.use(session());

const jokesService = new JokesService();

bot.start(ctx => {
  const greeting = `Welcome ${ctx.update.message.from.first_name} ${ctx.update.message.from.last_name}`;
  const keyboard = Markup.keyboard(['Get me a joke!']);

  ctx.reply(greeting, keyboard);
});

bot.on(message('text'), async ctx => {
  try {
    const {
      from: { first_name, last_name },
      text
    } = ctx.message;
    logger.info("The user (%s,%s) sent message '%s'", first_name, last_name, text);

    const joke = await jokesService.getJoke();

    if (joke) {
      const keyboard = joke.answer ? Markup.inlineKeyboard([Markup.button.callback('Get the answer!', `${joke.id}`)]) : undefined;
      ctx.replyWithHTML(joke.joke, keyboard);
    }
  } catch (error) {
    logger.error("An error '%s' occurred providing a joke", error);
  }
});

bot.on(callbackQuery('data'), async ctx => {
  try {
    const msg = ctx.callbackQuery.data;
    const { first_name, last_name } = ctx.callbackQuery.from;
    logger.info('The user (%s,%s) requested an answer to joke with ID %d', first_name, last_name, msg);

    const jokeId = Number.parseInt(ctx.callbackQuery.data);
    const joke = await jokesService.getJokeById(jokeId);

    if (joke) {
      const formattedJoke = `${joke.joke}\n\u2014<i>${joke.answer}</i>`;
      ctx.editMessageText(formattedJoke, { parse_mode: 'HTML' });
    }
  } catch (error) {
    logger.error("An error '%s' occurred providing an answer", error);
  }
});

bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
