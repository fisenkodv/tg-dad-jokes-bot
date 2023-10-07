import { query } from '../db';
import { Joke, Nullable } from '../types';
import { logger } from '../utils';

export class JokesService {
  async getJoke(): Promise<Nullable<Joke>> {
    try {
      const result = await query('SELECT id, joke, answer FROM jokes ORDER BY random() LIMIT 1');
      return result.rows.at(0) as Joke;
    } catch (error) {
      logger.error("An error '%s' occurred getting a random joke", error);
    }

    return null;
  }

  async getJokeById(id: number): Promise<Nullable<Joke>> {
    try {
      const result = await query('SELECT id, joke, answer FROM jokes WHERE id = $1', id);
      const joke = result.rows.at(0) as Joke;

      if (!joke) {
        logger.warn('Unable to find a joke by ID %d', id);
        return null;
      }

      return joke;
    } catch (error) {
      logger.error("An error '%s' occurred getting a joke with ID %d", error, id);
    }

    return null;
  }
}
