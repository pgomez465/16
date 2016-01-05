import {join, dirname}		from 'path';

export const STATIC_DIR = join(__dirname, '..', 'static');
export const BOOTSTRAP_DIST = join(dirname(require.resolve('bootstrap')), '..');
