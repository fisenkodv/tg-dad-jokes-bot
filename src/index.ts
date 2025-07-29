#!/usr/bin/env node

import 'dotenv/config';
import { Markup, session, Telegraf } from 'telegraf';
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

bot.start(context => {
  const greeting = `Welcome ${context.update.message.from.first_name} ${context.update.message.from.last_name}`;
  const keyboard = Markup.keyboard(['Get me a joke!']);

  context.reply(greeting, keyboard);
});

bot.on(message('text'), async context => {
  try {
    const {
      from: { first_name, last_name },
      text
    } = context.message;
    logger.info("The user (%s,%s) sent message '%s'", first_name, last_name, text);

    const joke = await jokesService.getJoke();

    if (joke) {
      const keyboard = joke.punchline ? Markup.inlineKeyboard([Markup.button.callback('Show a punchline!', `${joke.id}`)]) : undefined;
      context.replyWithHTML(joke.setup, keyboard);
    }
  } catch (error) {
    logger.error("An error '%s' occurred providing a joke", error);
  }
});

bot.on(callbackQuery('data'), async context => {
  try {
    const message_ = context.callbackQuery.data;
    const { first_name, last_name } = context.callbackQuery.from;
    logger.info('The user (%s,%s) requested a punchline to joke with ID %d', first_name, last_name, message_);

    const jokeId = context.callbackQuery.data;
    const joke = await jokesService.getJokeById(jokeId);

    if (joke) {
      const formattedJoke = `${joke.setup}\n\u2014<i>${joke.punchline}</i>`;
      context.editMessageText(formattedJoke, { parse_mode: 'HTML' });
    }
  } catch (error) {
    logger.error("An error '%s' occurred providing a punchline", error);
  }
});

bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
