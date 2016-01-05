import knexLib		from 'knex';
import bookshelfLib	from 'bookshelf';
import dbConfig		from '../knexfile';

export const knex = knexLib(dbConfig);

export const bookshelf = bookshelfLib(knex);
bookshelf.plugin('registry');

export default bookshelf;
